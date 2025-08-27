import { useController, type UseControllerProps, type FieldValues } from "react-hook-form";
import { DateTimePicker, type DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";

type Props<T extends FieldValues> = {
    // případné další vlastnosti, které nejsou už v react-hook-form.UseControllerProps a MUI.TextFieldProps
}
    & UseControllerProps<T> // doplníme props z react-hook-form pro useController
    & DateTimePickerProps; // doplníme props z MUI TextField


export default function DateTimeInput<T extends FieldValues>(props: Props<T>) {

    // react-hook-form hook pro práci s komponentou
    const { field, fieldState } = useController<T>(
        { ...props } // naše props a další z react-hook-form.UseControllerProps a MUI.TextFieldProps
    );

    return (
        <DateTimePicker
            {...props}
            value={field.value ? new Date(field.value) : null} // zajistí, že hodnota nebude undefined
            onChange={
                (value) => {
                    field.onChange(value)
                }
            }
            sx={{ width: "100%" }}
            slotProps={{ // slotProps umožňuje předat další vlastnosti do vnitřních komponent
                textField: {
                    onBlur: field.onBlur, // zajistí, že se spustí validace při opuštění pole
                    error: !!fieldState.error, // nastaví případně příznak chyby
                    helperText: fieldState.error?.message // nastaví případnou chybovou zprávu
                }
            }}
        />
    )
}