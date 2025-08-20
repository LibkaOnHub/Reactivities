import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema"; // pozor, druhá položka je type
import { v4 as uuidv4 } from 'uuid';

export default function ActivityForm() {

    // react-hook-form hook obsahuje hook useForm
    // - odeslání formuláře zajišťuje jeho metoda handleSubmit
    // - input prvky mají atribut register (nahrazuje name)
    // - nastavení validačního schéma (typ samotný pro kompilaci a proměnná pro runtime validaci)
    const { register, reset, handleSubmit, formState: { errors } } = useForm<ActivitySchema>(
        {
            // přidání zod resolveru pro validaci 
            // pozor: proměnná (instance) pro runtime validaci (v useForm je naopak typ pro kompilaci))
            resolver: zodResolver(activitySchema),
            mode: "onTouched" // bude se validovat už při opuštění pole (místo až při submit)
        }
    );

    // budeme potřebovat na přesměrování po uložení
    const navigateTool = useNavigate();

    // získáme id aktivity z query string
    const { id } = useParams();

    console.log(`ActivityForm opened with id from query string: ${id}`);

    // pomocí hook useActivities získáme aktuální aktivity, resp. zvolenou a objekty na mutaci
    const { activity, activityPending, updateActivityTool, createActivityTool } = useActivities(id);

    useEffect(
        () => {
            if (activity) reset(activity);
        },
        [activity, reset]
    )

    useEffect(
        () => {
            console.log("Current errors:", errors);
        },
        [errors]
    );

    if (id && activityPending) return <Typography>Loading...</Typography>

    const onSubmit = async (data: ActivitySchema) => {
        console.log("Form submitted with data:", data);

        const activityFromForm: Activity = {
            id: activity?.id ?? uuidv4(),
            title: data.title,
            description: data.description,
            category: data.category,
            date: data.date,
            city: data.city,
            venue: data.venue,
            latitude: 0,
            longitude: 0,
            isCancelled: false,
        };

        console.log("activity from form:", activityFromForm);

        if (activity) {
            console.log("An existing activity, update mutation will be called");

            await updateActivityTool.mutateAsync(activityFromForm);

            navigateTool(`/activities/${activity.id}`);
        } else {
            console.log("A new activity, create mutation will be called");

            await createActivityTool.mutate(activityFromForm, {
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

                <TextField
                    {...register("title")}
                    label="Title"
                    defaultValue={activity?.title}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />

                <TextField
                    {...register("description")}
                    label="Description"
                    multiline rows={3}
                    defaultValue={activity?.description}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />

                <TextField
                    {...register("category")}
                    label="Category"
                    defaultValue={activity?.category}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                />

                <TextField
                    {...register("date")}
                    label="Date"
                    type="date"
                    defaultValue={
                        activity?.date
                            ? new Date(activity.date).toISOString().split("T")[0]
                            : new Date().toISOString().split('T')[0]
                    }
                    error={!!errors.date}
                    helperText={errors.date?.message}
                />

                <TextField
                    {...register("city")}
                    label="City"
                    defaultValue={activity?.city}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                />

                <TextField
                    {...register("venue")}
                    label="Venue"
                    defaultValue={activity?.venue}
                    error={!!errors.venue}
                    helperText={errors.venue?.message}
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