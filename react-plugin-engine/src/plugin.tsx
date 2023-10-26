import React from "react";
import { Ticket, TicketRepository } from 'core';
import { PluginView, ViewType } from "./plugin-view";

export abstract class Plugin {

    public readonly registeredViews: PluginView<any>[] = [];

    constructor(public readonly id: string) { }

    registerView(viewType: ViewType, render: <Dependencies>(dependencies: Dependencies) => React.JSX.Element) {
        this.registeredViews.push({
            viewType,
            render,
        });
    }
}

export class EvernotePlugin extends Plugin {
    constructor() {
        super('evernote');

        this.registerView(ViewType.TICKET_DETAILS, (({ ticketRepository }: { ticketRepository: TicketRepository }) => {
            const Component = () => {
                const [tickets, setTickets] = React.useState<Ticket[]>([]);

                console.log("Rendering evernote");
                React.useEffect(() => {
                    return () => ticketRepository.getAll().subscribe((fetched) => setTickets(fetched)).unsubscribe();
                }, []);

                return <ul>
                    {tickets.map((c) => (<li>{c.name}</li>))}
                </ul>
            }

            return <Component />
        }) as any)
    }
}
