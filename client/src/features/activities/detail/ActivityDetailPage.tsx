import { Grid, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams } from "react-router";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

export default function ActivityDetailPage() {

    // zjistíme id z query string
    const { id } = useParams();

    console.log(`ActivityDetail opened with id from query string: ${id}`);

    // získáme aktivitu dle id z React Query
    const { activity, activityPending } = useActivities(id);

    if (activityPending) return <Typography>Loading...</Typography>

    if (!activity) return <Typography>Activity not found</Typography>

    return (
        <Grid container spacing={3}>

            <Grid size={8}>

                <ActivityDetailsHeader activity={activity} />

                <ActivityDetailsInfo activity={activity} />

                <ActivityDetailsChat />

            </Grid>

            <Grid size={4}>

                <ActivityDetailsSidebar />

            </Grid>

        </Grid>
    )
}