import {
  Box,
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Step,
  StepRepository,
  Ticket,
  TicketRepository,
  TicketStepRepository,
} from "@sop-workflow-tracker/core";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { TicketSteps } from "./ticket-steps";
import { map } from "rxjs";
import { useQuery } from "../data-provider/use-query";
import { getStepGroupedTickets, reduceToMap } from "../data-provider/grouped-ticket-steps";
import { Board } from "./kanban-board/card-list";
import { NinjaKeysProvider } from "../ninja-keys";
import { Fullscreen } from "@mui/icons-material";


interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  if (value === index)
    return <>{children}</>;
  return (<></>);
}

function TicketsList({
  selectTicket,
  selectedTicket,
  tickets,
}: {
  selectTicket: (ticket: Ticket) => void;
  tickets: Ticket[];
  selectedTicket: Ticket | undefined;
}) {
  const onClick = (ticket: Ticket) => {
    selectTicket(ticket);
  };

  return (
    <List sx={{ width: "100%", maxHeight: '100%', overflowY: 'auto' }}>
      {tickets.map((ticket) => (
        <ListItemButton
          selected={selectedTicket === ticket}
          onClick={() => onClick(ticket)}
          style={{ width: "100%" }}
        >
          <ListItemText primary={"# " + ticket.id!.value + " - " + ticket.name} />
        </ListItemButton>
      ))}
    </List>
  );
}

export function CreateTicket({
  refreshTickets,
  ticketRepository,
}: {
  refreshTickets: () => void;
  ticketRepository: TicketRepository;
}) {
  const [ticketName, setTicketName] = useState("");

  const onClick = () => {
    const ticket = new Ticket(ticketName);
    ticketRepository.save(ticket).subscribe(() => {
      refreshTickets();
    });
  };

  return (
    <div>
      <TextField
        label="Ticket name"
        onChange={(v) => setTicketName(v.target.value)}
        value={ticketName}
      />
      <Button onClick={onClick} variant="contained">
        Erstellen
      </Button>
    </div>
  );
}

export function TicketContext() {
  const {
    ticketRepository,
    stepRepository,
    ticketPopulator,
    ticketStepRepository,
    ticketBuilder,
    templateRepository
  } = useContext(AppContext);
  const [selectedTicket, selectTicket] = useState(undefined as any as Ticket);
  const [refreshedAt, setRefreshed] = useState(new Date());
  const [kanbanFullScreen, setKanbanFullScreen] = useState(false);
  const tickets = useQuery<Ticket[]>(() =>
    ticketRepository
      .getAll()
  );

  const [selectedTab, setSelectedTab] = useState('0');

  if (tickets == undefined)
    return <>Waiting</>;

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
            <CustomTabPanel value={selectedTab} index={'0'}>
              <Board selectedTicket={selectedTicket} onCardClick={(card) => selectTicket(card)} cardLists={[{ title: 'Open', id: 'open' }, { title: 'Closed', id: 'closed' }].map(c => ({
                title: c.title,
                items: tickets.filter(ticket => ticket.ticketState == c.id)
              }))}></Board>
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={'1'}>
              <NewTicketStepView
                selectTicket={selectTicket}
                selectedTicket={selectedTicket}
                ticketStepRepository={ticketStepRepository}
                tickets={tickets}
                stepRepository={stepRepository}
                refreshed={refreshedAt}
              />
            </CustomTabPanel>
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
                <Typography variant="h6">Steps</Typography>
                {selectedTicket !== undefined ? (
                  <>
                    <TicketSteps
                      ticketStepRepository={ticketStepRepository}
                      ticketPopulator={ticketPopulator}
                      ticket={selectedTicket}
                      setRefreshed={setRefreshed}
                    ></TicketSteps>
                  </>
                ) : (
                  <Typography variant="body1">Kein Ticket ausgewählt.</Typography>
                )}
              </Paper>
            </Grid>

          </>
        }
      </Grid>
      <NinjaKeysProvider setRefreshedAt={setRefreshed} ticketBuilder={ticketBuilder} templateRepository={templateRepository}></NinjaKeysProvider>
    </div>
  );
}


function NewTicketStepView({
  ticketStepRepository,
  stepRepository,
  tickets,
  refreshed,
  selectTicket,
  selectedTicket
}: {
  tickets: Ticket[];
  ticketStepRepository: TicketStepRepository;
  stepRepository: StepRepository;
  refreshed: Date;
  selectTicket: (ticket: Ticket) => void;
  selectedTicket: Ticket | undefined;
}) {
  const allSteps = useQuery<{ [id: string]: Step }>(
    () => stepRepository
      .query({})
      .pipe(map(({ data }) => reduceToMap((t) => t.id!.value, data))),
    [refreshed]
  );
  const populatedSteps = useQuery<any>(
    () => getStepGroupedTickets({ tickets, ticketStepRepository }),
    [refreshed]
  );

  if (allSteps === undefined || populatedSteps === undefined) {
    return <h2>Loading...</h2>;
  }

  const data = Object.keys(populatedSteps).map(stepId => {
    const step = allSteps[stepId];
    return {
      title: step.name,
      items: populatedSteps[stepId],
    }
  })

  const states = [{ id: 'open', title: 'Open' }, { id: 'closed', title: 'Closed' }];

  return <>
    <Board selectedTicket={selectedTicket} onCardClick={(card) => selectTicket(card)} cardLists={data}></Board>
  </>
}