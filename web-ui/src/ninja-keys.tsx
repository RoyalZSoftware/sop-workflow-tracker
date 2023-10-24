import { Template, TemplateRepository, TicketBuilder, TicketRepository } from 'core';
import 'ninja-keys';
import { NinjaKeys } from 'ninja-keys';
import { take } from 'rxjs/operators';
import React, { useEffect, useRef, useState } from 'react';
import { Observable } from 'rxjs';
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
export function NinjaKeysProvider({ ticketRepository, ticketBuilder, templateRepository }: { ticketRepository: TicketRepository, ticketBuilder: TicketBuilder, templateRepository: TemplateRepository }) {
  const ninjakeysRef = useRef<NinjaKeys>(null);
  // const [templates, setTemplates] = useState([] as Template[]);
  const templates =useQuery<Template[]>(() => templateRepository.getAll());

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
              ticketBuilder.createTicketFromTemplate(c).subscribe(() => {
                alert("Created");
              });
            }
          }))
      ];
    }
  }, [templates]);

  return (<><ninja-keys ref={ninjakeysRef}></ninja-keys></>);
}