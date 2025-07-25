import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router";
import HomePage from "../../features/home/HomePage";

function App() {

    const location = useLocation();

    return (
        <Box sx={{ bgcolor: '#eeeeee', minHeight: "100vh" }}>

            <CssBaseline />

            {
                // pokud jsme na výchozí adrese bez ničeho, tak zobrazíme samotnou komponentu HomePage
                // jinak zobrazíme NavBar a komponentu v Outlet dle cesty (routing)

                location.pathname === "/"
                    ? <HomePage />
                    : (
                        <>
                            <NavBar />

                            <Container maxWidth="xl" sx={{ mt: 3 }}>

                                <Outlet />

                            </Container>
                        </>
                    )
            }

        </Box>
    )
}

export default App; // komponentu budeme importovat v main.tsx