import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {OrderBook} from "../../library/order-book.model";
import {PairPage} from "../pair/pair";
import {CoinCapData} from "../../library/coin-cap-data.model";
import {PoloniexService} from "../../services/exchange-services/poloniex-service";
import {PairHelper} from "../../library/pair-helper.model";
import {Coin} from "../../library/coin.model";
import {LibraryActions} from "../../library/library.actions";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('chartCanvas') chartCanvas;

  @select(['library', 'allCoins']) coinCapCoinData$: Observable<CoinCapData[]>;
  @select(['library', 'poloniexOrderBook']) poloniexOrderBook$: Observable<any>;
  @select(['library', 'poloniexTickers']) poloniexTickers$: Observable<any>;
  @select(['library', 'isLoading']) isLoading$: Observable<boolean>;
  @select(['library', 'poloniexCoins']) poloniexCoins$: Observable<Coin[]>;


  metricDisplayString: string = 'all';
  lastBase: string = '';
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, private poloniexService: PoloniexService, private _libraryActions: LibraryActions) {

  }

  ionViewDidLoad() {
    this.isLoading$.distinctUntilChanged().subscribe(isLoading => {
      if(isLoading){
        if(!this.loading){
          this.loading = this.loadingCtrl.create({content: 'Please wait...'});
        }
        this.loading.present();
      } else {
        if(this.loading){
          this.loading.dismiss();
          this.loading = null;
        }
      }
    });


  }

  ionViewWillLeave(){
    let coins: Coin[] = [];
    this.poloniexData$.subscribe(data => coins = data);
    console.log(coins);
    this._libraryActions.setPoloniexCoins(coins);
  }

  poloniexData$: Observable<Coin[]> = this.poloniexService.formatDataForLibrary();



  // metricsSetter(){
  //   let alert = this.alertCtrl.create();
  //   alert.setTitle('Select Percent Away from Highest Bid');
  //
  //   alert.addInput({
  //     type: 'radio',
  //     label: 'All',
  //     value: 'all',
  //     checked: true
  //   });
  //
  //   alert.addInput({
  //     type: 'radio',
  //     label: '10%',
  //     value: '10'
  //   });
  //
  //   alert.addInput({
  //     type: 'radio',
  //     label: '1%',
  //     value: '1'
  //   });
  //
  //   alert.addButton('Cancel');
  //   alert.addButton({
  //     text: 'Ok',
  //     handler: (data: any) => {
  //       console.log('Radio data:', data);
  //       this.determineMetricToDisplay(data);
  //     }
  //   });
  //
  //   alert.present();
  // }

  pushPairPage(pair: OrderBook){
    this.navCtrl.push(PairPage, pair);
  }

}
