import { createContext } from "react";
import {
  StepRepository, TemplateRepository, TicketBuilder, TicketPopulator, TicketRepository, TicketStepRepository
} from "core";


export const AppContext = createContext({
  ticketRepository: undefined as unknown as TicketRepository,
  stepRepository: undefined as unknown as StepRepository,
  ticketStepRepository: undefined as unknown as TicketStepRepository,
  ticketPopulator: undefined as unknown as TicketPopulator,
  templateRepository: undefined as unknown as TemplateRepository,
  ticketBuilder: undefined as unknown as TicketBuilder,
});
