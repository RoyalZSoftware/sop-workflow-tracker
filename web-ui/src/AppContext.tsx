import { createContext } from "react";
import {
  StepRepository, TemplateRepository, TicketBuilder, TicketPopulator, TicketRepository, TicketStepRepository
} from "@sop-workflow-tracker/core";
import { PluginManager } from "@sop-workflow-tracker/react-plugin-engine";


export const AppContext = createContext({
  ticketRepository: undefined as unknown as TicketRepository,
  stepRepository: undefined as unknown as StepRepository,
  ticketStepRepository: undefined as unknown as TicketStepRepository,
  ticketPopulator: undefined as unknown as TicketPopulator,
  templateRepository: undefined as unknown as TemplateRepository,
  ticketBuilder: undefined as unknown as TicketBuilder,
  pluginManager: undefined as unknown as PluginManager,
});
