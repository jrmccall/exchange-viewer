import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {Coin} from "../../library/coin.model";
import {Pair} from "../../library/pair.model";

@Component({
  selector: 'page-aggregate',
  templateUrl: 'aggregate.html'
})
export class AggregatePage {

  @select(['library', 'poloniexCoins']) poloniexCoins$: Observable<Coin[]>;
  @select(['library', 'allCoins']) allCoins$: Observable<any>;

  fiatPair = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {


  }

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
      if(isEmpty(poloniexCoins) || allCoins == null){
        return null;
      }
      let btcSumData = {
        name: 'BTC',
        sum: 0,
        liq1: 0,
        liq10: 0,
        liqAll: 0,
        mktCap: allCoins['BTC'].mktcap
      };

      poloniexCoins.forEach(function(current, index, array){
        if(current.name == 'BTC' && allCoins.hasOwnProperty('BTC')){
          btcSumData.liq1 = current.sumLiquidity1*allCoins['BTC'].price;
          btcSumData.liq10 = current.sumLiquidity10*allCoins['BTC'].price;
          btcSumData.liqAll = current.sumLiquidityAll*allCoins['BTC'].price;
        }
        current.pairs.forEach(function(current2, index2, array2){
          if(current2.secondCoin == 'BTC' && allCoins.hasOwnProperty(current2.baseCoin)){
            btcSumData.sum += +current2.liquidityAll*allCoins[current2.baseCoin].price;
          }
        });
      });

      return btcSumData;
    });


}
