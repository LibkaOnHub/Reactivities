import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

// hook bude vlastně exportovaná funkce (pouze TS) vracející několik proměnných (výsledek GET a mutation tool)

export const useActivities = () => {
    console.log("useActivities hook using React Query was called");

    // funkce useActivities:
    // - vrátí proměnnou se seznamem aktivit (HTTP GET)
    // - vrátí proměnnou s "mutation tool" objektem na provedení update (HTTP PUT)
    // - vrátí proměnnou s "mutation tool" objektem na provedení create (HTTP POST)


    // získání dat z API a nastavení globálního stavu pomocí React Query funkce useQuery
    const { data: activities, isPending } = useQuery( // z výsledku volání uložíme vybrané vlastnosti
        // konfigurace query
        {
            // uložení dat
            queryKey: ['activities'],

            // funkce pro získání dat z API
            queryFn: async () => {

                // použijeme sdílenou funkci agent, která vytvoří instanci klient, nastaví vých. adresu a interceptor
                const response = await agent.get<Activity[]>('/activities'); // HTTP GET

                return response.data;
            }
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
                await agent.put("/activities", activity) // HTTP PUT
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    // nastavení filtru
                    {
                        queryKey: ['activities']
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
                await agent.post("/activities", activity) // HTTP POST
            },

            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    {
                        queryKey: ['activities']
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
                        queryKey: ['activities']
                    }
                )
            }
        }
    );

    // funkce useActivities vrátí proměnné s
    // 1) aktuálními aktivitami, resp. stavem HTTP GET volání
    // 2) mutation tool objekt, který umožňuje zavolat mutate, mutateAsync
    return {
        activities,
        isPending,
        updateActivityTool,
        createActivityTool,
        deleteActivityTool
    }
}