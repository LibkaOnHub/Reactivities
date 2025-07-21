import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
    selectedActivity: Activity;
    cancelSelectedActivity: () => void;

    openForm: (id: string) => void;
}

export default function ActivityDetail({ selectedActivity, cancelSelectedActivity, openForm }: Props) {

    // získáme aktuální stav zvolené aktivity z React Query

    const { activities } = useActivities(); // hook vrací více vlastností
    const activity = activities?.find(item => item.id === selectedActivity.id);

    if (!activity) return <Typography>Loading...</Typography>

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
                    color="primary"
                    onClick={() => openForm(activity.id)}
                >
                    Edit
                </Button>

                <Button
                    color="inherit"
                    onClick={() => cancelSelectedActivity()}
                >
                    Cancel
                </Button>

            </CardActions>

        </Card>
    )
}