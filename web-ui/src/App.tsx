import { useState } from "react";
import "./App.css";
import {
  Step,
  StepId,
  TemplateId,
  TicketBuilder,
  TicketPopulator,
} from "@sop-workflow-tracker/core";
import {
  DummyStepRepository,
  DummyTemplateRepository,
  DummyTicketRepository,
  DummyTicketStepRepository,
} from './dummy';
import { AppContext } from "./AppContext";
import { TicketContext } from "./components/tickets";
import { Navbar } from "./components/navbar";
import { NinjaKeysProvider } from "./ninja-keys";

function App() {
  const [stepRepository] = useState(new DummyStepRepository([
    new Step("Box drucken"),
    new Step("Schraubenmounts einsetzen"),
    new Step("1. Schablonenwand drucken"),
    new Step("2. Schablonenwand drucken"),
    new Step("3. Schablonenwand drucken"),
    new Step("PCBs einkleben"),
    new Step("Raspberry einkleben"),
    new Step("Installation vom Raspberry"),
    new Step("Test vom Raspberry"),
    new Step("Verkabeln"),
  ], "steps"));
  const [templateRepository] = useState(new DummyTemplateRepository([
    {
      name: "Controlbox fertigung",
      stepIds: [
        new StepId('0'),
        new StepId('1'),
        new StepId('2'),
        new StepId('3'),
        new StepId('4'),
        new StepId('5'),
        new StepId('6'),
        new StepId('7'),
        new StepId('8'),
      ],
      id: new TemplateId('0'),
    }
  ], "templates"));
  const [ticketRepository] = useState(
    new DummyTicketRepository([], "tickets")
  );
  const [ticketStepRepository] = useState(
    new DummyTicketStepRepository([], "ticket_steps")
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
        <NinjaKeysProvider ticketRepository={ticketRepository} ticketBuilder={ticketBuilder} templateRepository={templateRepository}></NinjaKeysProvider>
      </div>
    </>
  );
}

export default App;
