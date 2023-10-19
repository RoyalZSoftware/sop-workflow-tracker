import { Observable, of } from "rxjs";
import { StepId, Step, TemplateId, Template } from "./models/template";
import { Ticket, TicketId, TicketStep, TicketStepId, TicketStepRepository } from "./models/ticket";
import { StepRepository } from "./repositories/step-repository";
import { TicketFilter, TicketRepository } from "./repositories/ticket-repository";
import { TemplateRepository } from "./repositories/template-repository";

export abstract class BaseDummyRepository<T extends {id?: TId}, TId extends {value: string}> {
    constructor(public items: T[] = []) {
    }

    abstract idFactory(): TId;

    baseNextId(): string {
        return this.items.length.toString();
    }

    baseGet(id: TId) {
        return this.items.find(c => c.id?.value == id.value);
    }

    baseGetAll() {
        return this.items;
    }

    baseSave(item: T): T {
        item.id = this.idFactory();
        this.items.push(item);
        return item;
    }

    baseUpdate(id: TId, payload: Partial<T>) {
        let indexToUpdate = this.items.findIndex(item => item.id === id);
        this.items[indexToUpdate] = {...this.items[indexToUpdate], ...payload};
    
        this.items = Object.assign([], this.items);

        return of(this.items[indexToUpdate]);;
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
    update(id: StepId, payload: Partial<Step>): Observable<Step> {
        return this.baseUpdate(id, payload);
    }
}

export class DummyTicketStepRepository extends BaseDummyRepository<TicketStep, TicketStepId> implements TicketStepRepository {
    update(ticketStepId: TicketStepId, payload: Partial<TicketStep>): Observable<TicketStep> {
        return this.baseUpdate(ticketStepId, payload);
    }
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

export class DummyTemplateRepository extends BaseDummyRepository<Template, TemplateId> implements TemplateRepository {
    get(id: TemplateId): Observable<Template | undefined> {
        return of(this.baseGet(id));
    }
    getAll(): Observable<Template[]> {
        return of(this.baseGetAll());
    }
    idFactory(): TemplateId {
        return new TemplateId(this.baseNextId());
    }
}