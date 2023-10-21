import {
  Button,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  PaginatedResponse,
  Step,
  StepRepository,
  Ticket,
  TicketPopulator,
  TicketRepository,
} from "core";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Add } from "@mui/icons-material";
import CreateTicketDialog from "./create-ticket-dialog";
import { TicketSteps } from "./ticket-steps";
import { Observable, map } from "rxjs";

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
          <ListItemText primary={ticket.name} secondary="July 20, 2014" />
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
    templateRepository,
    ticketBuilder,
    ticketStepRepository,
  } = useContext(AppContext);
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [selectedTicket, selectTicket] = useState(undefined as any as Ticket);
  const [refreshedAt, setRefreshedAt] = useState(new Date());

  const [isCreateTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);

  const fetch = useCallback(() => {
    return ticketRepository
      .getAll()
      .subscribe((fetchedTickets: Ticket[]) => setTickets(fetchedTickets))
      .unsubscribe();
  }, [ticketRepository]);

  useEffect(() => {
    fetch();
  }, [fetch, refreshedAt]);

  return (
    <Grid container spacing={2} style={{ height: "100%" }}>
      <Grid item xs={4} style={{ height: "100%" }}>
        <Paper
          elevation={1}
          style={{ height: "100%", position: "relative", padding: 32 }}
        >
          <Typography variant="h4">Tickets</Typography>
          <TicketsList
            selectedTicket={selectedTicket}
            selectTicket={(ticket) => selectTicket(ticket)}
            tickets={tickets}
          ></TicketsList>
          <Fab
            onClick={() => setCreateTicketDialogOpen(true)}
            color="primary"
            size="medium"
            style={{ position: "absolute", right: "32px", bottom: "32px" }}
          >
            <Add />
          </Fab>
          <CreateTicketDialog
            ticketBuilder={ticketBuilder}
            ticketRepository={ticketRepository}
            templateRepository={templateRepository}
            isOpen={isCreateTicketDialogOpen}
            close={() => {
              setRefreshedAt(new Date());
              setCreateTicketDialogOpen(false);
            }}
          ></CreateTicketDialog>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper elevation={1} style={{ padding: 32 }}>
          <Typography variant="h4">Steps</Typography>
          {selectedTicket !== undefined ? (
            <TicketSteps
              ticketStepRepository={ticketStepRepository}
              ticketPopulator={ticketPopulator}
              ticket={selectedTicket}
            ></TicketSteps>
          ) : (
            <Typography variant="body1">Kein Ticket ausgewählt.</Typography>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={1} style={{ padding: 32 }}>
          <Typography variant="h4">New Ticket Step View</Typography>
          <NewTicketStepView
          ticketRepository={ticketRepository}
            ticketPopulator={ticketPopulator}
            stepRepository={stepRepository}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

function NewTicketStepView({
  ticketPopulator,
  stepRepository,
  ticketRepository,
}: {
  ticketPopulator: TicketPopulator;
  ticketRepository: TicketRepository;
  stepRepository: StepRepository;
}) {
  const allSteps = useQuery<Step[]>(() => stepRepository.query({}).pipe(map(({data}: PaginatedResponse<Step>) => data)));

  const TicketsFor = ({step}: {step: Step}) => {
    
    const presentTicket = useCallback((ticket: Ticket) => {
      return `# ${ticket.id!.value} - ${ticket.name}`;
    }, []);
    
    const foundTicketSteps = useQuery(() => ticketPopulator.getAllTicketStepsForStep(step.id!));

    const allTickets = useQuery(() => ticketRepository.getAll());

    return <List>
      {step.name}
      {foundTicketSteps?.filter(c => !c.checked).map((foundStep) => (
      <ListItem>
      {presentTicket(allTickets.find(c => c.id!.value === foundStep.ticketId!.value)!)}
      </ListItem>
      ))}
    </List>
  }

  return (
    <div>
      <List>
        {allSteps ? 
        allSteps.map((step) => <TicketsFor step={step}/>)
        : <></>
        }
      </List>
    </div>
  );
}

function useQuery<T>(fetch: () => Observable<T>): T {
  const [state, updateState] = useState(undefined as T);

  const f = useCallback(fetch, [fetch]);

  useEffect(() => {
    const subscription = f().subscribe((result) => {
      updateState(result);
    });

    return () => subscription.unsubscribe();
  }, [f]);

  return state;
}