import { PopulatedTicket } from "core";
import { Plugin, TicketDetailsPluginView } from "react-plugin-engine";

const comments: { [key: string]: string[] } = {
    '0': ['Hallo', 'Welt', 'Das ist ein Kommentar'],
    '3': ['Das sind die Kommentare', 'von Ticket nummer 3'],
};

class CommentsList extends TicketDetailsPluginView {
    render({ ticket }: { ticket: PopulatedTicket }) {
        return <ul>
            {(comments[ticket?.id!.value] ?? []).map(comment => (
                <li>{comment}</li>
            ))}
        </ul>
    }
}

export class CommentsPlugin extends Plugin {
    constructor() {
        super('comments');
        this.registerView(new CommentsList());
    }
}