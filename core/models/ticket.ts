import { Observable, switchMap, zip } from "rxjs";
import { StepRepository } from "../repositories/step-repository";
import { StepId, Template, TemplateId } from "./template";
import { TicketRepository } from "../repositories/ticket-repository";

export class TicketId {
    constructor(public value: string) { }
}

export class TicketStepId {
    constructor(public value: string) { }
}

export class TicketStep {
    public id?: TicketStepId;
    constructor(public title: string, public stepId?: StepId, public description?: string, public checked: boolean = false, public createdAt: Date = new Date()) { }
}

export interface TicketStepRepository {
    save(ticketStep: TicketStep): Observable<TicketStep>;
    get(ticketStepId: TicketStepId): Observable<TicketStep | undefined>;
}

export class Ticket {
    public id?: TicketId;
    public templateId?: TemplateId;

    constructor(public name: string, public ticketStepIds: TicketStepId[] = []) { }
}

export class TicketBuilder {
    constructor(private _stepRepository: StepRepository, private _ticketRepository: TicketRepository, private _ticketStepRepository: TicketStepRepository) { }

    public createTicketFromTemplate(template: Template): Observable<Ticket> {
        return this._stepRepository.getMulti(template.stepIds!).pipe(
            switchMap((steps) => {
                const ticketSteps = steps.map(c => ({ ...c }));

                return zip(...ticketSteps.map(c => this._ticketStepRepository.save(
                    new TicketStep(c.name, c.id, c.description, true)
                ))).pipe(
                    switchMap((ticketStepIds) => {
                        const ticket = new Ticket(template.name);
                        ticket.ticketStepIds = ticketStepIds.map(c => c.id!);
                        return this._ticketRepository.save(ticket);
                    })
                )
            }),
        )
    }
}