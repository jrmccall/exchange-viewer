import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {OrderBook} from "../../library/order-book.model";
import {PairPage} from "../pair/pair";
import {CoinCapData} from "../../library/coin-cap-data.model";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('chartCanvas') chartCanvas;

  @select(['library', 'coinCapCoinData']) coinCapCoinData$: Observable<CoinCapData[]>;
  @select(['library', 'poloniexOrderBook']) poloniexOrderBook$: Observable<any>;
  @select(['library', 'poloniexTickers']) poloniexTickers$: Observable<any>;
  @select(['library', 'isLoading']) isLoading$: Observable<boolean>;


  metricDisplayString: string = 'all';
  lastBase: string = '';
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

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


  coinCapDictionary$: Observable<any> = this.coinCapCoinData$.map((coinData: CoinCapData[]) => {
    if(isEmpty(coinData)){
      return [];
    }
    let coinDict = {};
    coinData.forEach(function(current, index, array){
      let key = current.short;
      coinDict[key] = current;
      //console.log(coinDict[key].mktcap);
    });
    console.log(coinDict);
    return coinDict;
  });

  pairList$: Observable<OrderBook[]> = Observable.combineLatest(
    this.poloniexOrderBook$,
    this.poloniexTickers$,
    this.coinCapDictionary$,
    (orderBook: any, tickers: any, coinDict: any) => {
    if(orderBook == null || tickers == null){
      return [];
    }

    let pairListArray = [];
    for(let key in orderBook){
      if(orderBook.hasOwnProperty(key)){
        let pairObject: OrderBook = orderBook[key];
        pairObject.pair = key;
        pairObject.last = tickers[key].last;
        pairObject.baseVolume = tickers[key].baseVolume;
        pairObject.quoteVolume = tickers[key].quoteVolume;
        pairObject.coin = key.split('_')[1];
        pairObject.base = key.split('_')[0];
        if(coinDict.hasOwnProperty(pairObject.coin)){
          pairObject.mktCap = +coinDict[pairObject.coin].mktcap.toFixed(2);
        }else {
          pairObject.mktCap = 0;
        }
        this.calculateOrderBookSumData(pairObject);
        pairListArray.push(pairObject);
      }
    }
    console.log(pairListArray);
    return pairListArray;
  });

  calculateOrderBookSumData(pairObject: OrderBook){
    let topPrice = +pairObject.bids[0][0];
    let percent1Price = topPrice*.99;
    let percent10Price = topPrice*.9;
    let sum1 = 0, sum10 = 0, sumAll = 0, previousCompare = 0;
    pairObject.bids.forEach(function(current, index, array) {
      sumAll += current[1];
      let currentCompare = +current[0]/percent1Price;
      if((+current[0]/percent1Price) < 1.01 && (+current[0]/percent1Price) > 0.99){
        sum1 = sumAll;
      } else if((+current[0]/percent10Price) < 1.01 && (+current[0]/percent10Price) > 0.99) {
        sum10 = sumAll;
      }

      if(sum1 == 0){
        if(+current[0]/percent1Price < 1.2 || +current[0]/percent1Price > 0.8){
          sum1 = sumAll;
        }
      }
      if(sum10 == 0){
        if(+current[0]/percent10Price < 1.2 || +current[0]/percent10Price > 0.8){
          sum10 = sumAll;
        }
      }

    });
    pairObject.obMetric1 = +sum1.toFixed(2);
    pairObject.obMetric10 = +sum10.toFixed(2);
    pairObject.obMetricAll = +sumAll.toFixed(2);
  }

  metricsSetter(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Percent Away from Highest Bid');

    alert.addInput({
      type: 'radio',
      label: 'All',
      value: 'all',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '10%',
      value: '10'
    });

    alert.addInput({
      type: 'radio',
      label: '1%',
      value: '1'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        this.determineMetricToDisplay(data);
      }
    });

    alert.present();
  }

  determineMetricToDisplay(data: any){
    if(data == 'all'){
      this.metricDisplayString = data;
    }else if(data == '10') {
      this.metricDisplayString = data;
    } else if(data == '1') {
      this.metricDisplayString = data;
    }
  }

  dividerHelper(base: string){
    if(this.lastBase == ''){
      this.lastBase = base;
      return true;
    } else if(base != this.lastBase){
      this.lastBase = base;
      return true;
    } else {
      return false;
    }
  }

  pushPairPage(pair: OrderBook){
    this.navCtrl.push(PairPage, pair);
  }

}
