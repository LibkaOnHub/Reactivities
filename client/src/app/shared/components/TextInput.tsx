import { TextField, type TextFieldProps } from "@mui/material";
import { useController, type UseControllerProps, type FieldValues} from "react-hook-form";

type Props<T extends FieldValues> = {
    // případné další vlastnosti, které nejsou už v react-hook-form.UseControllerProps a MUI.TextFieldProps
}
    & UseControllerProps<T> // doplníme props z react-hook-form pro useController
    & TextFieldProps; // doplníme props z MUI TextField

export default function TextInput<T extends FieldValues>(props: Props<T>) {

    // react-hook-form hook pro práci s komponentou
    const { field, fieldState } = useController<T>(
        { ...props } // naše props a další z react-hook-form.UseControllerProps a MUI.TextFieldProps
    );

    return (
        <TextField
            {...props}
            {...field}
            value={field.value || ""} // zajistí, že hodnota nebude undefined
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    )
}