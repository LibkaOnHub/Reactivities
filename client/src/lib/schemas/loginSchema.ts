import { z } from 'zod';

// schéma je vlastně objekt s vlasnostmi, které obsahují zod (z) validátory
export const loginSchema = z.object(
    {
        email: z
            .string()
            .nonempty(
                {
                    message: "Email is required"
                }
            )
            .max(
                255,
                { message: "Email cannot exceed 255 characters" }
            )
            .email(
                { message: "Invalid email address" }
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
export type LoginSchema = z.infer<typeof loginSchema>;