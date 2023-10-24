import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import { Template, TemplateRepository, Ticket, TicketBuilder, TicketRepository } from "core";
import { useEffect, useState } from "react";

export default function CreateTicketDialog({
  isOpen,
  close,
  templateRepository,
  ticketBuilder,
}: {
  isOpen: boolean;
  close: (item?: Ticket) => void;
  ticketRepository: TicketRepository,
  templateRepository: TemplateRepository,
  ticketBuilder: TicketBuilder,
}) {
  const [templates, setTemplates] = useState([] as Template[]);
  const [ticketName, setTicketName] = useState('');
  const [selectedTemplate, selectTemplate] = useState(undefined as any as Template);
  useEffect(() => {
  }, [templateRepository]);

  const createTicketAndClose = () => {
    if (selectedTemplate === undefined) return;

    ticketBuilder.createTicketFromTemplate({...selectedTemplate, name: ticketName}).subscribe((ticket: any) => {
      close(ticket);
    });
  }

  useEffect(() => {
    setTicketName(selectedTemplate?.name ?? '');
  }, [selectedTemplate]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Create new ticket</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Template</InputLabel>
          <Select onChange={(c) => selectTemplate(c.target.value as any)} value={selectedTemplate}>
            {templates.map(c => {
              return (<MenuItem value={c as any}>{c.name}</MenuItem>)}
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Ticketname</InputLabel>
          <TextField variant="outlined"onChange={c => setTicketName(c.target.value)} value={ticketName}></TextField>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()}>Cancel</Button>
        <Button onClick={() => createTicketAndClose()} color="primary">
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
}
