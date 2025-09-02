// hook je vlastně funkce, která vrací objekt s funkcemi a naplněnými proměnnými

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { LoginSchema } from "../schemas/loginSchema";
import type { RegisterSchema } from "../schemas/registerSchema";
import { useLocation, useNavigate } from "react-router";
import { type User } from "../types/index";
import { toast } from "react-toastify";

export const useAccount = () => {

    const queryClient = useQueryClient(); // klient react-query pro práci s cache

    const navigate = useNavigate(); // navigační funkce react-router

    const location = useLocation(); // vrátí react-ruter funkci na zjištění adresy

    // 1) React Query mutace na přihlášení uživatele
    const loginUser = useMutation(
        {
            mutationFn: async (creds: LoginSchema) => {
                await agent.post("/login?useCookies=true", creds);
            },

            onSuccess: async () => {
                // znovunačtení dat o uživateli po úspěšném přihlášení
                // (zrušení cache "user")
                await queryClient.invalidateQueries(
                    {
                        queryKey: ["user"]
                    }
                );
            }
        }
    );

    // 2) React Query mutace na odhlášení uživatele
    const logoutUser = useMutation(
        {
            mutationFn: async () => {
                await agent.post("/account/logout"); // odhlásíme uživatele
            },

            onSuccess: () => {
                queryClient.removeQueries(
                    {
                        // smažeme cache s uživatelem
                        queryKey: ["user"],
                    }
                );

                queryClient.removeQueries(
                    {
                        // smažeme cache s aktivitami (aby nebyly dostupné z cache bez přihlášení)
                        queryKey: ["activities"],
                    }
                );

                navigate("/"); // přesměrujeme po odhlášení na výchozí stránku
            }
        }
    );

    // 3) React Query dotaz na získání informací o přihlášeném uživateli
    // vrácený objekt data přejmenujeme pomocí dvojtečky na currentUser
    const { data: currentUser, isLoading: userInfoLoading } = useQuery(
        {
            queryKey: ["user"], // klíč pro cachování

            queryFn: async () => {
                // budeme očekávat data odpovědi klientského typu User (dle typu z API)
                // jedná se o naš endpoint (nikoli standarní z ASP.NET Identity)
                const response = await agent.get<User>("/account/user-info");
                return response.data; // vrací typ User
            },

            enabled: // Query se spustí jen pokud
                !queryClient.getQueryData(["user"]) // není naplněná cache
                && location.pathname !== "/login" // nejsme na stránce pro přihlášení
                && location.pathname !== "/register" // nejsme na registrační stránce
        }
    );

    // 4) React Query mutace na registraci nového uživatele
    const registerUser = useMutation(
        {
            mutationFn: async (registerData: RegisterSchema) => {
                await agent.post("/account/register", registerData)
            },
            onSuccess: () => {
                // zobrazíme toast po úspěšné registraci
                toast.success("Register successful - you can now login");

                // přesměrujeme uživatele na přihlašovací obrazovku
                navigate("/login")
            }
        }
    );

    // výsledek hooku (objekt s funkcemi a proměnnými)
    return {
        loginUser,
        logoutUser,
        currentUser,
        userInfoLoading,
        registerUser
    }
}