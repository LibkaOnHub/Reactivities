import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema"; // pozor, druhá položka je type

import { v4 as uuidv4 } from 'uuid';

import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";

import { categoryOptions } from "./categoryOptions";

import LocationInput from "../../../app/shared/components/LocationInput";

import { type Activity } from "../../../lib/types";

export default function ActivityForm() {

    // react-hook-form hook obsahuje hook useForm
    // - odeslání formuláře zajišťuje jeho metoda handleSubmit
    // - input prvky mají atribut register (nahrazuje name)
    // - nastavení validačního schéma (typ samotný pro kompilaci a proměnná pro runtime validaci)
    const { control, reset, handleSubmit } = useForm(
        {
            // přidání zod resolveru pro validaci 
            // pozor: proměnná (instance) pro runtime validaci (v useForm je naopak typ pro kompilaci))
            resolver: zodResolver(activitySchema),
            mode: "onTouched", // bude se validovat už při opuštění pole (místo až při submit)
            defaultValues: {
                title: "",
                description: "",
                category: "",
                date: new Date(),
                location: {
                    venue: "",
                    city: "",
                    latitude: 0,
                    longitude: 0,
                }
            }
        }
    );

    // budeme potřebovat na přesměrování po uložení
    const navigateTool = useNavigate();

    // získáme id aktivity z query string
    const { id } = useParams();

    console.log(`ActivityForm opened with id from query string: ${id}`);

    // pomocí hook useActivities získáme aktuální aktivity, resp. zvolenou a objekty na mutaci
    const { activity, activityPending, updateActivityTool, createActivityTool } = useActivities(id);

    // pokud se změní activity (načtení z API), tak se naplní react-hook-form formulář daty
    // react-hook-form metoda reset složí nejen k vyčištění hodnot, ale i k naplnění dat
    // a pracuje s activitySchema
    useEffect(
        () => {
            if (activity) {
                // pomocí useForm.reset naplníme react-hook-form formulář daty
                // pozor, activity je typu Activity (data z BE), ale formulář pracuje s ActivitySchema (zod schema)

                console.log("Resetting form with activity:", activity);

                const dataForForm: ActivitySchema = {
                    ...activity,
                    location: {
                        venue: activity.venue,
                        city: activity.city ?? "",
                        latitude: activity.latitude,
                        longitude: activity.longitude,
                    }
                }

                reset(dataForForm);
            }
        },
        [activity, reset] // při změně aktivity se nastaví data v react-hook-form formuláři
    )

    if (id && activityPending) return <Typography>Loading...</Typography>

    const onSubmit = async (formData: ActivitySchema) => {

        // pozor, react-hook-form pracuje s ActivitySchema (model pro zod validaci a pole formuláře)
        // kdežto na API posíláme model Activity (plochá struktura odpovídající BE BaseActivityDto)

        console.log("Form data (ActivitySchema):", formData);

        // nyní musíme transformovat data z formuláře (ActivitySchema s vnořeným objektem location)
        // na data pro API (Activity model s plochou strukturou, který odpovídá DTO na straně API))

        // získáme zvlášť location objekt a zbytek dat z ActivitySchema
        // (location objekt je v ActivitySchema vnořený, kdežto v Activity jsou jeho vlastnosti na stejné úrovni jako ostatní))
        const { location, ...rest } = formData;

        // a nyní složíme data z formuláře (activitySchema) do ploché struktury 
        // odpovídající modelu Activity(data pro API)

        const dataForApi: Activity = {
            ...rest,
            ...location, // vlastnosti z location budou na stejné úrovni jako ostatní
            city: location.city ?? "",
            id: activity?.id ?? uuidv4(),
            isCancelled: activity?.isCancelled ?? false,
        }

        console.log("Data for API (Activity):", dataForApi);

        try {
            if (activity) {
                console.log("An existing activity, update mutation will be called", dataForApi);

                //updateActivityTool.mutateAsync({ ...activity, ...dataForApi });
                updateActivityTool.mutateAsync(dataForApi);

                navigateTool(`/activities/${activity.id}`);
            }
            else {
                console.log("A new activity, create mutation will be called", dataForApi);

                createActivityTool.mutate(
                    dataForApi,
                    {
                        onSuccess: (newId) => {
                            console.log("The create mutation returned:", newId);
                            navigateTool(`/activities/${newId}`);
                        },
                        onError: (error) => {
                            console.log("Error during create mutation:", error);
                        },
                    });
            }
        }
        catch (error) {
            console.log("Error during form submission:", error);
        }
    }

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>

            <Typography variant="h5" gutterBottom color="primary">

                {activity ? "Edit activity" : "Create activity"}

            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                display="flex"
                flexDirection="column"
                gap={3}
            >

                <TextInput
                    control={control}
                    name="title"
                    label="Title"
                />

                <TextInput
                    control={control}
                    name="description"
                    label="Description"
                    multiline rows={3}
                />

                <SelectInput
                    control={control}
                    name="category"
                    label="Category"
                    items={categoryOptions}
                />

                <DateTimeInput
                    control={control}
                    name="date"
                    label="Date"
                />

                <LocationInput
                    control={control}
                    name="location"
                    label='Enter the location'
                />

                <Box display="flex" justifyContent="end" gap={3}>

                    <Button
                        color="inherit"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        disabled={updateActivityTool.isPending || createActivityTool.isPending}
                    >
                        Submit
                    </Button>

                </Box>

            </Box>

        </Paper>
    )
}