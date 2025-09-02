import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { type LoginSchema, loginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { useNavigate, useLocation, Link } from "react-router";

export default function LoginForm() {

    // vytáhneme potřebné vlastnosti z hooku (ve kterých jsou připravené funkce a proměnné))
    const { loginUser } = useAccount();

    // vrátí funkci Navigate z react-router
    const navigate = useNavigate();

    // vrátí funkci location z react-router
    const location = useLocation()

    // pooužijeme react-hook-form hook pro práci s formulářem
    // hook, resp. formulář bude pracovat s poli a validací dle LoginSchema (typ odvozený z konstanty)

    // vytáhneme vlastnosti, resp. funkce z hooku
    const {
        control, // propojí pole na stránce (formuláři) s react-hook-form
        handleSubmit, // odešle data formuláře do naší funkce
        formState: {
            isValid, // příznak, zda je formulář validní
            isSubmitting // příznak, že probíhá odeslání (ideálně zablokovat tlačítko po tuto dobu)
        }
    } = useForm<LoginSchema>(
        // nastavení chování react-hook-form formuláře
        {
            // validace při opuštění pole
            mode: "onTouched",

            // validace pomocí zod schéma (konstanta s objektem a zod validátory pro každou vlastnost, resp. pole)
            resolver: zodResolver(loginSchema),
        }
    );

    const submitForm = async (formData: LoginSchema) => {

        // použijeme funkci loginUser z našeho hook useAccount
        await loginUser.mutateAsync(
            formData,
            {
                onSuccess: () => {
                    // komponenta RequireAuth, která přesměrovala sem má u směrování zaznamenanou location
                    // <Navigate to="/login" state={{ from: location }}>
                    // tj. víme, kde uživatel (nepřihlášený) byl a nasměrujeme ho po přihlášení zpět
                    navigate(location.state?.from || "/activities")
                }
            }
        );
    }

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit(submitForm)}
            sx={{
                display: "flex",
                flexDirection: "column",
                p: 3,
                gap: 3,
                maxWidth: "md",
                mx: "auto",
                borderRadius: 3,
            }}
        >

            <Box display="flex" alignItems="center" justifyContent="center" gap={3} color="secondary.main">

                <LockOpen fontSize="large" />

                <Typography variant="h4">
                    Sign in
                </Typography>

            </Box>

            <TextInput control={control} name="email" label="Email" />

            <TextInput control={control} name="password" type="password" label="Password" />

            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
            >
                Login
            </Button>

            <Typography sx={{ textAlign: "center" }}>
                Don't have an account?

                <Typography component={Link} to="/register" sx={{ ml: 2 }} color="primary">
                    Sign up
                </Typography>

            </Typography>

        </Paper>
    )
}