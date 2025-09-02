import { z } from "zod";

// vytvoříme objekt s vlastnostmi dle názvů polí, které bude react-hook-form podporovat (control={control})
// současně bude mít každé pole ve vlastnosti zod validační funkci
export const registerSchema = z.object(
    {
        email: z
            .string()
            .nonempty(
                {
                    message: "Title is required"
                }
            )
            .max(
                255,
                {
                    message: "Email cannot exceed 255 characters",
                }
            ),
        displayName: z
            .string()
            .nonempty(
                {
                    message: "Display name is required"
                }
            )
            .max(
                255,
                {
                    message: "Display name cannot exceed 255 characters",
                }
            ),
        password: z
            .string()
            .nonempty(
                {
                    message: "Password is required"
                }
            )
    }
)

// důležité: vytvoření typu z objektu pomocí zod (z.infer)
// typ se následně na formuláři vloží do react-hook-form.useForm
// po odeslání formuláře získáme tento model s daty formuláře
export type RegisterSchema = z.infer<typeof registerSchema>;