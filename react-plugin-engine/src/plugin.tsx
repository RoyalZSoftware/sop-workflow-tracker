import { PluginView } from "./internal/plugin-view-base";

export abstract class Plugin {

    public readonly registeredViews: PluginView<any>[] = [];

    constructor(public readonly id: string) { }

    registerView(view: PluginView<any>) {
        this.registeredViews.push(view);
    }
}