import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }

    public getJWTToken(): string | null {
        return localStorage.getItem("jwt");
    }

    public SetJWTToken(token:string):void{
        localStorage.setItem("jwt",token)
    }
}