import {
  Grid,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Ticket,
} from "@sop-workflow-tracker/core";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { useQuery } from "../data-provider/use-query";
import { NinjaKeysProvider } from "../ninja-keys";
import { Fullscreen } from "@mui/icons-material";
import { Board } from "../components/kanban-board/card-list";
import { TabPanel } from "../components/tab-panel";
import { DetailsWidget } from "./components/details-widget";
import { TicketBoardByStep } from "./components/ticket-board-by-step";
import { TicketsList } from "./components/ticket-list";


export function DashboardPage() {
  const {
    ticketRepository,
    stepRepository,
    ticketPopulator,
    ticketStepRepository,
    ticketBuilder,
    templateRepository,
    pluginManager,
  } = useContext(AppContext);
  const [selectedTicket, selectTicket] = useState(undefined as any as Ticket);
  const [refreshedAt, setRefreshed] = useState(new Date());
  const [kanbanFullScreen, setKanbanFullScreen] = useState(false);
  const tickets = useQuery<Ticket[]>(() =>
    ticketRepository
      .getAll()
  );

  const [selectedTab, setSelectedTab] = useState('0');

  const [plugins] = useState(pluginManager.plugins);

  if (tickets == undefined)
    return <></>;

  return (
    <div style={{ height: '100%', padding: 32 }}>
      <Grid container spacing={2} style={{ height: "100%" }}>
        <Grid item xs={12} style={{ transition: '0.15s all', height: kanbanFullScreen ? '100%' : '50%' }}>
          <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 8, position: 'relative' }}>
            <Fullscreen onClick={() => setKanbanFullScreen(!kanbanFullScreen)} style={{ cursor: 'pointer', zIndex: 400, position: 'absolute', top: 16, right: 16 }} />
            <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
              <Tab label="By State" value="0"></Tab>
              <Tab label="By Steps" value="1"></Tab>
            </Tabs>
            <TabPanel value={selectedTab} index={'0'}>
              <Board selectedTicket={selectedTicket} onCardClick={(card) => selectTicket(card)} cardLists={[{ title: 'Open', id: 'open' }, { title: 'Closed', id: 'closed' }].map(c => ({
                title: c.title,
                items: tickets.filter(ticket => ticket.ticketState == c.id)
              }))}></Board>
            </TabPanel>
            <TabPanel value={selectedTab} index={'1'}>
              <TicketBoardByStep
                selectTicket={selectTicket}
                selectedTicket={selectedTicket}
                ticketStepRepository={ticketStepRepository}
                tickets={tickets}
                stepRepository={stepRepository}
                refreshed={refreshedAt}
              />
            </TabPanel>
          </Paper>
        </Grid>
        {kanbanFullScreen ? <></> :
          <>
            <Grid item xs={6} style={{ height: "50%" }}>
              <Paper
                elevation={1}
                style={{ height: "100%", position: "relative" }}
              >
                <TicketsList selectTicket={selectTicket} selectedTicket={selectedTicket} tickets={tickets} />
              </Paper>
            </Grid>
            <Grid item xs={6} style={{ height: '50%' }}>
              <Paper elevation={1} style={{ padding: 32, maxHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <DetailsWidget setRefreshed={setRefreshed} ticketStepRepository={ticketStepRepository} ticketPopulator={ticketPopulator} selectedTicket={selectedTicket} plugins={plugins}/>
              </Paper>
            </Grid>
          </>
        }
      </Grid>
      <NinjaKeysProvider setRefreshedAt={setRefreshed} ticketBuilder={ticketBuilder} templateRepository={templateRepository}></NinjaKeysProvider>
    </div>
  );
}