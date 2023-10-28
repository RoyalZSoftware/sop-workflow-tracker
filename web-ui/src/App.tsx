import { useState } from "react";
import "./App.css";
import {
  Step,
  StepId,
  TemplateId,
  TicketBuilder,
  TicketPopulator,
} from "@sop-workflow-tracker/core";
import {
  DummyStepRepository,
  DummyTemplateRepository,
  DummyTicketRepository,
  DummyTicketStepRepository,
} from './dummy';
import { AppContext } from "./AppContext";
import { DashboardPage } from "./pages/dashboard";
import { PluginManager } from "@sop-workflow-tracker/react-plugin-engine";
import '@fontsource/dm-mono/300.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

function App({ pluginManager }: { pluginManager: PluginManager }) {

  const [stepRepository] = useState(new DummyStepRepository([
    new Step("Box drucken"),
    new Step("Schraubenmounts einsetzen"),
    new Step("1. Schablonenwand drucken"),
    new Step("2. Schablonenwand drucken"),
    new Step("3. Schablonenwand drucken"),
    new Step("PCBs einkleben"),
    new Step("Raspberry einkleben"),
    new Step("Installation vom Raspberry"),
    new Step("Test vom Raspberry"),
    new Step("Recherchieren"),
    new Step("Outline & Key Points"),
    new Step("Title & Seo Meta"),
    new Step("Images"),
    new Step("Publish"),
  ], "steps"));
  const [templateRepository] = useState(new DummyTemplateRepository([
    {
      name: "Controlbox fertigung",
      stepIds: [
        new StepId('0'),
        new StepId('1'),
        new StepId('2'),
        new StepId('3'),
        new StepId('4'),
        new StepId('5'),
        new StepId('6'),
        new StepId('7'),
        new StepId('8'),
      ],
      id: new TemplateId('0'),
    }, {
      name: "Blog Beitrag",
      stepIds: [
        new StepId('9'),
        new StepId('10'),
        new StepId('11'),
        new StepId('12'),
        new StepId('13'),
        new StepId('14'),
      ],
    }
  ], "templates"));
  const [ticketRepository] = useState(
    new DummyTicketRepository([], "tickets")
  );
  const [ticketStepRepository] = useState(
    new DummyTicketStepRepository([], "ticket_steps")
  );
  const [ticketPopulator] = useState(
    new TicketPopulator(ticketRepository, ticketStepRepository)
  );

  const [ticketBuilder] = useState(new TicketBuilder(stepRepository, ticketRepository, ticketStepRepository));
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#d8b573',
      },
      secondary: {
        main: '#202932',
      },
      error: {
        main: '#c63a41',
      },
    },
    typography: {
      fontFamily: '"DM Mono"'
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: "100vh" }}>
        <AppContext.Provider
          value={{
            ticketRepository,
            ticketStepRepository,
            stepRepository,
            ticketPopulator,
            templateRepository,
            ticketBuilder,
            pluginManager
          }}
        >
          <DashboardPage></DashboardPage>
        </AppContext.Provider>
      </div>

    </ThemeProvider>
  );
}

export default App;
