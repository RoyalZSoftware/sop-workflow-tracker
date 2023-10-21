import { TemplateId } from "./template";

export class StepId {
    constructor(public value: string) {}
}

export class Step {
    templateId?: TemplateId;
    id?: StepId;
    constructor(public name: string, public description?: string) { }
}
