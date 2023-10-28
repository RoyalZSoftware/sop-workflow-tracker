export interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  if (value === index)
    return <>{children}</>;
  return (<></>);
}