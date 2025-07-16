import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {

    // useState hook (funkce) vytvoří stateful proměnnou a funkci, která ji nastaví

    // stav načtených aktivit
    const [activities, setActivites] = useState<Activity[]>([]);

    // stav zvolené aktivity
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

    // stav zobrazení editační komponenty
    const [editMode, setEditMode] = useState(false);

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

    // nastavení zvolené aktivity ve state podle id
    const handleSelectedActivity = (id: string) => { // arrow fce (může být i normální)
        console.log(`handleSelectedActivity with id ${id} called`)
        const selectedItem = activities.find(item => item.id === id); // vyhledání zvolené aktivity v kolekci
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

    const handleSubmitForm = (activity: Activity) => {
        console.log(`handleSubmitForm called with activity having id: ${activity.id}`);
        console.log(activity);

        if (activity.id) {
            setActivites( // změníme stateful proměnnou activities
                activities.map(item =>
                    item.id === activity.id
                        ? activity // existující prvek nahradíme aktualizovanou aktivitou
                        : item
                )
            )

        }
        else {
            setActivites( // doplníme novou aktivitu do stateful seznamu aktivit
                [ // nově bude pole aktivit
                    ...activities, // stávající prvky
                    {...activity, id: activities.length.toString()} // a nový prvek z formuláře
                ],

            )
        }

        console.log("new version of activities:");
        console.log(activities);

        setEditMode(false);
    }

    const handleDelete = (id: string) => {
        console.log(`handleDelete called with id: ${id}`);

        // nová verze stateful proměnné activities bude s odfiltrovanou položkou dle id
        setActivites(activities.filter(item => item.id !== id)) 
    }

    return (
        <Box sx={{ bgcolor: '#eeeeee' }}>

            <CssBaseline />

            <NavBar
                openForm={handleOpenForm}
            />

            <Container maxWidth="xl" sx={{ mt: 3 }}>

                <ActivityDashboard
                    activities={activities}

                    selectActivity={handleSelectedActivity}
                    cancelSelectActivity={handleCancelSelectActivity}

                    selectedActivity={selectedActivity}

                    editMode={editMode}
                    openForm={handleOpenForm}
                    closeForm={handleFormClose}

                    submitForm={handleSubmitForm}

                    deleteActivity={handleDelete}
                />

            </Container>

        </Box>
    )
}

export default App; // komponentu budeme importovat v main.tsx