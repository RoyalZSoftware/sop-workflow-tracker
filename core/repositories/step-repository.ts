import { Observable } from "rxjs";
import { Step, StepId } from "../models/template";

export interface StepRepository {
    get(stepId: StepId): Observable<Step | undefined>;
    getMulti(stepIds: StepId[]): Observable<Step[]>;
    save(step: Step): Observable<Step>;
}