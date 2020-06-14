import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { BOOKS_RESPONSE } from 'src/mocks/books.mock';
import { ERROR_MESSAGES } from 'src/languages/messages';
import { LIBRARIES_RESPONSE } from 'src/mocks/libraries.mock';

@Injectable({
  providedIn: 'root'
})
export class BooksRxjsService {

  // Will return a list of books with cattegory and status
  getBooks(): Observable<any> { 
    console.log("Called getBooks (rxjs)")
    return of(BOOKS_RESPONSE).pipe(
      delay(3000),
      map(res => res.data),
      catchError((errors)=> {
        return throwError(errors.error.msg || ERROR_MESSAGES.http["en"].default)
      })
    )
  }

  // Will return a list of libraries with name and address
  getLibraries(): Observable<any> {
    console.log("Called getLibraries (rxjs)")
    return of(LIBRARIES_RESPONSE).pipe(
      delay(2000),      
      map(res => res.data),
      catchError((errors)=> {
        return throwError(errors.error.msg || ERROR_MESSAGES.http["en"].default)
      })
    )
  }
  
}