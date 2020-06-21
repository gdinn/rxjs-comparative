import { Component, OnDestroy } from '@angular/core';
import { BooksPromiseService } from 'src/services/books.promise.service';
import { BooksRxjsService } from 'src/services/books.rxjs.service';
import { Observable, concat, merge, of } from 'rxjs';
import { shareReplay, map, catchError, tap } from 'rxjs/operators';
import { UtilsService } from 'src/services/utils.service';
import { LoadingController, AlertController } from '@ionic/angular';

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
    private utilsService: UtilsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  async refreshPromises() {
    this.promisesActivated = true;
    this.rxjsActivated = false;
    const loading = await this.loadingCtrl.create({ message: 'Please wait...' });
    await loading.present();
    try {
      // Agrupar promises a serem resolvidas
      await Promise.all([this.getPromiseBooks(), this.getPromiseLibraries()]);
    } catch (e) {
      // N precisa alocar variável
      await this.alertCtrl
        .create({
          message: e,
          buttons: ['Ok'],
        })
        .then((res) => res.present());
    }
    loading.dismiss();
  }

  private getPromiseBooks() {
    return this.bookPromiseService.getBooks().then((res) => {
      this.available = res.data.filter((book: any) => book.status == 'Available');
      this.unavailable = res.data.filter((book: any) => book.status == 'Unavailable');
    });
  }

  private getPromiseLibraries() {
    return this.bookPromiseService.getLibraries().then((res) => (this.libraries = res.data));
  }

  refreshRxjs() {
    this.promisesActivated = false;
    this.rxjsActivated = true;

    this.libraries$ = this.bookRxjsService.getLibraries();

    // exemplo 1
    // this.utilsService.presentL(), // fora do strem
    //   merge(this.getObsBooks(), this.libraries$)
    //     .pipe(
    //       catchError((err) => {
    //         this.utilsService.presetA({
    //           message: err,
    //           buttons: ['Ok'],
    //         });
    //         return null;
    //       }),
    //       finalize(() => {
    //         this.utilsService.dismissL();
    //       })
    //     )
    //     .subscribe();

    // exemplo 2
    this.utilsService.presentL(),
      this.subs$.add(
        merge(this.getObsBooks(), this.libraries$)
          .pipe(
            tap(() => this.utilsService.presentL()), // dentro do fluxo como sideeffect),
            catchError((err) => {
              this.utilsService.dismissL();
              this.utilsService.presetA({
                message: err,
                buttons: ['Ok'],
              });
              return null;
            })
            // Finalize só é chamado em alguns contexto conde o observable é completado.
            // Por example router.queryParams não tem ponto de parada, logo está função nunca será executada.
            // Caso queira usar o finalize em contextos de erro é importante usar sua chamada antes do catchError dentro do pipe.

            // finalize(() => {
            //   this.utilsService.dismissL();
            // })
          )
          .subscribe(null, null, () => {
            // chama o q seria chamado  no finalize no completo do subscrive.
            // Acontece que as vezes queremos que algo assim aconteça em um fluxo chamado diretamente pelo HTML com um | async
            // neste caso podemos usar:
            // 1. Finelize antes do catch error, se tivermos certeza de q ele será finalizado
            // 2. Tap após lógica do fluxo
            // 3. Chamar a operação dentro do fluxo de sucesso (podendo ser um map) e dentro do fluxo de erro.
            // Neste exemplo utilizado no complete, aqui mesmo, e no catchError.
            return this.utilsService.dismissL();
          })
      );
  }

  private getObsBooks() {
    return this.bookRxjsService.getBooks().pipe(
      shareReplay(),
      map((books: any[]) => {
        this.available$ = of(books.filter((book) => book.status == 'Available'));
        this.unavailable$ = of(books.filter((book) => book.status == 'Unavailable'));
      })
    );
  }

  private test() {
    const c = concat(of('1'), of('2'), of('3'));
    const m = merge(of('1'), of('2'), of('3'));
    c.subscribe(console.log);
    c.subscribe(console.log);
  }
}
