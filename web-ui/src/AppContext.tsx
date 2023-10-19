import { createContext } from "react";
import {
  DummyStepRepository,
  DummyTicketRepository,
  DummyTicketStepRepository, TicketPopulator
} from "core";


export const AppContext = createContext({
  ticketRepository: new DummyTicketRepository(),
  stepRepository: new DummyStepRepository(),
  ticketStepRepository: new DummyTicketStepRepository(),
  ticketPopulator: undefined as unknown as TicketPopulator,
  templateRepository: undefined as unknown as any,
});
