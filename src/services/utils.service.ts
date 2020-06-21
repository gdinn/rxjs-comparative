import { LoadingController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingOptions, AlertOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private loadingCtrl = new BehaviorSubject<boolean>(false);
  private alertCtrl = new BehaviorSubject<boolean>(false);
  private alert: HTMLIonAlertElement;
  private loading: HTMLIonLoadingElement;

  constructor(private lCtrl: LoadingController, private aCtrl: AlertController) {
    // Será chamando pelo primeiro components q usar sua injeção. Pode ser melhor utilizado no app.components para garantir disponibilidade
    // para o restante da aplicação
    this.init();
  }

  async init() {
    // Cria uma instacia basica dos elementos interativos
    this.alert = await this.aCtrl.create({});
    this.loading = await this.lCtrl.create({});
    // Aciona os subscribers destes controladores.
    this.handlerAlert();
    this.handlerLoading();
    // A ideia aqui foi utilizar apenas uma instancia de cada objeto e manipular sua exibição conforme necessário, evitando
    // novas variáveis e chamadas de criação de mais objetos.
  }

  detroyer() {
    // unsub handlers
    // seria a implementação de unsubscrive dos handlers.
    // É importante ressaltar que o uso de subcribes em serviços n é recomendado, pois eles são instanciados e
    // não possui life cycle para se autodestruir, neste caso foi criado este destroyer. No entanto ele não deve ser chamado
    // a menos que se queira que toda a aplicação n tenha mais acesso aos recursos iniciais.
    // Aqui entra um dilema, usar subscribes que nunca serão desativados. Neste caso, é possível sim usar, mas
    // com moderação e controle, uma vez, a quantidade de subscribers ativos poderá dar erro de memória, então:
    // com grandes poderes vem grandes responsabilidades.
  }

  // Aciona o subscriber para o objeto de alert
  private handlerAlert() {
    // add sub
    this.alertCtrl.subscribe(
      (show) => {
        show ? this.alert.present() : this.alert.dismiss();
      },
      (err) => console.log('Alert error', err)
    );
  }

  // Aciona o subscriber para o objeto de loading
  private handlerLoading() {
    // add sub
    this.loadingCtrl.subscribe(
      (show) => {
        show ? this.loading.present() : this.loading.dismiss();
      },
      (err) => console.log('Loading error', err)
    );
  }

  // Retonar os objetos para seu estado básico, aqui foi usado apenas para botões como exemplo.
  reset() {
    this.alert.setAttribute('buttons', null);
    this.loading.setAttribute('buttons', null);
    // ...
  }

  /**
   * Recebe as configurações de um alert
   * Popula a instancia do alert atual com os dados passos
   * Altera o estado do alert para visivel
   *
   * O handler já possui um subcribe ativo para exibir o alert
   */
  presetA(config: AlertOptions) {
    this.alert.header = config.header;
    this.alert.buttons = config.buttons;
    // ...
    this.alertCtrl.next(true);
  }

  /**
   * Reseta as instancias locais para o modelo default
   * Seta visibilidade do alert para false
   */
  dissmissA() {
    this.reset();
    this.alertCtrl.next(false);
  }

  /**
   * Recebe as configurações de um loading
   * Popula a instancia do loading atual com os dados passos
   * Altera o estado do loading para visivel
   *
   * O handler já possui um subcribe ativo para exibir o loading
   */
  presentL(config: LoadingOptions = { message: 'Aguarde...' }) {
    this.reset();
    this.loading.message = config.message;
    this.loadingCtrl.next(true);
  }

  /**
   * Reseta as instancias locais para o modelo default
   * Seta visibilidade do loading para false
   */
  dismissL() {
    this.reset();
    this.loadingCtrl.next(false);
  }
}
