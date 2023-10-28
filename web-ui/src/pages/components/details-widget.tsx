import { Tab, Tabs, Typography } from "@mui/material";
import { Ticket, TicketStepRepository, TicketPopulator, PopulatedTicket } from "@sop-workflow-tracker/core";
import { Plugin, TicketDetailsPluginView } from "@sop-workflow-tracker/react-plugin-engine";
import { useState } from "react";
import { TabPanel } from "../../components/tab-panel";
import { TicketSteps } from "./ticket-steps";

export function DetailsWidget({ plugins, selectedTicket, ticketStepRepository, ticketPopulator, setRefreshed }: { plugins: Plugin[], selectedTicket: Ticket, ticketStepRepository: TicketStepRepository, ticketPopulator: TicketPopulator, setRefreshed: (d: Date) => void }) {
  const [selectedDetailsTab, setSelectedDetailsTab] = useState('comments');

  const pluginViews = plugins.map((plugin: Plugin) => {
    const view = plugin.registeredViews.find(pluginView => pluginView.viewType === 'ticket_details') as TicketDetailsPluginView | undefined;

    return {
      Tab: <Tab label={plugin.id} value={plugin.id}></Tab>,
      TabPanel: () => <TabPanel value={selectedDetailsTab} index={plugin.id}>
        <div style={{ overflowY: 'auto' }}>
          {view?.render({ ticket: selectedTicket as any as PopulatedTicket })}
        </div>
      </TabPanel>,
    }
  });

  return <>
    <Tabs value={selectedDetailsTab} onChange={(_, v) => setSelectedDetailsTab(v)} children={
      [
      <Tab label="Steps" value="0"></Tab>,
      ...pluginViews.map(pluginView => (pluginView.Tab)),
      ]
    }/>
    {
      selectedTicket !== undefined ? (
        <>
          <TabPanel value={selectedDetailsTab} index={'0'}>
            <TicketSteps
              ticketStepRepository={ticketStepRepository}
              ticketPopulator={ticketPopulator}
              ticket={selectedTicket}
              setRefreshed={setRefreshed}
            ></TicketSteps>
          </TabPanel>
          {pluginViews.map(pluginView => <pluginView.TabPanel></pluginView.TabPanel>)}
        </>
      ) : (
        <Typography variant="body1">No ticket selected.</Typography>
      )
    }
  </>
}
