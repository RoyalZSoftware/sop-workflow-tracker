import { useState } from "react";
import "./App.css";
import {
  DummyStepRepository,
  DummyTemplateRepository,
  DummyTicketRepository,
  DummyTicketStepRepository,
  TicketId,
  TicketPopulator,
  TicketStep,
  TicketStepId,
} from "core";
import { AppContext } from "./AppContext";
import { TicketContext } from "./components/tickets";
import { Navbar } from "./components/navbar";

function App() {
  const [templateRepository] = useState(new DummyTemplateRepository());
  const [ticketRepository] = useState(
    new DummyTicketRepository([
      {
        name: "Tobis Körnerbrotbäckerei aufmachen",
        id: new TicketId("0"),
        ticketStepIds: [new TicketStepId("0")],
      },
      {
        name: "Ticket",
        id: new TicketId("1"),
        ticketStepIds: [],
      },
      { name: "Kaufland ausrauben", id: new TicketId("3"), ticketStepIds: [] },
      {
        name: "Auf eine Statue klettern",
        id: new TicketId("2"),
        ticketStepIds: [],
      },
      {
        name: "Plastikbeutel ausdrucken",
        id: new TicketId("3"),
        ticketStepIds: [],
      },
    ])
  );
  const [stepRepository] = useState(new DummyStepRepository());
  const sampleTicketStep = new TicketStep(
    "Hosentaschenleeren",
    undefined,
    "Test",
    true
  );
  sampleTicketStep.id = new TicketStepId("0");
  const [ticketStepRepository] = useState(
    new DummyTicketStepRepository([sampleTicketStep])
  );
  const [ticketPopulator] = useState(
    new TicketPopulator(ticketRepository, ticketStepRepository)
  );

  return (
    <>
      <Navbar />
      <div style={{ padding: 32, height: "100%" }}>
        <AppContext.Provider
          value={{
            ticketRepository,
            ticketStepRepository,
            stepRepository,
            ticketPopulator,
            templateRepository,
          }}
        >
          <TicketContext></TicketContext>
        </AppContext.Provider>
      </div>
    </>
  );
}

export default App;
