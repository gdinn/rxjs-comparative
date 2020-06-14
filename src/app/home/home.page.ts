import { Component } from '@angular/core';
import { BooksPromiseService } from 'src/services/books.promise.service';
import { BooksRxjsService } from 'src/services/books.rxjs.service';
import { Observable, concat, merge } from 'rxjs';
import { shareReplay, map, catchError, finalize } from 'rxjs/operators';
import { UtilsService } from 'src/services/utils.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  rxjsActivated = false
  promisesActivated = false
  constructor(
    private bookPromiseService: BooksPromiseService,
    private bookRxjsService: BooksRxjsService,
    private utilsService: UtilsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  available: Array<any>
  unavailable: Array<any>
  libraries: Array<any>
  async refreshPromises() {
    this.promisesActivated = true
    this.rxjsActivated = false
    let loading = await  this.loadingCtrl.create({message: "Please wait..."})
    await loading.present()
    try {
      let books = (await this.bookPromiseService.getBooks()).data
      this.available = books.filter(book => book.status == "Available")
      this.unavailable = books.filter(book => book.status == "Unavailable")
      this.libraries = (await this.bookPromiseService.getLibraries()).data      
    } catch(e) {
      let alert = await this.alertCtrl.create({
        message: e,
        buttons: ["Ok"]
      })
      alert.present()
    } 
    loading.dismiss()
  }

  available$: Observable<any>
  unavailable$: Observable<any>
  libraries$: Observable<any>
  refreshRxjs() {
    this.promisesActivated = false
    this.rxjsActivated = true

    let booksList = this.bookRxjsService.getBooks()
    .pipe(      
      shareReplay() 
    )
    this.available$ = booksList.pipe(
      map((books: Array<any>) => books.filter(book => book.status == "Available"))
    )
    this.unavailable$ = booksList.pipe(
      map((books: Array<any>) => books.filter(book => book.status == "Unavailable"))
    )

    let librariesList = this.bookRxjsService.getLibraries()
    this.libraries$ = librariesList
    
    concat(
      this.utilsService.presentLoading("refresh"),
      merge(
        this.available$, 
        this.unavailable$, 
        this.libraries$
      ).pipe(
        catchError((error) => {          
          return this.utilsService.presentAlert("refresh", {
            message: error,             
            buttons: ["Ok"]            
          })
        }),
        finalize(() => {
          this.utilsService.dismissLoading("refresh").subscribe()
        })
      )
    )
    .subscribe()
  }
}
