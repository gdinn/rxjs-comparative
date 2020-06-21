import { Component, OnDestroy } from '@angular/core';
import { BooksPromiseService } from 'src/services/books.promise.service';
import { BooksRxjsService } from 'src/services/books.rxjs.service';
import { Observable, concat, merge, of } from 'rxjs';
import { shareReplay, map, catchError, tap } from 'rxjs/operators';
import { UtilsService } from 'src/services/utils.service';

import { SubSink } from 'subsink';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  private subs$ = new SubSink();
  rxjsActivated = false;
  promisesActivated = false;

  available: Array<any>;
  unavailable: Array<any>;
  libraries: Array<any>;

  available$: Observable<any>;
  unavailable$: Observable<any>;
  libraries$: Observable<any>;

  constructor(
    private bookPromiseService: BooksPromiseService,
    private bookRxjsService: BooksRxjsService,
    private utilsService: UtilsService
  ) {}

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  async refreshPromises() {
    this.promisesActivated = true;
    this.rxjsActivated = false;
    try {      
      await this.utilsService.presentLoading("refreshPromise").toPromise()
      await this.getPromiseData()
      await this.utilsService.dismissLoading("refreshPromise").toPromise()
    } catch (err) {      
      await this.utilsService.dismissLoading("refreshPromise").toPromise()
      await this.utilsService.presentAlert("refreshPromise", {
        message: err,
        buttons: ['Ok'],
      }).toPromise()
    }    
  }


  private getPromiseData() {
    let promiseLibraries = () => {
      return this.bookPromiseService.getLibraries().then((res) => (this.libraries = res.data));
    }

    let promiseBooks = () => {
      return this.bookPromiseService.getBooks().then((res) => {
        this.available = res.data.filter((book: any) => book.status == 'Available');
        this.unavailable = res.data.filter((book: any) => book.status == 'Unavailable');
      });
    }
    
    return Promise.all([ //call simultaneously
      promiseBooks(), 
      promiseLibraries()
    ])

  }

  refreshRxjs() {
    this.promisesActivated = false;
    this.rxjsActivated = true;    
    this.subs$.add(
      concat( //call in order, one at time
        this.utilsService.presentLoading("refreshRxjs"),
        this.getObsData(),
        this.utilsService.dismissLoading("refreshRxjs")            
      )
      .pipe(
        catchError((err) => {
          return concat( //concat prevent messing the UI
            this.utilsService.dismissLoading("refreshRxjs"),
            this.utilsService.presentAlert("refreshRxjs", {
              message: err,
              buttons: ['Ok'],
            })
          )                
        })
      )
      .subscribe()        
    );
    //Could use finalize, but obs need to finalize.
  }

  private getObsData(): Observable<any>{    
    let obsLibraries = () => { //define obs
      this.libraries$ = this.bookRxjsService.getLibraries()
      return this.libraries$      
    }

    let obsBooks = () => { //define obs and organize data
      return this.bookRxjsService.getBooks().pipe(
        shareReplay(),
        map((books: any[]) => {
          this.available$ = of(books.filter((book) => book.status == 'Available'));
          this.unavailable$ = of(books.filter((book) => book.status == 'Unavailable'));
        })
      );
    }

    return merge( //call simultaneously
      obsBooks(), 
      obsLibraries()
    )
  }
}
