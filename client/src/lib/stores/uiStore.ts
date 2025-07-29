import { makeAutoObservable } from "mobx"

export class UiStore {
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setBusy = () => {
        console.log("UiStore.setBusy called")

        this.isLoading = true;
    }

    setIdle = () => {
        console.log("UiStore.setIdle called")

        this.isLoading = false;
    }
}