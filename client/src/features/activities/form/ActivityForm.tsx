 import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";

type Props = {
    activity?: Activity;
    closeForm: () => void
    submitForm: (activity: Activity) => void
}

export function ActivityForm({ activity, closeForm, submitForm }: Props) {

    console.log(`ActivityForm loaded with activity.id ${activity?.id}`)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        console.log(`handle submit called with activity.id: ${activity?.id}`);
        console.log(event)

        event.preventDefault(); // potlačí se odeslání formuláře

        // z události získáme slovník odesílaných dat (name / defaultValue)
        const formData = new FormData(event.currentTarget);

        let activityFromForm: Activity = {
            id: activity?.id ?? "",
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

        // zavoláme funkci na zpracování dat z formuláře
        submitForm(activityFromForm); // ze slovníku polí formuláře musíme udělat typ Activity
    }

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>

            <Typography variant="h5" gutterBottom color="primary">
                Create activity
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

                <TextField name="date" label="Date" type="date" defaultValue={activity?.date} />

                <TextField name="city" label="City" defaultValue={activity?.city} />

                <TextField name="venue" label="Venue" defaultValue={activity?.venue} />

                <Box display="flex" justifyContent="end" gap={3}>

                    <Button
                        color="inherit"
                        onClick={closeForm}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                    >
                        Submit
                    </Button>

                </Box>

            </Box>

        </Paper>
    )
}