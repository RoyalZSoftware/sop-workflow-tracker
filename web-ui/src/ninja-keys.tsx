import { Template, TemplateRepository, TicketBuilder, TicketRepository } from '@sop-workflow-tracker/core';
import 'ninja-keys';
import { NinjaKeys } from 'ninja-keys';
import React, { useEffect, useRef } from 'react';
import { useQuery } from './data-provider/use-query';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ninja-keys': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
export function NinjaKeysProvider({ setRefreshedAt, ticketBuilder, templateRepository }: { setRefreshedAt: (date: Date) => void, ticketBuilder: TicketBuilder, templateRepository: TemplateRepository }) {
  const ninjakeysRef = useRef<NinjaKeys>(null);
  const templates = useQuery<Template[]>(() => templateRepository.getAll());

  useEffect(() => {
    if (ninjakeysRef.current && templates) {
      ninjakeysRef.current.data = [
          {
            id: "Create Ticket",
            title: "Create ticket",
            hotkey: "cmd+h",
            mdIcon: "",
            children: [],
            handler: () => {
              ninjakeysRef.current!.open({parent: 'Create Ticket'});
              return {keepOpen: true};
            }
          },
          ...templates.map(c => ({
            id: c.name,
            title: c.name,
            parent: 'Create Ticket',
            handler: () => {
              const ticketName = prompt("Ticket name?", c.name);
              if (ticketName === null) return;
              ticketBuilder.createTicketFromTemplate({...c, name: ticketName}).subscribe(() => {
                setRefreshedAt(new Date());
              });
            }
          })),
      ];
    }
  }, [templates]);

  return (<><ninja-keys className="dark" ref={ninjakeysRef}>
    <p>Hallo</p>
    </ninja-keys></>);
}