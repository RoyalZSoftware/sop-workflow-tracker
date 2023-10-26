export interface PluginView<Dependencies> {
    viewType: string;
    render: (dependencies: Dependencies) => React.JSX.Element;
}
