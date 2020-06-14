import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { BOOKS_RESPONSE } from 'src/mocks/books.mock';
import { ERROR_MESSAGES } from 'src/languages/messages';
import { LIBRARIES_RESPONSE } from 'src/mocks/libraries.mock';


@Injectable({
  providedIn: 'root'
})
export class BooksPromiseService {

  // Will return a list of books with cattegory and status
  getBooks(): Promise<any> {
    console.log("Called getBooks (promise)") 
    return of(BOOKS_RESPONSE).pipe(
      delay(3000) 
    )
    .toPromise()
  }

  // Will return a list of libraries with name and address
  getLibraries(): Promise<any> {
    console.log("Called getLibraries (promise)") 
    return of(LIBRARIES_RESPONSE).pipe(
      delay(2000) 
    )
    .toPromise()
  }

}