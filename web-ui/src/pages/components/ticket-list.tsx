import { List, ListItemButton, ListItemText } from "@mui/material";
import { Ticket } from "@sop-workflow-tracker/core";

export function TicketsList({
  selectTicket,
  selectedTicket,
  tickets,
}: {
  selectTicket: (ticket: Ticket) => void;
  tickets: Ticket[];
  selectedTicket: Ticket | undefined;
}) {
  const onClick = (ticket: Ticket) => {
    selectTicket(ticket);
  };

  return (
    <List sx={{ width: "100%", maxHeight: '100%', overflowY: 'auto' }}>
      {tickets.map((ticket) => (
        <ListItemButton
          selected={selectedTicket === ticket}
          onClick={() => onClick(ticket)}
          style={{ width: "100%" }}
        >
          <ListItemText primary={"# " + ticket.id!.value + " - " + ticket.name} />
        </ListItemButton>
      ))}
    </List>
  );
}