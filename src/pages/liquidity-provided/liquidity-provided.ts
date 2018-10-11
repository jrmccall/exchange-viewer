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
import {Numeral} from "../../services/numeral/numeral";
import {BehaviorSubject} from "rxjs/Rx";

@Component({
  selector: 'page-home',
  templateUrl: 'liquidity-provided.html'
})
export class LiquidityProvidedPage {

  @ViewChild('chartCanvas') chartCanvas;

  @select(['library', 'allCoins']) coinCapCoinData$: Observable<CoinCapData[]>;
  @select(['library', 'poloniexOrderBook']) poloniexOrderBook$: Observable<any>;
  @select(['library', 'poloniexTickers']) poloniexTickers$: Observable<any>;
  @select(['library', 'isLoading']) isLoading$: Observable<boolean>;
  @select(['library', 'poloniexCoins']) poloniexCoins$: Observable<Coin[]>;

  sortByMarketCap$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByLiqAll$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByLiq10$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByLiq1$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByVolume$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  lastSortID$: BehaviorSubject<string> = new BehaviorSubject<string>('marketcap');

  metricDisplayString: string = 'all';
  lastBase: string = '';
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
              private poloniexService: PoloniexService, private _libraryActions: LibraryActions, public numeral: Numeral) {

  }

  sortByMarketCap(){
    let mktSortField = false;
    this.lastSortID$.next('marketcap');
    this.sortByMarketCap$.subscribe(data => mktSortField = data);
    if(mktSortField){
      this.sortByMarketCap$.next(false);
    } else {
      this.sortByMarketCap$.next(true);
    }
  }

  sortByLiqAll(){
    let sortField = false;
    this.lastSortID$.next('liqall');
    this.sortByLiqAll$.subscribe(data => sortField = data);
    if(sortField){
      this.sortByLiqAll$.next(false);
    } else {
      this.sortByLiqAll$.next(true);
    }
  }

  sortByLiq10(){
    let sortField = false;
    this.lastSortID$.next('liq10');
    this.sortByLiq10$.subscribe(data => sortField = data);
    if(sortField){
      this.sortByLiq10$.next(false);
    } else {
      this.sortByLiq10$.next(true);
    }
  }

  sortByLiq1(){
    let sortField = false;
    this.lastSortID$.next('liq1');
    this.sortByLiq1$.subscribe(data => sortField = data);
    if(sortField){
      this.sortByLiq1$.next(false);
    } else {
      this.sortByLiq1$.next(true);
    }
  }

  sortByVolume(){
    let sortField = false;
    this.lastSortID$.next('volume');
    this.sortByVolume$.subscribe(data => sortField = data);
    if(sortField){
      this.sortByVolume$.next(false);
    } else {
      this.sortByVolume$.next(true);
    }
  }


  poloniexCoinsDisplay$: Observable<Coin[]> = Observable.combineLatest(
    this.poloniexCoins$,
    this.sortByMarketCap$,
    this.sortByVolume$,
    this.sortByLiqAll$,
    this.sortByLiq10$,
    this.sortByLiq1$,
    this.lastSortID$,
    (poloniexCoins: Coin[], sortByMarketCap: boolean, sortByVolume: boolean, sortByLiqAll: boolean,
     sortByLiq10: boolean, sortByLiq1: boolean, lastSortID: string) => {
      if(isEmpty(poloniexCoins)){
        return [];
      }

      if(lastSortID == 'marketcap'){
        if(sortByMarketCap){
          poloniexCoins.sort(function(a,b){
            return b.mktCap-a.mktCap;
          });
        } else {
          poloniexCoins.sort(function(a,b){
            return a.mktCap-b.mktCap;
          });
        }
      }

      if(lastSortID=='volume'){
        if(sortByVolume){
          poloniexCoins.sort(function(a,b){
            return b.sumVolume-a.sumVolume;
          });
        } else {
          poloniexCoins.sort(function(a,b){
            return a.sumVolume-b.sumVolume;
          });
        }
      }

      if(lastSortID=='liqall'){
        if(sortByLiqAll){
          poloniexCoins.sort(function(a,b){
            return b.sumLiquidityAll-a.sumLiquidityAll;
          });
        } else {
          poloniexCoins.sort(function(a,b){
            return a.sumLiquidityAll-b.sumLiquidityAll;
          });
        }
      }

      if(lastSortID=='liq10'){
        if(sortByLiq10){
          poloniexCoins.sort(function(a,b){
            return b.sumLiquidity10-a.sumLiquidity10;
          });
        } else {
          poloniexCoins.sort(function(a,b){
            return a.sumLiquidity10-b.sumLiquidity10;
          });
        }
      }

      if(lastSortID=='liq1'){
        if(sortByLiq1){
          poloniexCoins.sort(function(a,b){
            return b.sumLiquidity1-a.sumLiquidity1;
          });
        } else {
          poloniexCoins.sort(function(a,b){
            return a.sumLiquidity1-b.sumLiquidity1;
          });
        }
      }

      return poloniexCoins;
  });

  pushPairPage(pair: OrderBook){
    this.navCtrl.push(PairPage, pair);
  }

}
