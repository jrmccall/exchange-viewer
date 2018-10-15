import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {Coin} from "../../library/coin.model";
import {Pair} from "../../library/pair.model";
import {PoloniexService} from "../../services/exchange-services/poloniex-service";
import {LibraryActions} from "../../library/library.actions";
import {Numeral} from "../../services/numeral/numeral";

declare var require: any;
const numeral = require('numeral');

@Component({
  selector: 'page-aggregate',
  templateUrl: 'aggregate.html'
})
export class AggregatePage {

  @select(['library', 'allCoins']) allCoins$: Observable<any>;
  @select(['library', 'isLoading']) isLoading$: Observable<any>;
  @select(['library', 'poloniexCoins']) poloniexCoins$: Observable<Coin[]>;

  fiatPair = {};
  loading: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private poloniexService: PoloniexService,
              private _libraryActions: LibraryActions, public loadingCtrl: LoadingController, public numeral: Numeral) {


  }

  ionViewDidLoad() {
    // this.isLoading$.distinctUntilChanged().subscribe(isLoading => {
    //   if(isLoading){
    //     if(!this.loading){
    //       this.loading = this.loadingCtrl.create({content: 'Please wait...'});
    //     }
    //     this.loading.present();
    //   } else {
    //     if(this.loading){
    //       this.loading.dismiss();
    //       this.loading = null;
    //     }
    //   }
    // });


  }

  ionViewWillLeave(){
    // let coins: Coin[] = [];
    // this.poloniexCoins$.subscribe(data => coins = data);
    // console.log(coins);
    // this._libraryActions.setPoloniexCoins(coins);
  }

  //poloniexCoins$: Observable<Coin[]> = this.poloniexService.formatDataForLibrary();

  btcFiatValue$: Observable<Pair> = this.poloniexCoins$.map((poloniexCoins: Coin[]) => {
    if(isEmpty(poloniexCoins)){
      return null;
    }

    let fiatCoin: Coin = poloniexCoins.find(function(current, index, array){
      return current.name == 'USDT';
    });

    let pair: Pair = fiatCoin.pairs.find(function(current, index, array){
      return current.secondCoin == 'BTC';
    });
    console.log(pair);
    this.fiatPair = pair;
    return pair;

  });

  sumOfCoinsForBTC$: Observable<any> = Observable.combineLatest(
    this.poloniexCoins$,
    this.allCoins$,
    (poloniexCoins: Coin[], allCoins: any) => {
      if (isEmpty(poloniexCoins) || allCoins == null) {
        return null;
      }
      let btcSumData = {
        name: 'BTC',
        sum: '',
        liq1: 0,
        liq10: 0,
        liqAll: 0,
        mktCap: this.numeral.formatNumToLetter(allCoins['BTC'].mktcap)
      };
      let coinList: Coin[] = [];
      let sum = 0;
      let numeral = this.numeral;

      poloniexCoins.forEach(function (current, index, array) {
        if (current.name == 'BTC' && allCoins.hasOwnProperty('BTC')) {
          btcSumData.liq1 = numeral.formatNumToLetter(current.sumLiquidity1 * allCoins['BTC'].price);
          btcSumData.liq10 = numeral.formatNumToLetter(current.sumLiquidity10 * allCoins['BTC'].price);
          btcSumData.liqAll = numeral.formatNumToLetter(current.sumLiquidityAll * allCoins['BTC'].price);

        }
        current.pairs.forEach(function (current2, index2, array2) {
          if (current2.secondCoin == 'BTC' && allCoins.hasOwnProperty(current2.baseCoin)) {
            sum += +current2.liquidityAll * allCoins[current2.baseCoin].price;
          }
        });
      });
      btcSumData.sum = this.numeral.formatNumToLetter(sum);

      return btcSumData;
  });

  listOfCoinsForBTC$: Observable<any[]> = Observable.combineLatest(
    this.poloniexCoins$,
    this.allCoins$,
    (poloniexCoins: Coin[], allCoins: any) => {
    if(isEmpty(poloniexCoins) || allCoins == null){
      return [];
    }
    let numeral = this.numeral;
    let coinListForBTC = poloniexCoins.map(function(current, index, array){
      if (current.name != 'BTC') {
        let coin = {
          name: '',
          amount: 0
        };
        current.pairs.forEach(function(current2, index2, array2){
          if(current2.secondCoin == 'BTC' && allCoins.hasOwnProperty(current2.baseCoin)){
            coin.name = current2.baseCoin;
            coin.amount = +current2.liquidityAll*allCoins[current2.baseCoin].price;
          }
        });
        return coin;
      }
    }).reverse();
    coinListForBTC.pop();
    coinListForBTC.sort(function(a, b){
      return b.amount-a.amount;
    });
    console.log(coinListForBTC);
    return coinListForBTC;
  });




}
