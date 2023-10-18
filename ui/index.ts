import { DummyStepRepository, DummyTicketRepository, TicketBuilder, Template, Step, Ticket, DummyTicketStepRepository, TicketPopulator, PopulatedTicket } from 'core';
import { zip, from, tap} from 'rxjs';
import { switchMap } from 'rxjs/operators';

const stepRepository = new DummyStepRepository();
const ticketRepository = new DummyTicketRepository();
const ticketStepRepository = new DummyTicketStepRepository();
const ticketBuilder = new TicketBuilder(stepRepository, ticketRepository, ticketStepRepository);
const ticketPopulator = new TicketPopulator(ticketRepository, ticketStepRepository);

const steps = [
    new Step("Silikon auspacken"),
    new Step("Döner essen"),
    new Step("Dönersauce drauftun"),
    new Step("Deutsche Bahn anzünden"),
];

class TicketPresenter {
    present(ticket: PopulatedTicket) {
        console.log(`Ticket #${ticket.id!.value} - ${ticket.name}`);
        console.log('Steps');
        ticket.ticketSteps.forEach(step => {
            console.log(`  - ${step.title} - ${step.checked ? '[X]' : '[ ]'}`);
        });
    }
}

async function main() {
    await zip(...steps.map(c => stepRepository.save(c))).pipe(
        switchMap((steps) => {
            const template: Template = {
                name: "Silikon Dildo bauen",
                stepIds: steps.map(c => c.id!),
            };
            return ticketBuilder.createTicketFromTemplate(template)
        }),
        switchMap((ticket: Ticket) => {
            return from((async () => {
                await ticketRepository.save(JSON.parse(JSON.stringify(ticket))).toPromise();
                await ticketRepository.save(JSON.parse(JSON.stringify(ticket))).toPromise();
                await ticketRepository.save(JSON.parse(JSON.stringify(ticket))).toPromise();
                await ticketRepository.save(JSON.parse(JSON.stringify(ticket))).toPromise();
            })())
        }),
    ).toPromise();

    console.log(ticketRepository.items);

    await ticketRepository.getAll().pipe(
        switchMap((tickets) => {
            return zip(tickets.map(c => ticketPopulator.populate(c)));
        }),
        tap((populatedTickets) => {
            const presenter = new TicketPresenter();

            populatedTickets.forEach(p => presenter.present(p));
        })
    ).toPromise();

}

main();
