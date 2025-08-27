import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectProps } from "@mui/material";
import { useController, type UseControllerProps, type FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
    // naše vlastnosti (které nejsou v UseControllerProps, TextFieldProps)
    items: { text: string, value: string }[] // seznam položek pro select
    label: string; // label pro select
}
    & UseControllerProps<T> // doplníme props z react-hook-form pro useController
    & Partial<SelectProps>; // doplníme props z MUI SelectInput (Partial nastaví vlastnosti jako volitelné))


export default function SelectInput<T extends FieldValues>(props: Props<T>) {

    // react-hook-form hook pro práci s komponentou
    const { field, fieldState } = useController<T>(
        { ...props } // naše props a další z react-hook-form.UseControllerProps a MUI.TextFieldProps
    );

    // pomocí field.onChange předáme zvolenou hodnotu react-hook-form

    return (
        <FormControl
            fullWidth
            error={!!fieldState.error}
        >

            <InputLabel>
                {props.label}
            </InputLabel>

            <Select
                value={field.value}
                label={props.label}
                onChange={field.onChange}
            >
                {
                    props.items.map(
                        item => (

                            <MenuItem key={item.value} value={item.value}>

                                {item.text}

                            </MenuItem>

                        )
                    )
                }
            </Select>

            <FormHelperText>
                {fieldState.error?.message}
            </FormHelperText>

        </FormControl>
    )
}