import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { BooksPromiseService } from 'src/services/books.promise.service';
import { BooksRxjsService } from 'src/services/books.rxjs.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage
  ],
  providers: [
    BooksPromiseService,
    BooksRxjsService
  ]
})
export class HomePageModule {}
