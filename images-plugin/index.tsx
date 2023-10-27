import { Button, Typography } from "@mui/material";
import { PopulatedTicket } from "@sop-workflow-tracker/core";
import { Plugin, TicketDetailsPluginView } from "@sop-workflow-tracker/react-plugin-engine";

export class ImageTicketDetailsView extends TicketDetailsPluginView {
    render(dependencies: {ticket: PopulatedTicket}) {
        return <>
        <Typography variant="body2">This is the images plugin</Typography>
        <Button title="Hte">test</Button>
        </>
    }
}

export class ImagesPlugin extends Plugin {
    constructor() {
        super('images');
        this.registerView(new ImageTicketDetailsView());
    }
}