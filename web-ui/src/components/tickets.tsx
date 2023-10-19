import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import {
  PopulatedTicket,
  Ticket,
  TicketPopulator,
  TicketRepository,
} from "core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Add } from "@mui/icons-material";
import CreateTicketDialog from "./create-ticket-dialog";

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
          selected={selectedTicket == ticket}
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
  const { ticketRepository, ticketPopulator, templateRepository } = useContext(AppContext);
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [selectedTicket, selectTicket] = useState(undefined as any as Ticket);
  const [refreshedAt, setRefreshedAt] = useState(new Date());

  const [isCreateTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);

  const fetch = () => {
    (async () => {
      ticketRepository
        .getAll()
        .toPromise()
        .then((fetchedTickets: any) => {
          setTickets(fetchedTickets);
        });
    })();
  };

  useEffect(() => {
    fetch();
  }, [refreshedAt]);

  return (
    <Grid container spacing={2} style={{ height: "100%" }}>
      <Grid item xs={4} style={{ height: "100%" }}>
        <Card elevation={1} style={{ height: "100%", position: "relative" }}>
          <CardHeader title="Tickets" />
          <CardContent>
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
              ticketRepository={ticketRepository}
              templateRepository={templateRepository}
              isOpen={isCreateTicketDialogOpen}
              close={() => setCreateTicketDialogOpen(false)}
            ></CreateTicketDialog>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={8}>
        <Card elevation={1}>
          <CardHeader title="Details" />
          <CardContent>
            {selectedTicket != undefined ? (
              <TicketSteps
                ticketPopulator={ticketPopulator}
                ticket={selectedTicket}
              ></TicketSteps>
            ) : (
              <Typography variant="body1">Kein Ticket ausgewählt.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function TicketSteps({
  ticket,
  ticketPopulator,
}: {
  ticket: Ticket;
  ticketPopulator: TicketPopulator;
}) {
  const [populatedTicket, setPopulatedTicket] = useState(
    undefined as PopulatedTicket | undefined
  );

  useEffect(() => {
    const subscription = ticketPopulator
      .populate(ticket)
      .subscribe((fetchedPopulatedTicket) => {
        setPopulatedTicket(fetchedPopulatedTicket);
      });
    return () => subscription.unsubscribe();
  }, [ticket]);

  return (
    <List>
      {populatedTicket?.ticketSteps?.map((c) => (
        <ListItem>
          <ListItemText primary={c.title} secondary={c.description} />
        </ListItem>
      ))}
      {(populatedTicket?.ticketSteps?.length ?? 0) > 0 ? (
        <></>
      ) : (
        <Typography variant="body1">Keine Schritte gefunden</Typography>
      )}
    </List>
  );
}
