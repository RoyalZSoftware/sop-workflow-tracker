import { Typography } from "@mui/material";
import { Ticket, TicketRepository } from "core";
import { useEffect, useState } from "react";
import { Plugin, ViewType } from "react-plugin-engine";

const comments: {[key: string]: string[]} = {
    '0': ['Hallo', 'Welt', 'Das ist ein Kommentar'],
    '3': ['Hallo', 'Welt', 'Das ist ein Kommentar'],
};

function RenderComments({ ticketRepository }: { ticketRepository: TicketRepository }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        return () => ticketRepository.getAll().subscribe((fetched) => setTickets(fetched)).unsubscribe();
    }, []);

    return <>
    <Typography variant="h4">Comments</Typography>
    <ul>
        {tickets.map((c) => (<li>
            {c.name}
            <ul>
            {(comments[c.id!.value]?? []).map(comment => (
                <li>comment</li>
            ))}
</ul>
            </li>))}
    </ul>
    </>
}

export class CommentsPlugin extends Plugin {
    constructor() {
        super('comments');
        this.registerView(ViewType.TICKET_DETAILS, (dependencies: any) => {
            return <RenderComments ticketRepository={dependencies.ticketRepository}/>
        });
    }
}