import { Observable } from "rxjs";
import { TicketStep, TicketStepId } from "../models/ticket-step";
import { PaginatedResponse, PaginationFilter } from "./paginated-resource";

export interface TicketStepFilter extends PaginationFilter {
    stepId?: TicketStepId;
}

export interface TicketStepRepository {
    save(ticketStep: TicketStep): Observable<TicketStep>;
    get(ticketStepId: TicketStepId): Observable<TicketStep | undefined>;
    query(ticketStepFilter: TicketStepFilter): Observable<PaginatedResponse<TicketStep>>;
    update(ticketStepId: TicketStepId, payload: Partial<TicketStep>): Observable<TicketStep>;
}
