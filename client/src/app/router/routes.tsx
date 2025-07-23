import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { ActivityForm } from "../../features/activities/form/ActivityForm";
import ActivityDetail from "../../features/activities/detail/ActivityDetail";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,

            children: [ // nahrazení <Outlet> v rodičovské <App>
                { path: "", element: <HomePage /> },
                { path: "activities", element: <ActivityDashboard /> },
                { path: "activities/:id", element: <ActivityDetail /> },
                { path: "createActivity", element: <ActivityForm key="create" /> },
                { path: "manage/:id", element: <ActivityForm key="edit" /> }
            ]
        }
    ]
)