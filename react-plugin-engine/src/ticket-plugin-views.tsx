import { PopulatedTicket, Ticket, TicketRepository } from "@sop-workflow-tracker/core";
import { JSX } from "react";
import { PluginView } from "./internal/plugin-view-base";

export abstract class TicketDetailsPluginView implements PluginView<{ ticket: PopulatedTicket }> {
    readonly viewType: string = 'ticket_details';
    abstract render(dependencies: { ticket: PopulatedTicket; }): JSX.Element;
}

export abstract class TicketListPluginView implements PluginView<{ ticketRepository: TicketRepository, tickets: Ticket[]}> {
    viewType: string = 'ticket_list';
    abstract render(dependencies: { ticketRepository: TicketRepository; tickets: Ticket[]; }): JSX.Element;
}
