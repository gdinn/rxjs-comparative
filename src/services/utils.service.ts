import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingOptions, AlertOptions } from '@ionic/core';


interface PresentedLoadings {
  [id: string]: HTMLIonLoadingElement
}

interface PresentedAlerts {
  [id: string]: HTMLIonAlertElement
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  presentedLoadings: PresentedLoadings[] = []
  presentedAlerts: PresentedAlerts[] = []
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ){

  }

  presentAlert(id: string, config: AlertOptions): Observable<HTMLIonAlertElement>{
    return Observable.create(observer => {
      this.alertCtrl.create(config).then(alert => {
        alert.present().then(()=>{
          this.presentedAlerts.push({[id]: alert})
          observer.next()
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Alert error", obj: err}})
        })
      })
      .catch(err => {
        observer.error({error: {msg: "Alert error", obj: err}})
      })      
    })
  }

  dismissAlert(id: string): Observable<boolean> {
    return Observable.create(observer => {      
      let i = this.presentedAlerts.findIndex(alert => alert[id])
      if(i > -1){
        this.presentedAlerts[i][id].dismiss().then(()=>{
          this.presentedAlerts.splice(i, 1)
          observer.next(true)
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Alert error", obj: err}})
        })
      } else {
        observer.error({error: {msg: "Alert already dismissed"}})
      }      
    })
  }

  presentLoading(id: string, config: LoadingOptions = {message: "Aguarde..."}): Observable<HTMLIonLoadingElement>{
    return Observable.create(observer => {
      this.loadingCtrl.create(config).then((loading)=>{
        loading.present().then(()=>{
          this.presentedLoadings.push({[id]: loading})
          observer.next()
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Loading error", obj: err}})
        })
      })
      .catch(err => {
        observer.error({error: {msg: "Loading error", obj: err}})
      })
    })
  }

  dismissLoading(id: string): Observable<boolean> {
    return Observable.create(observer => {      
      let i = this.presentedLoadings.findIndex(loading => loading[id])
      if(i > -1){
        this.presentedLoadings[i][id].dismiss().then(()=>{
          this.presentedLoadings.splice(i, 1)
          observer.next(true)
          observer.complete()
        })
        .catch(err => {
          observer.error({error: {msg: "Loading error", obj: err}})
        })
      } else {
        observer.error({error: {msg: "Loading error"}})
      }      
    })
  }


}