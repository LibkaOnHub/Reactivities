import { useEffect, useMemo, useState } from "react";
import { useController, type UseControllerProps, type FieldValues } from "react-hook-form";
import { Box, List, ListItemButton, TextField, Typography, debounce } from "@mui/material";
import { type LocationIQSuggestion } from "../../../lib/types";
import axios from "axios";

type Props<T extends FieldValues> =
    {
        label: string;
    }
    & UseControllerProps<T>;

export default function LocationInput<T extends FieldValues>(props: Props<T>) {

    const { field, fieldState } = useController({ ...props });

    // proměnné s lokálním stavem // za useState je parametr s výchozí hodnotou

    // příznak načítání komponenty
    const [loading, setLoading] = useState(false);

    // pole s výsledky z Location IQ
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);

    const [inputValue, setInputValue] = useState(field.value || ""); // výchozí hodnota

    useEffect(
        () => {
            if (field.value && typeof field.value === "object") {
                // pokud je hodnota objekt, tak nastavíme do lokálního stavu hodnotu venue
                setInputValue(field.value.venue || "");
            }
            else {
                // pokud je hodnota prázdná, tak vyčistíme i lokální stav
                setInputValue("");

                field.onChange(
                    {
                        venue: "",
                        city: "",
                        latitude: 0,
                        longitude: 0,
                    }
                )
            }
        },
        [field.value] // pokud se změní hodnota v druhém parametru (adresa), tak se zavolá funkce v prvním parametru (v lokálním stavu se zmení hodnota)
    );

    // useMemo vrací memoizovanou hodnotu, resp. funkci, která se provede při změně závislosti (proměnná v druhém parametru)
    // podobné jako useEffect nebo useCallback, ale použijeme tuto protože vracíme funkci (v parametru je funkce s debounce))
    const fetchSuggestions = useMemo(

        // debounce je MUI utilita, která zajistí, že volání funkce proběhne až po určité prodlevě
        () => debounce(
            async (query: string) => {
                if (!query || query.length < 3) {
                    setSuggestions([]);
                    return;
                }

                setLoading(true);

                try {
                    // URL na volání LocationIQ API
                    const locationUiAddress = "https://api.locationiq.com/v1/autocomplete";
                    const locationUiKey = "pk.04f8fab195939eddcf2024d161be288d";
                    const locationUiQuery = query;
                    const locationUiLimit = 5;
                    const locationUiDedupe = 1;

                    //let locationUrl = "https://api.locationiq.com/v1/autocomplete?key=pk.04f8fab195939eddcf2024d161be288d&q=prague%20castle&limit=5&dedupe=1&";
                    const locationUrl = `${locationUiAddress}?key=${locationUiKey}&q=${encodeURIComponent(locationUiQuery)}&limit=${locationUiLimit}&dedupe=${locationUiDedupe}`;

                    console.log("Location URL", locationUrl);

                    // použijeme Axios přímo (nikoli naši instanci agent), protože se nejedná o naše API (jiné nastavení)
                    const locationUiResponse = await axios.get<LocationIQSuggestion[]>(locationUrl);

                    // uložíme data odpovědi do lokálního stavu
                    const dataFromLocationIQ = locationUiResponse.data;

                    console.log("Data from Location IQ", dataFromLocationIQ);

                    setSuggestions(dataFromLocationIQ);
                }
                catch (error) {
                    console.log(error);
                }
                finally {
                    setLoading(false);
                }
            },
            500 // prodleva v ms pro debounce až po které zavolá funkci z prvního parametru
        ),

        [] // memo se spustí jen jednou
    );

    const handleChange = async (value: string) => {
        //field.onChange(value); // aktualizuje stav pole v react-hook-form

        setInputValue(value); // aktualizuje lokální stav

        // pokud uživatel mění hodnotu, tak vyčistíme pole s návrhy
        field.onChange(
            {
                venue: value,
                city: "",
                latitude: 0,
                longitude: 0,
            }
        )

        // použije naši funkci na volání Location IQ s parametrem z pole formuláře
        // funkce obsahuje debounce (čeká 500 ms) a je memoizovaná (spustí se při změně URL))
        fetchSuggestions(value);
    }

    const handleSelectedLocation = (location: LocationIQSuggestion) => {

        // zjistíme zvolenou lokaci z odpovědi LocationIQ
        const city = location.address.city || location.address.town || location.address.village || "";
        const venue = location.display_name; // celá adresa
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);

        setInputValue(venue); // nastavíme zvolenou lokaci do lokálního stavu

        // aktualizujeme hodnoty v react-hook-form
        field.onChange(
            {
                venue,
                city,
                latitude,
                longitude,
            }
        );
    }

    return (
        <Box>

            <TextField
                {...props}
                value={inputValue}
                onChange={(event) => handleChange(event.target.value)}
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
            />

            {loading && <Typography>Loading...</Typography>}

            {
                suggestions.length > 0
                && (
                    <List sx={{ border: 1 }}>

                        {
                            suggestions.map(
                                (suggestion) => (
                                    <ListItemButton
                                        key={suggestion.place_id}
                                        divider
                                        onClick={() => { handleSelectedLocation(suggestion) }}
                                    >

                                        {suggestion.display_name}

                                    </ListItemButton>
                                )
                            )
                        }

                    </List>
                )
            }

        </Box>
    )
}