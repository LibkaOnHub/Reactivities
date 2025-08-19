import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/router";

console.log(`base url from environment: ${import.meta.env.VITE_API_URL}`)

// funkce axios.create vytvoří Axios instanci s nastavením
const agent = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL
    }
);

// pomocná funkce na testování delší odpovědi
const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    });
}

// vytvoříme incerceptor na request
agent.interceptors.request.use(config => {
    console.log("agent request interceptor used");

    store.uiStore.setBusy();

    return config;
})

// k nastavené instanci Axios doplníme interceptor na response
agent.interceptors.response.use(
    async response => {

        console.log("agent response interceptor used");

        await sleep(1000); // interceptor doplní timeout před vrácením response (test "loading")

        store.uiStore.setIdle();

        return response;
    },
    async error => {
        await sleep(1000);

        store.uiStore.setIdle();

        console.log("axios error: " + error);

        const { status, data } = error.response;

        switch (status) {
            case 400:
                if (data.errors) {
                    // data obsahují výsledek validace
                    const modelStateErrors = [];

                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modelStateErrors.push(data.errors[key]);
                        }
                    }

                    console.log("modelStateErrors: " + modelStateErrors);

                    //throw modelStateErrors.flat();
                    toast.error(modelStateErrors.toString());
                }
                else {
                    // jiná chyba než validace
                    toast.error(data);
                }

                break;

            case 401:
                toast.error("Unauthorized");
                break;

            case 404:
                router.navigate("/not-found");
                break;

            case 500:
                router.navigate("/server-error", { state: { error: data } });
                break;
        }

        return Promise.reject(error);
    })

export default agent;