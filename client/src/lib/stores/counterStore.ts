import { action, makeObservable, observable, reaction } from "mobx";

export default class CounterStore {

    // pozor na definování vlastností a metod ve třídě:
    // - vlastnosti jsou jako proměnné bez deklarace
    // - metody jsou jaok proměnné bez deklarace s arrow funkcí
    // - k vlastnostem se přistupuje přes this

    // vlastnosti třídy jsou vlastně proměnné bez deklarace
    title = "Counter MobX store";
    count = 0;

    constructor() {
        // toto by stačilo:
        // makeAutoObservable(this);

        // ruční vytvoření observables a akci (odkaz na objekt a anotační mapa)
        makeObservable(this, { // objekt s nastavením vlastností a metod (anotační mapa)
            title: observable,
            count: observable,

            increment: action, // pokud metoda není arrow funkce, tak musíme použít action.bound
            decrement: action,
        })

        reaction(
            () => this.count,
            () => console.log(`CounterStore reaction after counter change called: ${this.count}`)
        )
    }

    // metody třídy jsou vlastně promměnné bez deklarace s arrow funkcemi

    increment = (amount = 1) => {
        console.log("CounterStore.Increment was called")

        this.count += amount

        console.log(`Count is now ${this.count}`);
    }

    decrement = (amount = 1) => {
        console.log("CounterStore.Decrement was called")

        this.count -= amount

        console.log(`Count is now ${this.count}`);
    }

    // computed property vypadá jak obyčejná funkce, akorát na začátku je "get"
    get greaterThanTen() {
        return this.count > 10 ? "Greather than ten" : "Less than ten"
    }
}