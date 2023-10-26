export enum ViewType {
    TICKET_DETAILS
}

export interface PluginView<Dependencies> {
    viewType: ViewType;
    render: (dependencies: Dependencies) => React.JSX.Element;
}
