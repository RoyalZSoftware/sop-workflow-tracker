import { Observable, of, switchMap, zip } from "rxjs";
import { StepRepository } from "../repositories/step-repository";
import { Template, TemplateId } from "./template";
import { TicketRepository } from "../repositories/ticket-repository";
import { TicketStep, TicketStepId } from "./ticket-step";
import { TicketStepRepository } from "../repositories/ticket-step-repository";
import { Step } from "./step";

export class TicketId {
    constructor(public value: string) { }
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
            switchMap((steps: Step[]) => {
                const baseTicket = new Ticket(template.name);
                return this._ticketRepository.save(baseTicket).pipe(
                    switchMap((savedTicket: Ticket) => {
                        const ticketSteps = steps.map(c => this._ticketStepRepository.save(
                            {...new TicketStep(c.name, c.id, c.description), ticketId: savedTicket.id!}
                        ));

                        if (ticketSteps.length == 0) {
                            return of(savedTicket);
                        }

                        return zip(...ticketSteps).pipe(
                            switchMap((ticketStepIds) => {
                                return this._ticketRepository.update(savedTicket.id!, {
                                    ticketStepIds: ticketStepIds.map(c => c.id!),
                                });
                            })
                        )
                    }),
                )
            })
        );
    }
}