import { createContext } from "react";
import CounterStore from "./counterStore";
import { UiStore } from "./uiStore";

// vytvoříme interface Store, který bude obsahovat ve vlastnostech instnace MobX observables tříd
interface Store {
    counterStore: CounterStore
    uiStore: UiStore
}

// vyexportujeme instanci, resp. proměnnou store s instancemi MobX observable tříd
export const store: Store = {

    // ve vlastnostech interface Store budou instance tříd s MobX observables

    counterStore: new CounterStore(),
    uiStore: new UiStore()
}

// z proměnné store vytvoříme globální kontext
export const StoreContext = createContext(store);