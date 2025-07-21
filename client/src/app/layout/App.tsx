import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { useActivities } from "../../lib/hooks/useActivities";

function App() {

    // useState hook (funkce) vytvoří stateful proměnnou a funkci, která ji nastaví
    const { activities, isPending } = useActivities(); // extrakce (de-structuring vlastností do nového objektu)

    // stav zvolené aktivity
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

    // stav zobrazení editační komponenty
    const [editMode, setEditMode] = useState(false); // vrátí pole

    useEffect(
        () => {
            console.log("editMode changed:", editMode);
        },
        [editMode]
    );

    // nastavení zvolené aktivity ve state podle id
    const handleSelectedActivity = (id: string) => { // arrow fce (může být i normální)
        console.log(`handleSelectedActivity with id ${id} called`)

        const selectedItem = activities!.find(item => item.id === id); // vyhledání zvolené aktivity v kolekci
        setSelectedActivity(selectedItem); // nastavení stateful proměnné
    }

    // zrušení zvolené aktivity ve state
    const handleCancelSelectActivity = () => {
        console.log("handleCancelSelectActivity called")
        setSelectedActivity(undefined);
    }

    const handleOpenForm = (id?: string) => {
        console.log(`handleOpenForm with id ${id} called`)

        if (id) {
            handleSelectedActivity(id)
        }
        else {
            handleCancelSelectActivity()
        }

        setEditMode(true)
    }

    const handleFormClose = () => {
        console.log(`handleFormClose called`)
        setEditMode(false);
    }

    return (
        <Box sx={{ bgcolor: '#eeeeee', minHeight: "100vh" }}>

            <CssBaseline />

            <NavBar
                openForm={handleOpenForm}
            />

            <Container maxWidth="xl" sx={{ mt: 3 }}>

                {
                    !activities || isPending
                        ? (
                            <Typography>Loading</Typography>
                        )
                        : (
                            <ActivityDashboard
                                activities={activities}

                                selectActivity={handleSelectedActivity}
                                cancelSelectActivity={handleCancelSelectActivity}

                                selectedActivity={selectedActivity}

                                editMode={editMode}
                                openForm={handleOpenForm}
                                closeForm={handleFormClose}
                            />
                        )
                }

            </Container>

        </Box>
    )
}

export default App; // komponentu budeme importovat v main.tsx