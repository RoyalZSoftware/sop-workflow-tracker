import React from "react";
import { PluginView } from "./internal/plugin-view-base";
import { Plugin } from "./plugin";

export class PluginManager {
    public readonly plugins: Plugin[] = [];

    public registerPlugin(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    RenderAll(viewType: string, dependencies: any): React.JSX.Element {
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