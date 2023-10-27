import { Card, CardContent, Paper, Typography } from "@mui/material";
import { Ticket } from "@sop-workflow-tracker/core";

export function TicketCard({ ticket, onCardClick, isSelected }: { ticket: Ticket, onCardClick: (ticket: Ticket) => void, isSelected: boolean}) {
    return <Card elevation={isSelected ? 20 : 5} style={{ minHeight: 50, cursor: 'pointer' }} onClick={() => onCardClick(ticket)}>
        <CardContent>
            <Typography variant="body2">#{ticket.id!.value} - {ticket.name}</Typography>
        </CardContent>
    </Card>
}

export function CardList({ items, title, onCardClick, selectedTicket }: { items: Ticket[], title: string, onCardClick: (ticket: Ticket) => void, selectedTicket: Ticket | undefined }) {
    return <Paper elevation={4} style={{ minWidth: 400, width: 400, height: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', padding: 16}}>
        <Typography variant="h6" style={{ margin: 8 }}>{title}</Typography>
        <div style={{ padding: 8, gap: 8, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100%' }}>
            {items.map(c => (<TicketCard isSelected={selectedTicket?.id!.value === c.id!.value} onCardClick={onCardClick} ticket={c}></TicketCard>))}
        </div>
    </Paper>
}

export function Board({ cardLists, onCardClick, selectedTicket }: { onCardClick: (ticket: Ticket) => void, cardLists: { title: string, items: Ticket[] }[], selectedTicket: Ticket | undefined }) {
    return <div style={{ width: '100%', display: 'flex', height: '100%', gap: 16, overflowX: 'auto', paddingBottom: 4, padding: 8 }}>
        {
            cardLists.map(c => <CardList selectedTicket={selectedTicket} onCardClick={onCardClick} items={c.items} title={c.title}></CardList>)
        }
    </div>
}