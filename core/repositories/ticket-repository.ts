import { Ticket, TicketId } from "../models/ticket";
import { Observable } from 'rxjs';

export interface TicketFilter {
    nameQuery?: string;
}

export interface TicketRepository {
    getAll(ticketFilter?: TicketFilter): Observable<Ticket[]>;
    get(ticketId: TicketId): Observable<Ticket | undefined>;
    nextId(): TicketId;
    update(ticketId: TicketId, payload: Partial<Ticket>): Observable<Ticket>;
    save(ticket: Ticket): Observable<Ticket>;
}