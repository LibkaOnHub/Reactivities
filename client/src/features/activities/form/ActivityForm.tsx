import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router";

export default function ActivityForm() {

    // budeme potřebovat na přesměrování po uložení
    const navigateTool = useNavigate();

    // získáme id aktivity z query string
    const { id } = useParams();

    console.log(`ActivityForm opened with id from query string: ${id}`);

    // pomocí hook useActivities získáme aktuální aktivity, resp. zvolenou a objekty na mutaci
    const { activity, activityPending, updateActivityTool, createActivityTool } = useActivities(id);

    if (id && activityPending) return <Typography>Loading...</Typography>

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log(`handle submit called with activity.id: ${activity?.id}`);
        console.log(event)

        event.preventDefault(); // potlačí se odeslání formuláře

        // z události získáme slovník odesílaných dat (name / defaultValue)
        const formData = new FormData(event.currentTarget);

        let activityFromForm: Activity = {
            id: activity?.id ?? uuidv4(),
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            date: formData.get("date") as string,
            city: formData.get("city") as string,
            venue: formData.get("venue") as string,
            latitude: 0,
            longitude: 0,
            isCancelled: false
        };

        console.log("activity from form:");
        console.log(activityFromForm);

        if (activity) {
            // zavoláme hook s React Query a spustíme mutaci (HTTP PUT)
            console.log("an existing activity, update mutation will be called");

            await updateActivityTool.mutateAsync(activityFromForm);

            // po aktualizaci přesměrujeme na detail aktivity
            navigateTool(`/activities/${activity.id}`);
        }
        else {
            // zavoláme hook s React Query a spustíme mutaci (HTTP POST)
            console.log("a new activity, create mutation will be called");

            await createActivityTool.mutate(
                activityFromForm,
                {
                    onSuccess: (newId) => {
                        console.log("The create mutation returned:", newId);
                        navigateTool(`/activities/${newId}`)
                    },
                    onError: (error) => {
                        console.log("Error during activity creation:", error)
                    }
                }
            );
        }
    }

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>

            <Typography variant="h5" gutterBottom color="primary">

                {activity ? "Edit activity" : "Create activity"}

            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={3}
            >

                <TextField name="title" label="Title" defaultValue={activity?.title} />

                <TextField name="description" label="Description" multiline rows={3} defaultValue={activity?.description} />

                <TextField name="category" label="Category" defaultValue={activity?.category} />

                <TextField name="date"
                    label="Date"
                    type="date"
                    defaultValue={
                        activity?.date
                            ? new Date(activity.date).toISOString().split("T")[0]
                            : new Date().toISOString().split('T')[0]
                    }
                />

                <TextField name="city" label="City" defaultValue={activity?.city} />

                <TextField name="venue" label="Venue" defaultValue={activity?.venue} />

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