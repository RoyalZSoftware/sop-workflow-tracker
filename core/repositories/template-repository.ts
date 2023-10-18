import { Template, TemplateId } from "../models/template";
import { Observable } from 'rxjs';

export interface TemplateRepository {
    get(id: TemplateId): Observable<Template>;
}