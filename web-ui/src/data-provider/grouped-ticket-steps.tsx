import { TicketStepRepository, Ticket, TicketStep } from "@sop-workflow-tracker/core";
import { Observable, map, zip, of } from "rxjs";

export function reduceToMap<T>(mapKeyFactory: (t: T) => string, itemsArray: T[]) {
  return itemsArray.reduce((prev, curr) => {
    prev[mapKeyFactory(curr)] = curr;
    return prev;
  }, {} as { [key: string]: T });
}

export function getStepGroupedTickets({
  ticketStepRepository,
  tickets
}: {
  ticketStepRepository: TicketStepRepository;
  tickets: Ticket[]
}): Observable<{ [stepId: string]: Ticket[] }> {
  const allTicketSteps$ = ticketStepRepository
    .query({})
    .pipe(map(({ data }) => data));
  const theTickets = reduceToMap<Ticket>((t) => t.id!.value, tickets);

  return allTicketSteps$.pipe(
    map((ticketSteps: TicketStep[]) => {
      return ticketSteps.filter(c => !c.checked).reduce((prev, curr) => {
        prev[curr.stepId!.value] ??= [];
        prev[curr.stepId!.value].push(theTickets[curr.ticketId!.value]);
        return prev;
      }, {} as any);
    })
  );
}