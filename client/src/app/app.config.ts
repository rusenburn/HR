import { environment } from "src/environments/environment";

export class AppConfig{
    public readonly apiEndpoint: string;
    constructor() {
        this.apiEndpoint = environment.apiEndpoint
    }
}