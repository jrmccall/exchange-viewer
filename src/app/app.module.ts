import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import {LiquidityProvidedPage} from '../pages/liquidity-provided/liquidity-provided';
import {AggregatePage} from '../pages/aggregate/aggregate';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LibraryModule} from "../library/library.module";
import {StoreModule} from "../store/store.module";
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {PairPage} from "../pages/pair/pair";
import {Http, JsonpModule} from "@angular/http";
import {HttpModule} from "@angular/http";
import {PoloniexService} from "../services/exchange-services/poloniex-service";
import {CoincapService} from "../services/coin-data-services/coincap-service";
import {Numeral} from "../services/numeral/numeral";
import {StartPage} from "../pages/start/start";

@NgModule({
  declarations: [
    MyApp,
    LiquidityProvidedPage,
    AggregatePage,
    PairPage,
    StartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LibraryModule,
    StoreModule,
    HttpClientModule,
    HttpClientJsonpModule,
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LiquidityProvidedPage,
    AggregatePage,
    PairPage,
    StartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LibraryModule,
    HttpClientModule,
    HttpModule,
    PoloniexService,
    CoincapService,
    Numeral
  ]
})
export class AppModule {}
