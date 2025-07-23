import { MenuItem } from "@mui/material"
import type { ReactNode } from "react"
import { NavLink } from "react-router"

export default function MenuItemLink({ children, to }: { children: ReactNode, to: string }) {

    // parametr children je vlastně obsah MenuItem
    // parametr to je cílová adresa (href)

    return (
        <MenuItem
            component={NavLink}
            to={to}
            sx={{
                fontSize: "1.2rem",
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "inherit",
                "&.active": {
                    color: "yellow"
                }
            }}
        >

            {children}

        </MenuItem>
    )
}