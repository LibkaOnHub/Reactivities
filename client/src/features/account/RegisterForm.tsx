import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link } from "react-router";


export default function RegisterForm() {

    // vytáhneme potřebné vlastnosti z hooku (ve kterých jsou připravené funkce a proměnné))
    const { registerUser } = useAccount();

    // pooužijeme react-hook-form hook pro práci s formulářem
    // hook, resp. formulář bude pracovat s poli a validací dle RegisterSchema (typ odvozený z konstanty)

    // vytáhneme vlastnosti, resp. funkce z react-hook-form.useForm
    const {
        control, // propojí pole na stránce (formuláři) s react-hook-form
        handleSubmit, // odešle data formuláře do naší funkce
        formState: {
            isValid, // příznak, zda je formulář validní
            isSubmitting // příznak, že probíhá odeslání (ideálně zablokovat tlačítko po tuto dobu)
        },
        setError // nastaví chybu pro pole formuláře (využijeme pro zobrazení chyb z API)
    } = useForm<RegisterSchema>(
        // nastavení chování react-hook-form formuláře
        {
            // validace při opuštění pole
            mode: "onTouched",

            // validace pomocí zod schéma (konstanta s objektem a zod validátory pro každou vlastnost, resp. pole)
            resolver: zodResolver(registerSchema),
        }
    );

    const submitForm = async (formData: RegisterSchema) => {

        // použijeme funkci registerUser z našeho hook useAccount
        await registerUser.mutateAsync(

            // data z formuláře pro mutaci (registraci uživatele)
            formData,

            // konfigurace chování při úspěchu, chybě
            {
                onError: (errorsFromApi) => {
                    console.log("registration errors from API", errorsFromApi);

                    // pokud získáme od FE interceptoru pole chyb, tak se jedná o validaci
                    if (Array.isArray(errorsFromApi)) {
                        errorsFromApi.forEach((errorItem: string) => {
                            if (errorItem.includes("Email")) setError("email", { message: errorItem });
                            if (errorItem.includes("Password")) setError("password", { message: errorItem });
                        });
                    }
                }
            },
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
                    Register
                </Typography>

            </Box>

            <TextInput control={control} name="email" label="Email" />

            <TextInput control={control} name="displayName" label="Display name" />

            <TextInput control={control} name="password" type="password" label="Password" />

            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
            >
                Register
            </Button>

            <Typography sx={{ textAlign: "center" }}>
                Already have an account?

                <Typography component={Link} to="/login" sx={{ ml: 2 }} color="primary">
                    Sign in
                </Typography>

            </Typography>

        </Paper>
    )
}