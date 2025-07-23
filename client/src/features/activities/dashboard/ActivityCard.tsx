import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { NavLink } from "react-router";

type Props = {
    activity: Activity;
}

export default function ActivityCard({ activity }: Props) {

    // získáme objekt na provedení delete mutace z našeho useActivities hook
    const { deleteActivityTool } = useActivities();

    return (
        <Card sx={{ borderRadius: 3 }}>

            <CardContent>

                <Typography variant="h5">
                    {activity.title}
                </Typography>

                <Typography sx={{ color: 'text-secondary', marginBottom: 1 }}>
                    {activity.date}
                </Typography>

                <Typography variant="body2">
                    {activity.description}
                </Typography>

                <Typography variant="subtitle1">
                    {activity.city} /  {activity.venue}
                </Typography>

            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', pb: 2 }}>

                <Chip label={activity.category} variant="outlined" />

                <Box display="flex" gap={3}>

                    <Button
                        component={NavLink}
                        to={`/activities/${activity.id}`}
                        size="medium"
                        variant="contained"
                    >
                        View
                    </Button>

                    <Button
                        size="medium"
                        variant="contained"
                        color="error"
                        onClick={() => deleteActivityTool.mutateAsync(activity.id)}
                        disabled={deleteActivityTool.isPending}
                    >
                        Delete
                    </Button>

                </Box>

            </CardActions>

        </Card>
    )
}