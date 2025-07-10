import { List, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
    // useState hook (funkce) vytvoří stateful proměnnou a funkci, která ji nastaví
    const [activities, setActivites] = useState<Activity[]>([]);

    // useEffect hook (funkce) se spustí po každém vykreslení komponenty
    useEffect(
        // 1) funkce, která se spustí po vykreslení komponenty
        () => {
            axios.get<Activity[]>('https://localhost:5001/api/activities') // očekáváme klientský typ Activity[]
                .then(response => setActivites(response.data)) // nastav stateful proměnnou pomocí funkce k její změně
        },

        // 2) dependecy list:
        // a) prázdné pole spustí jednou
        // a) pokud se v poli proměnné změní, tak se spustí znovu
        // c) chybějící parametr spustí při každém načtení komponenty
        []
    );

    return (
        <>

            <Typography variant='h3'>
                Welcome to Reactivities
            </Typography>

            <List>
                {
                    activities.map(activity => (
                        <ListItemText key={activity.id}>
                            {activity.title}
                        </ListItemText>
                    ))
                }
            </List>

        </>
    )
}

export default App; // komponentu budeme importovat v main.tsx