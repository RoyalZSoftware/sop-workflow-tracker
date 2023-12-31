import {
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import {
    Ticket,
} from "@sop-workflow-tracker/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { useQuery } from "../data-provider/use-query";
import { NinjaKeysProvider } from "../ninja-keys";
import { Board } from "../components/kanban-board/card-list";
import { TabPanel } from "../components/tab-panel";
import { DetailsWidget } from "./components/details-widget";
import { TicketBoardByStep } from "./components/ticket-board-by-step";
import { TicketsList } from "./components/ticket-list";
import { useFullScreen } from "../components/use-full-screen";


export function DashboardPage() {
    const {
        ticketRepository,
        stepRepository,
        ticketPopulator,
        ticketStepRepository,
        ticketBuilder,
        templateRepository,
        pluginManager,
    } = useContext(AppContext);
    const [selectedTicket, selectTicket] = useState(undefined as any as Ticket);
    const [refreshedAt, setRefreshed] = useState(new Date());
    const [tickets, setTickets] = useState([] as any[]);
    useEffect(() => {
        ticketRepository.getAll().subscribe((fetched) => {
            setTickets(fetched)
        })
    }, [])

    const { styleFor, DefaultToggleFullScreenButton, gridFor } = useFullScreen();

    const [selectedTab, setSelectedTab] = useState('0');

    const [plugins] = useState(pluginManager.plugins);

    return (
        <div style={{ height: '100%', padding: 32 }}>
            <Grid container spacing={2} style={{ height: "100%" }}>
                <Grid item xs={gridFor('board', 12)} style={{ height: '50%', ...styleFor('board') }}>
                    <Paper style={{ height: '100%', display: 'flex', flexShrink: 0, minHeight: '100%', flexDirection: 'column', padding: 8, position: 'relative' }}>
                        <DefaultToggleFullScreenButton widgetId="board" />
                        <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
                            <Tab label="By State" value="0"></Tab>
                            <Tab label="By Steps" value="1"></Tab>
                        </Tabs>
                        <TabPanel value={selectedTab} index={'0'}>
                            <Board selectedTicket={selectedTicket} onCardClick={(card) => selectTicket(card)} cardLists={[{ title: 'Open', id: 'open' }, { title: 'Closed', id: 'closed' }].map(c => ({
                                title: c.title,
                                items: tickets.filter(ticket => ticket.ticketState == c.id)
                            }))}></Board>
                        </TabPanel>
                        <TabPanel value={selectedTab} index={'1'}>
                            <TicketBoardByStep
                                templateRepository={templateRepository}
                                selectTicket={selectTicket}
                                selectedTicket={selectedTicket}
                                ticketStepRepository={ticketStepRepository}
                                tickets={tickets}
                                stepRepository={stepRepository}
                                refreshed={refreshedAt}
                            />
                        </TabPanel>
                    </Paper>
                </Grid>
                <Grid item xs={gridFor('ticket-list', 6)} style={{ height: '50%', ...styleFor('ticket-list') }}>
                    <Paper
                        elevation={1}
                        style={{ height: "100%", position: "relative", display: 'flex', flexDirection: 'column' }}
                    >
                        <DefaultToggleFullScreenButton widgetId="ticket-list" />
                        <Typography variant="h6" style={{ padding: 16 }}>Tickets</Typography>
                        <TicketsList selectTicket={selectTicket} selectedTicket={selectedTicket} tickets={tickets} />
                    </Paper>
                </Grid>
                <Grid item xs={gridFor('details-widget', 6)} style={{ height: '50%', ...styleFor('details-widget') }}>
                    <Paper elevation={1} style={{ padding: 8, maxHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <DefaultToggleFullScreenButton widgetId="details-widget" />
                        <DetailsWidget setRefreshed={setRefreshed} ticketStepRepository={ticketStepRepository} ticketPopulator={ticketPopulator} selectedTicket={selectedTicket} plugins={plugins} />
                    </Paper>
                </Grid>
            </Grid>
            <NinjaKeysProvider setRefreshedAt={setRefreshed} ticketBuilder={ticketBuilder} templateRepository={templateRepository}></NinjaKeysProvider>
        </div>
    );
}