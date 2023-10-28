import { PopulatedTicket, Ticket, TicketFilter, TicketId, TicketRepository } from "@sop-workflow-tracker/core";
import { Plugin, TicketDetailsPluginView } from "@sop-workflow-tracker/react-plugin-engine";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Observable, switchMap, from, map, tap, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";

export class HashnodeGQLClient {
  
  public pageInfoGQLQuery = `pageInfo {
    hasNextPage
    endCursor
  }`;
  
  constructor(private _accessToken?: string) { }

  query(query: string): Observable<any> {
    return fromFetch(
      "https://gql.hashnode.com/", {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0",
        "Accept": "*/*",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "content-type": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Authorization": this._accessToken ? this._accessToken : '',
    },
      "referrer": "https://gql.hashnode.com/",
      "body": JSON.stringify({ query }),
      "method": "POST",
      "mode": "cors"
    }).pipe(switchMap((res) => from(res.json())));
  }

  queryPages(queryFactory: (afterFilter: string) => string, pageInfoPathFactory: (result: any) => {hasNextPage: boolean, endCursor: string}, after: string | undefined = undefined, previousData: any[] = []): Observable<any> {
    const queryStr = 'first:20' + (after !== undefined ? `,after:"${after}"` : '');
    return this.query(queryFactory(queryStr)).pipe(
      switchMap((result) => {
        console.log(result);
        const pageInfo = pageInfoPathFactory(result);

        previousData.push(result);
        if (pageInfo.hasNextPage) {
          return this.queryPages(queryFactory, pageInfoPathFactory, pageInfo.endCursor, previousData);
        }
        return of(previousData);
      })
    )
  }
}

class HashnodeContentView extends TicketDetailsPluginView {

  constructor(private _hashnodeGQLClient: HashnodeGQLClient = new HashnodeGQLClient()) {
    super();
  }

  override render({ticket}: { ticket: PopulatedTicket }): React.JSX.Element {
    
    const queryForContent = `{
      draft(id:"${ticket.id!.value}") {
        id
        content{markdown}
      }
    }`

    const Component = () => {

    const [content, setContent] = useState<string>('');

    useEffect(() => {
      this._hashnodeGQLClient.query(queryForContent).subscribe(({data}) => {
        setContent(data.draft.content.markdown);
      });
    }, []);

    return <Markdown>{content}</Markdown>;
    }

    return <Component/>
  }

  private _fetchContentFor(ticketId: TicketId) {
    return this._hashnodeGQLClient.query(` `)
  }
}

export class HashnodePlugin extends Plugin {
  constructor() {
    super('hashnode');
    this.registerView(new HashnodeContentView());
  }
}
export class HashnodeTicketRepo implements TicketRepository {

  constructor(private _hashnodeGQLClient: HashnodeGQLClient = new HashnodeGQLClient()) {
  }

  getAll(ticketFilter?: TicketFilter | undefined): Observable<Ticket[]> {
    const query = (paginationInfo: string) => `{
      publication(host:"royalzsoftware.de") {
        drafts(${paginationInfo}) {
          edges {
            node {
              id
              title
            }
          }
          ${this._hashnodeGQLClient.pageInfoGQLQuery}
        }
      }
    }`;

    return this._hashnodeGQLClient.queryPages(query, ({data}: any) => data.publication.drafts.pageInfo).pipe(
      map((responses: any) => {
        return responses.reduce((prev: any, response: any) => {
          response.data.publication.drafts.edges.forEach(({ node: post }: any) => {
            console.log(post);
            prev.push(post)
          })

          return prev;
        }, [] as any);
      }),
      map((posts) => {
        return posts.map((post: any) => {
          const ticket = new Ticket(post.title);

          ticket.id = new TicketId(post.id);
          return ticket;
        })
      }),
    )
  }
  get(ticketId: TicketId): Observable<Ticket | undefined> {
    return of();
  }
  nextId(): TicketId {
    throw new Error("Method not implemented.");
  }
  update(ticketId: TicketId, payload: Partial<Ticket>): Observable<Ticket> {
    throw new Error("Method not implemented.");
  }
  save(ticket: Ticket): Observable<Ticket> {
    throw new Error("Method not implemented.");
  }
}
