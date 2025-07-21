import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../detail/ActivityDetail";
import { ActivityForm } from "../form/ActivityForm";

interface Props {
    activities: Activity[];

    // parametry na předání funkcí z horní App komponenty 
    // (stav umístěný v horní App komponentě, ale mění se tlačítkem v dolní)
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;

    selectedActivity: Activity | undefined; // undefined můžeme nahradit otazníkem za proměnnou

    openForm: (id?: string) => void;
    closeForm: () => void;
    editMode: boolean;
}

export default function ActivityDashboard({ activities, selectActivity, cancelSelectActivity, selectedActivity,
    openForm, closeForm, editMode }: Props) {

    // MUI i Bootstrap grid mají 12 sloupců

    // proměnné, resp. funkce pro nastavení stavu v horní App komponentě předá tato komponenta dále dolů do ActivityList komponenty

    return (
        <Grid container spacing={3}>

            <Grid size={7}>

                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                />

            </Grid>

            <Grid size={5}>

                {
                    selectedActivity
                    && !editMode
                    &&
                    <ActivityDetail
                        selectedActivity={selectedActivity}
                        cancelSelectedActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }

                {
                    editMode
                    &&
                    <ActivityForm
                        selectedActivity={selectedActivity}
                        closeForm={closeForm}
                    />
                }


            </Grid>

        </Grid>
    )
}