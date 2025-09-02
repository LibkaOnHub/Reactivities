import { useLocation, Navigate, Outlet } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount"
import { Typography } from "@mui/material";

export default function RequireAuth() {

    console.log("Going through RequireAuth");

    // z našeho useAccount hook vytáhneme požadované vlastnosti do proměnných
    const { currentUser, userInfoLoading } = useAccount();

    console.log("currentUser in RequireAuth:", currentUser);

    // získáme celý objekt Location (react-router hook)
    const location = useLocation();

    if (userInfoLoading) return <Typography>Loading...</Typography>

    if (!currentUser) return <Navigate to="/login" state={{ from: location }}></Navigate>

    return (

        <Outlet />

    )
}