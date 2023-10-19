import { createContext } from "react";
import {
  DummyStepRepository,
  DummyTicketRepository,
  DummyTicketStepRepository, TemplateRepository, TicketBuilder, TicketPopulator
} from "core";


export const AppContext = createContext({
  ticketRepository: new DummyTicketRepository(),
  stepRepository: new DummyStepRepository(),
  ticketStepRepository: new DummyTicketStepRepository(),
  ticketPopulator: undefined as unknown as TicketPopulator,
  templateRepository: undefined as unknown as TemplateRepository,
  ticketBuilder: undefined as unknown as TicketBuilder,
});
