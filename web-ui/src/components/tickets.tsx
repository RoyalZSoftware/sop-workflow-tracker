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
  Step,
  StepRepository,
  Ticket,
  TicketRepository,
  TicketStepRepository,
} from "core";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Add } from "@mui/icons-material";
import CreateTicketDialog from "./create-ticket-dialog";
import { TicketSteps } from "./ticket-steps";
import { Observable, map, zip } from "rxjs";

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
              setRefreshedAt={setRefreshedAt}
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
            ticketStepRepository={ticketStepRepository}
            ticketRepository={ticketRepository}
            stepRepository={stepRepository}
            refreshed={refreshedAt}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

function reduceToMap<T>(mapKeyFactory: (t: T) => string, itemsArray: T[]) {
  return itemsArray.reduce((prev, curr) => {
    prev[mapKeyFactory(curr)] = curr;
    return prev;
  }, {} as { [key: string]: T });
}

function getStepGroupedTickets({
  ticketStepRepository,
  ticketRepository,
}: {
  ticketStepRepository: TicketStepRepository;
  ticketRepository: TicketRepository;
}): Observable<{ [stepId: string]: Ticket }> {
  const allTicketSteps$ = ticketStepRepository
    .query({})
    .pipe(map(({ data }) => data));
  const allTickets$ = ticketRepository
    .getAll()
    .pipe(
      map((tickets: Ticket[]) =>
        reduceToMap<Ticket>((t) => t.id!.value, tickets)
      )
    );

  return zip(allTicketSteps$, allTickets$).pipe(
    map(([ticketSteps, tickets]) => {
      return ticketSteps.filter(c => !c.checked).reduce((prev, curr) => {
        prev[curr.stepId!.value] ??= [];
        prev[curr.stepId!.value].push(tickets[curr.ticketId!.value]);
        return prev;
      }, {} as any);
    })
  );
}

function NewTicketStepView({
  ticketStepRepository,
  stepRepository,
  ticketRepository,
  refreshed,
}: {
  ticketRepository: TicketRepository;
  ticketStepRepository: TicketStepRepository;
  stepRepository: StepRepository;
  refreshed: Date;
}) {
  const allSteps = useQuery<{ [id: string]: Step }>(
    stepRepository
      .query({})
      .pipe(map(({ data }) => reduceToMap((t) => t.id!.value, data))),
      [refreshed]
  );
  const populatedSteps = useQuery<any>(
    getStepGroupedTickets({ ticketRepository, ticketStepRepository }),
    [refreshed]
  );

  if (allSteps === undefined || populatedSteps === undefined) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <List>
        {Object.keys(populatedSteps).map((stepId) => {
          const step = allSteps[stepId];

          const tickets = populatedSteps[stepId];

          return (
            <>
              <ListItem>Step: {step.name}</ListItem>
              <List style={{ marginLeft: 32 }}>
                {tickets.map((ticket: Ticket) => (
                  <ListItem>
                    <ListItemText
                      primary={
                        "Ticket # " + ticket.id!.value + " - " + ticket.name
                      }
                      secondary="July 20, 2014"
                    />
                  </ListItem>
                ))}
              </List>
            </>
          );
        })}
      </List>
    </div>
  );
}

function useQuery<T>(fetch: Observable<T>, deps=[] as any []): T {
  const [state, updateState] = useState(undefined as T);

  useEffect(() => {
    const subscription = fetch.subscribe((result) => {
      updateState(result);
    });

    return () => subscription.unsubscribe();
  }, deps);

  return state;
}
