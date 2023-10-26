import React from "react";
import { Plugin } from "./plugin";
import { ViewType, PluginView } from "./plugin-view";

export class PluginManager {
    protected readonly plugins: Plugin[] = [];

    constructor() {
    }

    public registerPlugin(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    RenderAll(viewType: ViewType, dependencies: any): React.JSX.Element {
        const viewsOfViewType = this._getAllViewsForAllPlugins().filter(c => c.viewType == viewType);
        return <>
            {viewsOfViewType.map(c => (c.render(dependencies)))}
        </>
    }

    private _getAllViewsForAllPlugins(): PluginView<unknown>[] {
        return this.plugins.map(c => c.registeredViews).reduce((prev, curr) => {
            curr.forEach((view) => {
                prev.push(view);
            })

            return prev;
        }, [] as PluginView<any>[]);
    }
}