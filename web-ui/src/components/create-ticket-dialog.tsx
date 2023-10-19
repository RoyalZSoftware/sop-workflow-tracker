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
} from "@mui/material";
import { Template, TemplateRepository, Ticket, TicketRepository } from "core";
import { useEffect, useState } from "react";

export default function CreateTicketDialog({
  isOpen,
  close,
  ticketRepository,
  templateRepository,
}: {
  isOpen: boolean;
  close: (item?: Ticket) => void;
  ticketRepository: TicketRepository,
  templateRepository: TemplateRepository,
}) {
  const [templates, setTemplates] = useState([] as Template[]);
  useEffect(() => {
    const subscription = templateRepository.getAll().subscribe((fetchedTemplates) => {
      setTemplates(fetchedTemplates);
    })
    return () => subscription.unsubscribe();
  }, [templateRepository]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Create new ticket</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Template</InputLabel>
          <Select>
            {
              templates.map(c => <MenuItem title={c.name}/>)
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()}>Cancel</Button>
        <Button onClick={() => close()} color="primary">
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
}
