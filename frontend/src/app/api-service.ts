import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {error} from "protractor";

enum Endpoints {
    Fan = "/airpurifier/fan",
    EnvironmentalHistory = "/airpurifier/environmental/history",
    EnvironmentalNow = "/airpurifier/environmental",
}
export type EnvironmentalData = [number, number, number, string]; // project id, temperature, humidity, timestamp

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl:string = 'https://gioelese.ignorelist.com/api';

    constructor(private http: HttpClient) { }

    getFanSpeed(): Observable<number> {
        return this.http.get<{ speed: number }>(this.apiUrl+Endpoints.Fan, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' })
        })
            .pipe(map(res => {
                    console.debug("res: ");
                    console.debug(res);
                    return res.speed
                }),
            );
    }

    setFanSpeed(speed:number):Observable<number>{
        return this.http.post<{speed:number}>(this.apiUrl+Endpoints.Fan, {speed}, {
            headers: {
                'Content-Type':'application/json',
            }
        }).pipe(
            map(res =>{
                if (res.speed === speed){
                    return speed
                }else{
                    throw new Error('Server did not set the speed correctly');
                }
            }),
            catchError(this.handleError)
        );
    }

    getEnvironmentalHistory(): Observable<EnvironmentalData[]> {
        return this.http.get<{ environmental_history: EnvironmentalData[] }>(this.apiUrl+Endpoints.EnvironmentalHistory, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' })
        })
            .pipe(map(res => {
                    console.debug("res: ");
                    console.debug(res);
                    return res.environmental_history;
                }),
                catchError(this.handleError)
            );
    }

    getEnvironmentalNow(): Observable<EnvironmentalData> {
        return this.http.get<{ environmental_now: EnvironmentalData }>(this.apiUrl+Endpoints.EnvironmentalNow, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' })
        })
            .pipe(map(res => {
                    console.debug("res: ");
                    console.debug(res);
                    return res.environmental_now;
                }),
            );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        console.debug('Raw error object');
        console.debug(error);

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

            // Safe header check using optional chaining
            if (error.headers?.get('content-type')?.includes('text/html')) {
                errorMessage += '\nServer returned HTML error page';
            }
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}