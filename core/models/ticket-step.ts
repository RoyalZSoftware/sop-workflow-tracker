import { StepId } from "./step";
import { TicketId } from "./ticket";

export class TicketStepId {
    constructor(public value: string) { }
}

export class TicketStep {
    public id?: TicketStepId;
    public ticketId?: TicketId;
    constructor(public title: string, public stepId?: StepId, public description?: string, public checked: boolean = false, public createdAt: Date = new Date()) { }
}