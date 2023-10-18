import { Observable, of } from "rxjs";
import { StepId, Step } from "./models/template";
import { Ticket, TicketId, TicketStep, TicketStepId, TicketStepRepository } from "./models/ticket";
import { StepRepository } from "./repositories/step-repository";
import { TicketFilter, TicketRepository } from "./repositories/ticket-repository";

export abstract class BaseDummyRepository<T extends {id?: TId}, TId extends {value: string}> {
    constructor(public items: T[] = []) {
    }

    abstract idFactory(): TId;

    baseNextId(): string {
        return this.items.length.toString();
    }

    baseGet(id: TId) {
        return this.items.find(c => c.id!.value == id.value);
    }

    baseGetAll() {
        return this.items;
    }

    baseSave(item: T): T {
        item.id = this.idFactory();
        this.items.push(item);
        return item;
    }
}

export class DummyTicketRepository extends BaseDummyRepository<Ticket, TicketId> implements TicketRepository {
    idFactory(): TicketId {
        return new TicketId(this.baseNextId());
    }
    getAll(ticketFilter?: TicketFilter | undefined): Observable<Ticket[]> {
        return of(this.baseGetAll());
    }
    get(ticketId: TicketId): Observable<Ticket | undefined> {
        return of(this.baseGet(ticketId));
    }
    nextId(): TicketId {
        return new TicketId(this.baseNextId());
    }
    save(ticket: Ticket): Observable<Ticket> {
        return of(this.baseSave(ticket));
    }
}

export class DummyStepRepository extends BaseDummyRepository<Step, StepId> implements StepRepository{
    get(stepId: StepId): Observable<Step | undefined> {
        return of(this.baseGet(stepId));
    }
    save(step: Step): Observable<Step> {
        return of(this.baseSave(step));
    }
    idFactory(): StepId {
        return new StepId(this.baseNextId());
    }
    getMulti(stepIds: StepId[]): Observable<Step[]> {
        return of(stepIds.map(c => this.baseGet(c)).filter(c => !!c)) as any;
    }

}

export class DummyTicketStepRepository extends BaseDummyRepository<TicketStep, TicketStepId> implements TicketStepRepository {
    idFactory(): TicketStepId {
        return new TicketStepId(this.baseNextId());
    }
    save(ticketStep: TicketStep): Observable<TicketStep> {
        return of(this.baseSave(ticketStep));
    }
    get(ticketStepId: TicketStepId): Observable<TicketStep | undefined> {
        return of(this.baseGet(ticketStepId));
    }

}