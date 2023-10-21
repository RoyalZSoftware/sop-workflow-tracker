import { Observable } from "rxjs";
import { StepId, Step } from "../models/step";
import { PaginatedResponse, PaginationFilter } from "./paginated-resource";

export interface StepRepositoryFilter extends PaginationFilter {
    
}

export interface StepRepository {
    get(stepId: StepId): Observable<Step | undefined>;
    query(filter: StepRepositoryFilter): Observable<PaginatedResponse<Step>>;
    getMulti(stepIds: StepId[]): Observable<Step[]>;
    save(step: Step): Observable<Step>;
    update(stepId: StepId, payload: Partial<Step>): Observable<Step>;
}