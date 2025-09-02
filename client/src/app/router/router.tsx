import { Navigate, createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetailPage from "../../features/activities/detail/ActivityDetailPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import Counter from "../../features/counter/Counter";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import RequireAuth from "../router/requireAuth";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [ //  nahrazení <Outlet /> v rodičovské komponentě
                {
                    element: <RequireAuth />, // komponenta zkontroluje přihlášení
                    children: [ //  nahrazení <Outlet /> v komponentě výše
                        { path: "activities", element: <ActivityDashboard /> },
                        { path: "activities/:id", element: <ActivityDetailPage /> },
                        { path: "createActivity", element: <ActivityForm key="create" /> },
                        { path: "manage/:id", element: <ActivityForm key="edit" /> },
                    ]
                },

                { path: "", element: <HomePage /> },
                { path: "login", element: <LoginForm /> },
                { path: "register", element: <RegisterForm /> },

                { path: "counter", element: <Counter /> },
                { path: "errors", element: <TestErrors /> },

                { path: "not-found", element: <NotFound /> },
                { path: "server-error", element: <ServerError /> },

                { path: "*", element: <Navigate replace to="/not-found" /> },
            ]
        }
    ]
);