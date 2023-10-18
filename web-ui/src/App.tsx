import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import {
  DummyStepRepository,
  DummyTicketRepository,
  DummyTicketStepRepository,
  PopulatedTicket,
  Ticket,
  TicketId,
  TicketPopulator,
} from "core";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { Observable, map } from "rxjs";

export const AppContext = createContext({
  ticketRepository: new DummyTicketRepository(),
  stepRepository: new DummyStepRepository(),
  ticketStepRepository: new DummyTicketStepRepository(),
  ticketPopulator: undefined as unknown as TicketPopulator,
});

function TList<T>(
  fetchItems: Observable<T[]>,
  displayFactory: (item: T) => string,
  onClick: (item: T) => void
) {
  const [items, setItems] = useState([] as any);

  const fetch = () => {
    fetchItems
      .subscribe((fetchedItems) => {
        setItems(fetchedItems);
      })
      .unsubscribe();
  };

  useEffect(() => {
    fetch();
  }, []);

  const Component = () => (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {items.map((c: any) => (
        <ListItem onClick={() => onClick(c)}>
          <ListItemAvatar>
            <Avatar></Avatar>
          </ListItemAvatar>
          <ListItemText primary={displayFactory(c)} secondary="July 20, 2014" />
        </ListItem>
      ))}
    </List>
  );

  return {
    fetch,
    Component,
  };
}

function TicketList({ refresh }: { refresh: any }) {
  const ticketRepository = useContext(AppContext).ticketRepository;
  const fetchSteps = ticketRepository.getAll();

  const [selectedTicket, selectTicket] = useState(undefined as unknown as Ticket);

  const myList = TList(
    fetchSteps,
    (i) => `#${i.id?.value} - ${i.name}`,
    (item) => {
      selectTicket(item);
    }
  );

  useEffect(() => {
    myList.fetch();
  }, [refresh]);

  return (
    <div>
      <h1>Tickets</h1>
      <myList.Component></myList.Component>
      {selectedTicket ? <StepList ticket={selectedTicket} /> : <></>}
    </div>
  );
}

function StepList({ ticket }: { ticket: Ticket }) {
  const { ticketPopulator, ticketStepRepository } = useContext(AppContext);
  const fetchItems = ticketPopulator.populate(ticket).pipe(
    map((populatedTicket: PopulatedTicket | undefined) => {
      return populatedTicket!.ticketSteps;
    })
  );

  const onClick = () => {
    alert("Updating");
  };

  const myList = TList(fetchItems, (c) => c.title, onClick);

  return <div>
    <h1>Schritte von {ticket.name}</h1>
    <myList.Component></myList.Component>
    </div>;
}

function CreateTicket({ doRefresh }: { doRefresh: () => any }) {
  const { ticketRepository } = useContext(AppContext);

  const [ticketName, setTicketName] = useState("");

  const onClick = () => {
    const ticket = new Ticket(ticketName);
    ticketRepository.save(ticket).subscribe(() => {
      alert(ticketRepository.items.length);
      doRefresh();
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

function RefreshContextProvider() {
  const [refresh, setRefresh] = useState(new Date());

  return {
    doRefresh: () => {
      setRefresh(new Date());
    },
    refresh,
  };
}

function App() {
  const [ticketRepository] = useState(
    new DummyTicketRepository([
      {
        name: "Tobis Körnerbrotbäckerei aufmachen",
        id: new TicketId("1"),
        ticketStepIds: [],
      },
      {
        name: "Ticket zum Kake essen",
        id: new TicketId("2"),
        ticketStepIds: [],
      },
      { name: "Kaufland ausrauben", id: new TicketId("3"), ticketStepIds: [] },
      {
        name: "Auf eine Statue klettern",
        id: new TicketId("4"),
        ticketStepIds: [],
      },
      {
        name: "Plastikbeutel ausdrucken",
        id: new TicketId("5"),
        ticketStepIds: [],
      },
    ])
  );
  const [stepRepository] = useState(new DummyStepRepository());
  const [ticketStepRepository] = useState(new DummyTicketStepRepository());
  const [ticketPopulator] = useState(
    new TicketPopulator(ticketRepository, ticketStepRepository)
  );

  const ticketRefreshContext = RefreshContextProvider();

  return (
    <AppContext.Provider
      value={{
        ticketRepository,
        ticketStepRepository,
        stepRepository,
        ticketPopulator,
      }}
    >
      <TicketList refresh={ticketRefreshContext.refresh} />
      <CreateTicket doRefresh={() => ticketRefreshContext.doRefresh()} />
    </AppContext.Provider>
  );
}

export default App;
