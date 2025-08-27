import { z } from "zod";

export const activitySchema = z.object(
    {
        title: z
            .string()
            .nonempty(
                {
                    message: "Title is required"
                }
            )
            .max(
                100,
                {
                    message: "Title cannot exceed 100 characters",
                }
            ),
        description: z
            .string()
            .nonempty(
                {
                    message: "Description is required"
                }
            ),
        category: z
            .string()
            .nonempty(
                {
                    message: "Category is required"
                }
            ),
        date: z
            .coerce.date(
                {
                    message: "Date is required"
                }
            ),
        location: z.object({
            venue: z
                .string()
                .nonempty(
                    {
                        message: "Venue is required"
                    }
                ),
            city: z
                .string()
                .optional(),
            latitude: z
                .coerce.number(),
            longitude: z
                .coerce.number(),
        })
    }
)

// důležité: vytvoření typu z objektu pomocí zod (z.infer)
// typ se následně na formuláři vloží do react-hook-form.useForm
export type ActivitySchema = z.infer<typeof activitySchema>;