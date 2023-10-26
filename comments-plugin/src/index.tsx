import React, { useEffect, useState } from 'react';
import { Observable, of } from 'rxjs';
import { Plugin, TicketDetailsPluginView } from '@sop-workflow-tracker/react-plugin-engine';
import { PopulatedTicket, TicketId } from '@sop-workflow-tracker/core';

export class CommentListTicketDetailsView extends TicketDetailsPluginView {
    constructor(private _commentsRepository: CommentsRepository) {
        super();
    }

    render({ ticket }: { ticket: PopulatedTicket }): React.JSX.Element {
        const Component = () => {
            const [comments, setComments] = React.useState<Comment[]>([]);
            const [refreshed, setRefreshed] = useState(new Date());
            const [commentContent, setCommentContent] = useState('');

            const createComment = () => {
                this._commentsRepository.save(new Comment(ticket.id!, commentContent)).subscribe(() => {
                    setRefreshed(new Date());
                });
            }

            useEffect(() => {
                if (ticket == undefined) return;
                this._commentsRepository.getAllFor(ticket?.id!).subscribe((fetched) => {
                    setComments(fetched)
                    console.log(fetched);
                })
            }, [refreshed]);
            return <>
                <h6>Comments for: {ticket?.name}</h6>
                <input type="text" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Create new comment" />
                <button onClick={() => createComment()}>Erstellen</button>
                <ul>
                    {comments.map(c => (<li>{c.content}</li>))}
                </ul>
            </>;
        }
        return <Component />
    }
}

export class CommentId {
    constructor(public value: string) { }
}

export class Comment {
    public id?: CommentId;
    constructor(public ticketId: TicketId, public content: string) { }
}

export interface CommentsRepository {
    getAllFor(ticketId: TicketId): Observable<Comment[]>;
    save(comment: Comment): Observable<Comment>;
}

class LocalStorageCommentsRepository implements CommentsRepository {
    getAllFor(ticketId: TicketId): Observable<Comment[]> {
        return of(JSON.parse(localStorage.getItem("comments") ?? "[]").filter((c: any) => c.ticketId.value === ticketId.value));
    }
    save(comment: Comment): Observable<Comment> {
        const currentComments = JSON.parse(localStorage.getItem("comments") ?? "[]");
        currentComments.push(comment);
        localStorage.setItem('comments', JSON.stringify(currentComments));

        return of(currentComments);
    }
}

export class CommentsPlugin extends Plugin {
    constructor() {
        super('comments');
        this.registerView(new CommentListTicketDetailsView(new LocalStorageCommentsRepository()));
    }
}