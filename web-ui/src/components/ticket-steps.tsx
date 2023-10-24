import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Ticket,
  TicketPopulator,
  PopulatedTicket,
  TicketStepRepository,
  TicketStep,
  TicketStepId,
} from "core";
import { useState, useEffect, useCallback } from "react";
import { Observable, tap } from "rxjs";

function TicketStepStateObserver({
  ticketSteps,
  updateDatastore,
}: {
  ticketSteps: TicketStep[];
  updateDatastore: (
    ticketStepId: TicketStepId,
    checked: boolean
  ) => Observable<any>;
}) {
  const [checkedState, setCheckedState] = useState(
    ticketSteps.reduce((prev, curr) => {
      prev[curr.id!.value] = curr.checked;
      return prev;
    }, {} as any)
  );

  useEffect(() => {
    setCheckedState(
      ticketSteps.reduce((prev, curr) => {
        prev[curr.id!.value] = curr.checked;
        return prev;
      }, {} as any)
    );
  }, [ticketSteps]);

  return (
    <>
      {ticketSteps.map((c) => (
        <ListItem
          secondaryAction={
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                setCheckedState((prev: any) => ({
                  ...prev,
                  [c.id!.value]: checked,
                }));
                updateDatastore(c.id!, checked).subscribe().unsubscribe();
              }}
              checked={checkedState[c.id!.value]}
            ></Checkbox>
          }
        >
          <ListItemText primary={c.title} secondary={c.description} />
        </ListItem>
      ))}
    </>
  );
}

export function TicketSteps({
  ticket,
  ticketPopulator,
  ticketStepRepository,
}: {
  ticket: Ticket;
  ticketPopulator: TicketPopulator;
  ticketStepRepository: TicketStepRepository;
}) {
  const [populatedTicket, setPopulatedTicket] = useState(
    undefined as PopulatedTicket | undefined
  );

  const update = (ticketStepId: TicketStepId, checked: boolean) => {
    return ticketStepRepository.update(ticketStepId, { checked });
  };

  const fetch = useCallback(
    (x: Ticket) => {
      const subscription = ticketPopulator
        .populate(x)
        .subscribe((fetchedPopulatedTicket: PopulatedTicket) => {
          setPopulatedTicket(fetchedPopulatedTicket);
        });

      return () => subscription.unsubscribe();
    },
    [ticketPopulator]
  );

  useEffect(() => {
    fetch(ticket);
  }, [fetch, ticket]);

  return (
    <List>
      {(populatedTicket?.ticketSteps?.length ?? 0) > 0 ? (
        <TicketStepStateObserver
          updateDatastore={update}
          ticketSteps={populatedTicket!.ticketSteps}
        ></TicketStepStateObserver>
      ) : (
        <Typography variant="body1">Keine Schritte gefunden</Typography>
      )}
    </List>
  );
}
