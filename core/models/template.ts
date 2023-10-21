import { StepId } from "./step";

export class TemplateId {
    constructor(public value: string) {}
}

export interface Template {
    id?: TemplateId;
    stepIds: StepId[];
    name: string;
    description?: string;
}