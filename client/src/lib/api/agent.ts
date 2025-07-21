import axios from "axios";

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

// k nastavené instanci Axios doplníme interceptor na response
agent.interceptors.response.use(async response => {
    try {
        await sleep(1000); // interceptor doplní timeout před vrácením response
        return response;
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
})

export default agent;