import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import { useStore } from "../../lib/hooks/useStore"

// naši komponetu vložíme do volání MobX funkce observer,
// aby se aktualizovali observable proměnné
import { observer } from "mobx-react-lite";

export default observer(function Counter() {

    // Z React kontextu získáme pomocí našeho hook náš Store
    // (interface s vlastnostmi obsahující třídy s MobX observables)
    const { counterStore } = useStore()

    return (
        <Box display="flex" justifyContent="space-between">

            <Box sx={{ width: "60%" }}>

                <Typography variant="h4" gutterBottom>
                    {counterStore.title}
                </Typography>

                <Typography variant="h6">
                    The count is: {counterStore.count}
                </Typography>

                <ButtonGroup sx={{ mt: 3 }}>

                    <Button
                        variant="contained"
                        onClick={() => counterStore.increment()}
                        color="success"
                    >
                        Increment
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => counterStore.increment(5)}
                        color="primary"
                    >
                        Increment by five
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => counterStore.decrement()}
                        color="error"
                    >
                        Decrement
                    </Button>

                </ButtonGroup>

            </Box>

            <Paper sx={{ width: "40%", p: 4 }}>

                <Typography variant="h5">
                    Computed property: {counterStore.greaterThanTen}
                </Typography>

            </Paper>

        </Box>
    )
})