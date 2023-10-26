import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
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
import { PluginManager } from '@sop-workflow-tracker/react-plugin-engine';
import { CommentsPlugin } from "@sop-workflow-tracker/comments-plugin";

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
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
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
  } = useContext(AppContext);
  const [selectedTicket, selectTicket] = useState(undefined as any as Ticket);
  const [refreshedAt] = useState(new Date());
  const tickets = useQuery<Ticket[]>(() =>
    ticketRepository
      .getAll()
  );
  const pluginManager = new PluginManager();
  pluginManager.registerPlugin(new CommentsPlugin())

  if (tickets == undefined)
    return <>Waiting</>;

  return (
    <Grid container spacing={2} style={{ height: "100%" }}>
      <Grid item xs={12}>
        <Paper elevation={1} style={{ padding: 32 }}>
          <Typography variant="h6">New Ticket Step View</Typography>
          <NewTicketStepView
            selectTicket={selectTicket}
            selectedTicket={selectedTicket}
            ticketStepRepository={ticketStepRepository}
            tickets={tickets}
            stepRepository={stepRepository}
            refreshed={refreshedAt}
          />
        </Paper>
      </Grid>
      <Grid item xs={4} style={{ height: "100%" }}>
        <Paper
          elevation={1}
          style={{ height: "100%", position: "relative", padding: 32 }}
        >
          <Typography variant="h6">Tickets</Typography>
          <TicketsList
            selectedTicket={selectedTicket}
            selectTicket={(ticket) => selectTicket(ticket)}
            tickets={tickets}
          ></TicketsList>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper elevation={1} style={{ padding: 32 }}>
          <Typography variant="h6">Steps</Typography>
          {selectedTicket !== undefined ? (
            <>
              <TicketSteps
                ticketStepRepository={ticketStepRepository}
                ticketPopulator={ticketPopulator}
                ticket={selectedTicket}
              ></TicketSteps>
              {pluginManager.RenderAll('ticket_details', { ticket: selectedTicket })}
            </>
          ) : (
            <Typography variant="body1">Kein Ticket ausgewählt.</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}


function NewTicketStepView({
  ticketStepRepository,
  stepRepository,
  tickets,
  refreshed,
  selectTicket,
  selectedTicket,
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

  return (
    <Box style={{ overflow: 'auto', display: 'flex' }}>
      {Object.keys(populatedSteps).map((stepId) => {
        const step = allSteps[stepId];

        const tickets = populatedSteps[stepId];

        return (
          <Box style={{ width: '300px', flexShrink: '0', marginRight: 8 }}>
            <Typography variant="h6" style={{ textOverflow: 'truncate', overflow: 'hidden' }}>{step.name}</Typography>
            <Divider style={{ marginBottom: 8, marginTop: 4 }} />

            {tickets.map((ticket: Ticket) => (
              <Card style={{ marginBottom: 8 }} onClick={() => selectTicket(ticket)}>
                <CardContent>
                  {ticket.id!.value + ' - ' + ticket.name}
                </CardContent>

              </Card>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}