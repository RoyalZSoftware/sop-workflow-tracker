import { Step, StepRepository, Template, TemplateRepository, Ticket, TicketStepRepository } from "@sop-workflow-tracker/core";
import { map } from "rxjs";
import { Board } from "../../components/kanban-board/card-list";
import { reduceToMap, getStepGroupedTickets } from "../../data-provider/grouped-ticket-steps";
import { useQuery } from "../../data-provider/use-query";

export function TicketBoardByStep({
  ticketStepRepository,
  stepRepository,
  tickets,
  refreshed,
  selectTicket,
  selectedTicket,
  templateRepository
}: {
  tickets: Ticket[];
  ticketStepRepository: TicketStepRepository;
  templateRepository: TemplateRepository,
  stepRepository: StepRepository;
  refreshed: Date;
  selectTicket: (ticket: Ticket) => void;
  selectedTicket: Ticket | undefined;
}) {
  const allTemplates = useQuery<{[id: string]: Template}>(() => templateRepository.getAll().pipe(
    map((templates) => reduceToMap((t: Template) => t.id!.value, templates))
  ));
  const allSteps = useQuery<{ [id: string]: Step }>(
    () => stepRepository
      .query({})
      .pipe(map(({ data }) => reduceToMap((t) => t.id!.value, data))),
    [refreshed]
  );
  const populatedSteps = useQuery<{[stepId: string]: Ticket[]}>(
    () => getStepGroupedTickets({ tickets, ticketStepRepository }),
    [refreshed]
  );

  if (allSteps === undefined || populatedSteps === undefined) {
    return <Board selectedTicket={undefined} onCardClick={() => {}} cardLists={[]}></Board>;
  }

  const data = Object.keys(populatedSteps).map(stepId => {
    const step = allSteps[stepId];
    return {
      title: allTemplates[step.templateId!.value].name + " - " + step.name,
      items: populatedSteps[stepId]
    }
  })

  return <Board selectedTicket={selectedTicket} onCardClick={(card) => selectTicket(card)} cardLists={data}></Board>;
}