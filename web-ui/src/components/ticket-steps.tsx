import { List, ListItem, Checkbox, ListItemText, Typography } from "@mui/material";
import { Ticket, TicketPopulator, PopulatedTicket, TicketStepRepository, DummyTicketStepRepository } from "core";
import { useState, useEffect } from "react";

export function TicketSteps({
  ticket,
  ticketPopulator,
  ticketStepRepository
}: {
  ticket: Ticket;
  ticketPopulator: TicketPopulator;
  ticketStepRepository: TicketStepRepository,
}) {
  const [checkedSteps, setCheckedSteps] = useState({} as any);
  const [populatedTicket, setPopulatedTicket] = useState(
    undefined as PopulatedTicket | undefined
  );

  useEffect(() => {
    const subscription = ticketPopulator
      .populate(ticket)
      .subscribe((fetchedPopulatedTicket) => {
        setPopulatedTicket(fetchedPopulatedTicket);
      });
    return () => subscription.unsubscribe();
  }, [ticket, checkedSteps]);

  return (
    <List>
      {populatedTicket?.ticketSteps?.map((c) => (
        <ListItem secondaryAction={<Checkbox defaultChecked={c.checked} onChange={(e) => {
          const checked = e.target.checked;
          ticketStepRepository.update(c.id!, {checked: checked as any as boolean}).subscribe(() => {
            setCheckedSteps((prev: any) => ({...prev, [c.id!.value]: checked}));
          }).unsubscribe();
        }} value={checkedSteps[c.id!.value]}></Checkbox>}>
          <ListItemText primary={c.title} secondary={c.description} />
        </ListItem>
      ))}

      {(populatedTicket?.ticketSteps?.length ?? 0) > 0 ? (
        <></>
      ) : (
        <Typography variant="body1">Keine Schritte gefunden</Typography>
      )}
    </List>
  );
}