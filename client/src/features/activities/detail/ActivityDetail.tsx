import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { NavLink, useParams } from "react-router";

export default function ActivityDetail() {

    // zjistíme id z query string
    const { id } = useParams();

    console.log(`ActivityDetail opened with id from query string: ${id}`);

    // získáme aktivitu dle id z React Query
    const { activity, activityPending} = useActivities(id);

    if (activityPending) return <Typography>Loading...</Typography>

    if (!activity) return <Typography>Activity not found</Typography>

    return (
        <Card sx={{ borderRadius: 3 }}>

            <CardMedia
                component='img'
                src={`/images/categoryImages/${activity.category.toLowerCase()}.jpg`}
            />

            <CardContent>

                <Typography variant="h5">
                    {activity.title}
                </Typography>

                <Typography variant="subtitle1" fontWeight="light">
                    {activity.date}
                </Typography>

                <Typography variant="body1">
                    {activity.description}
                </Typography>

            </CardContent>

            <CardActions>

                <Button
                    component={NavLink}
                    to={`/manage/${activity.id}`}
                    color="primary"
                >
                    Edit
                </Button>

                <Button
                    component={NavLink}
                    to="/activities"
                    color="inherit"
                >
                    Cancel
                </Button>

            </CardActions>

        </Card>
    )
}