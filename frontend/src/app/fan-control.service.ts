import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FanControlService {
  private apiUrl = 'https://gioelese.ignorelist.com/api/airpurifier/fan';

  constructor(private http: HttpClient) { }

  getSpeed(): Observable<number> {
    return this.http.get<{ speed: number }>(this.apiUrl)
        .pipe(map(res => {
            console.debug("res: ");
            console.debug(res);
              return res.speed
            }),
        );
  }
  // getSpeed(): Observable<number> {
  //   return this.http.get<{ speed: number }>(this.apiUrl)
  //       .pipe(map(res => res.speed));
  // }
  setSpeed(speed:number):Observable<number>{
    return this.http.post<{speed:number}>(this.apiUrl, {speed}, {
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