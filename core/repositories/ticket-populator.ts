import { Observable, map, of, switchMap, zip } from "rxjs";
import { Template } from "../models/template";
import { Ticket, TicketId } from "../models/ticket";
import { TicketRepository } from "./ticket-repository";
import { TicketStep } from "../models/ticket-step";
import { StepId } from "../models/step";
import { TicketStepRepository } from "./ticket-step-repository";

export type PopulatedTicket = Omit<Ticket, 'ticketStepIds' | 'templateId'> & {ticketSteps: TicketStep[], template: Template};

export class TicketPopulator {
    constructor(private _ticketRepository: TicketRepository, private _ticketStepRepository: TicketStepRepository) { }

    populateFromId(ticketId: TicketId): Observable<PopulatedTicket | undefined> {
        return this._ticketRepository.get(ticketId).pipe(switchMap((ticket) => {
            return !!ticket ? this.populate(ticket) : of(undefined);
        }))
    }

    populate(ticket: Ticket): Observable<PopulatedTicket> {
        if (ticket.ticketStepIds.length == 0) return of(ticket as unknown as PopulatedTicket);
        return zip(...ticket.ticketStepIds.map(c => this._ticketStepRepository.get(c))).pipe(
            map((steps) => {
                const populatedTicket = ticket as unknown as PopulatedTicket;

                populatedTicket.ticketSteps = steps as any;

                return populatedTicket;
            })
        )
    }

    getAllTicketStepsForStep(stepId: StepId): Observable<TicketStep[]> {
        return this._ticketStepRepository.query({
            limit: 50,
            stepId,
        }).pipe(map((i) => i.data));
    }
}