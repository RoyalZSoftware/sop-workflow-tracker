import { TemplateId } from "./template";

export class StepId {
    constructor(public value: string) {}
}

export class Step {
    id?: StepId;
    constructor(public name: string, public description?: string, public templateId?: TemplateId) { }
}
