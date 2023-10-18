export class StepId {
    constructor(public value: string) {}
}

export class Step {
    templateId?: TemplateId;
    id?: StepId;
    constructor(public name: string, public description?: string) { }
}

export class TemplateId {
    constructor(public value: string) {}
}

export interface Template {
    id?: TemplateId;
    stepIds: StepId[];
    name: string;
    description?: string;
}