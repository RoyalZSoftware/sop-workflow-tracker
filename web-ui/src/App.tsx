import { useState } from "react";
import "./App.css";
import {
  StepId,
  TemplateId,
  TicketBuilder,
  TicketId,
  TicketPopulator,
  TicketStep,
  TicketStepId,
} from "core";
import {
  DummyStepRepository,
  DummyTemplateRepository,
  DummyTicketRepository,
  DummyTicketStepRepository,
} from './dummy';
import { AppContext } from "./AppContext";
import { TicketContext } from "./components/tickets";
import { Navbar } from "./components/navbar";

function App() {
  const [templateRepository] = useState(new DummyTemplateRepository([
    {
      name: "Gurke 3D drucken",
      stepIds: [
        new StepId('0'),
      ],
      id: new TemplateId('0'),
    }
  ], "templates"));
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
    ], "tickets")
  );
  const [stepRepository] = useState(new DummyStepRepository([], "steps"));
  const sampleTicketStep = new TicketStep(
    "Hosentaschenleeren",
    undefined,
    "Test",
    true
  );
  sampleTicketStep.id = new TicketStepId("0");
  const [ticketStepRepository] = useState(
    new DummyTicketStepRepository([sampleTicketStep], "ticket_steps")
  );
  const [ticketPopulator] = useState(
    new TicketPopulator(ticketRepository, ticketStepRepository)
  );

  const [ticketBuilder] = useState(new TicketBuilder(stepRepository, ticketRepository, ticketStepRepository));

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
            ticketBuilder,
          }}
        >
          <TicketContext></TicketContext>
        </AppContext.Provider>
      </div>
    </>
  );
}

export default App;
