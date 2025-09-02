import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { type Activity } from "../types/index";
import { useAccount } from "../hooks/useAccount"

// hook bude vlastně exportovaná funkce (pouze TS) vracející několik proměnných (výsledek GET a mutation tool)

export const useActivities = (id?: string) => {
    console.log(`useActivities hook using React Query was called with id: ${id}`);

    // funkce useActivities:
    // - vrátí proměnnou se seznamem aktivit (HTTP GET)
    // - vrátí proměnnou s jednou aktivitou dle id
    // - vrátí proměnnou s "mutation tool" objektem na provedení update (HTTP PUT)
    // - vrátí proměnnou s "mutation tool" objektem na provedení create (HTTP POST)

    const location = useLocation();

    const { currentUser } = useAccount();

    console.log("currentUser:", currentUser);

    // získání dat o všech aktivitách z API pomocí React Query funkce useQuery
    const { data: activities, isLoading: activitiesLoading } = useQuery( // z výsledku volání uložíme vybrané vlastnosti
        // konfigurace query
        {
            // uložení dat
            queryKey: ["activities"],

            // funkce pro získání dat z API
            queryFn: async () => {

                // použijeme sdílenou funkci agent, která vytvoří instanci klient, nastaví vých. adresu a interceptor
                const response = await agent.get<Activity[]>("/activities"); // HTTP GET

                return response.data;
            },

            staleTime: 100, // až po tomto čase budou data označena "stale" (zneplatní se cache)

            enabled:
                !id // jen pokud není specifikováno konkrétní id (chceme vrátit všechny aktivity)
                && location.pathname.startsWith("/activities") // pokud není id a jsme na cestě pro všechny aktivity
                && !!currentUser // jen pokud existuje přihlášený uživatel
        }
    );

    // získání dat o jedné aktivitě z API pomocí React Query funkce useQuery
    const { data: activity, isPending: activityPending } = useQuery(
        {
            queryKey: ["activities", id],

            queryFn: async () => {
                const response = await agent.get<Activity>(`/activities/${id}`); // HTTP GET s id

                return response.data;
            },

            enabled:
                !!id // jen pokud je specifikováno konkrétní id
                && !!currentUser // jen pokud existuje přihlášený uživatel
        }
    );

    // klient pro práci s výsledky queries 
    const queryClient = useQueryClient();

    // příprava "mutation tool object" update s možností spustit následně mutate, mutateAsync (HTTP PUT, úprava globálního stavu)
    const updateActivityTool = useMutation( // pozor, neprovádí mutaci samotnou, ale vrací jen tool na ni
        // konfigurace mutation
        {
            // funkce zajišťující změnu aktivity
            mutationFn: async (activity: Activity) => {
                console.log("updateActivityTool mutation called with activity:", activity);

                await agent.put("/activities", activity) // HTTP PUT
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    // nastavení filtru
                    {
                        queryKey: ["activities"]
                    }
                )
            }
        }
    );

    // příprava "mutation tool" na create přes který se následně spustí HTTP POST
    const createActivityTool = useMutation(
        {
            // funkce zajišťující vytvoření aktivity
            mutationFn: async (activity: Activity) => {
                console.log("createActivityTool mutation called with activity:", activity);

                const response = await agent.post("/activities", activity) // HTTP POST

                return response.data
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    {
                        queryKey: ["activities"]
                    }
                )
            }
        }
    );

    // příprava "mutation tool" na delete přes který se následně spustí HTTP DELETE
    const deleteActivityTool = useMutation(
        {
            mutationFn: async (id: string) => {
                await agent.delete(`/activities/${id}`)
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    {
                        queryKey: ["activities"]
                    }
                )
            }
        }
    );

    // funkce useActivities vrátí proměnné s
    // 1) všemi aktivitami, resp. stavem HTTP GET volání
    // 2) aktivitou dle id, resp. stavem HTTP GET s /:id
    // 3) mutation tool objekt, který umožňuje zavolat mutate, mutateAsync
    return {
        activities,
        activitiesLoading,

        activity,
        activityPending,

        updateActivityTool,
        createActivityTool,
        deleteActivityTool
    }
}