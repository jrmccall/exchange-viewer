import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {CoinCapData} from "../../library/coin-cap-data.model";
import {Coin} from "../../library/coin.model";
import {Pair} from "../../library/pair.model";
import {PairHelper} from "../../library/pair-helper.model";
import {LibraryActions} from "../../library/library.actions";
import {Component} from "@angular/core";

@Component({

})
export class PoloniexService{

  @select(['library', 'allCoins']) allCoins$: Observable<any>;
  @select(['library', 'poloniexOrderBook']) poloniexOB$: Observable<any>;
  @select(['library', 'poloniexTickers']) poloniexTickers$: Observable<any>;

  constructor(private _libraryActions: LibraryActions){

  }

  formatDataForLibrary(){
    // let promise = new Promise(function(resolve, reject) {
    //   let pairList$: Observable<PairHelper[]> = this.makePairList();
    //   let baseList$ = this.makeListFromOriginalBases(pairList$);
    //   let secondList$ = this.makeListFromOthers(pairList$);
    //   let finalList$ = this.combineCoinLists(baseList$, secondList$);
    //
    //   let finalList: Coin[] = [];
    //   finalList$.subscribe(data => finalList = data);
    //
    //   if(!isEmpty(finalList)){
    //     resolve(finalList);
    //   }
    // });
    //let libraryActions = this._libraryActions;
    console.log("format for library");
    let pairList$: Observable<PairHelper[]> = this.makePairList();
    let baseList$ = this.makeListFromOriginalBases(pairList$);
    let secondList$ = this.makeListFromOthers(pairList$);
    let finalList$ = this.combineCoinLists(baseList$, secondList$);
    return finalList$;

    // promise.then(function(result){
    //   console.log("Success");
    //   this.setCoinsInLibrary(result);
    // });
    //this.setCoinsInLibrary(finalList$);
  }

  setCoinsInLibrary(finalList$: Observable<Coin[]>){
    let coins: Coin[] = [];
    finalList$.subscribe(data => coins = data);
    console.log(coins);
    this._libraryActions.setPoloniexCoins(coins);
  }

  makePairList(){
    let list$: Observable<PairHelper[]> = Observable.combineLatest(
      this.poloniexOB$,
      this.allCoins$,
      this.poloniexTickers$,
      (data: any, coinData: any, poloniexTickers: any) => {
        if(data == null || coinData == null || poloniexTickers == null){ console.log("makePairList"); return []; }
        let pairList: PairHelper[] = [];
        for(let key in data){
          if(data.hasOwnProperty(key)){
            let coinPairArray = key.split("_");
            let baseCoin = coinPairArray[0];
            let secondCoin = coinPairArray[1];
            if(!coinData.hasOwnProperty(baseCoin) || !coinData.hasOwnProperty(secondCoin)){
              continue;
            }
            let currentPair: PairHelper = {
              baseCoin: baseCoin,
              secondCoin: secondCoin,
              baseMktCap: coinData[baseCoin].mktcap,
              secondMktCap: coinData[secondCoin].mktcap,
              bids: data[key].bids,
              asks: data[key].asks,
              bidLiquidity10: null,
              bidLiquidity1: null,
              bidLiquidityAll: null,
              askLiquidity10: null,
              askLiquidity1: null,
              askLiquidityAll: null,
              last: null,
              baseVolume: +poloniexTickers[key].baseVolume,
              secondVolume: +poloniexTickers[key].quoteVolume
            };
            this.getBidLiquidities(currentPair);
            this.getAskLiquidities(currentPair);
            pairList.push(currentPair);
          }
        }

        return pairList;
      });
    return list$;
  }
  makeListFromOriginalBases(data: Observable<PairHelper[]>){
    let list$: Observable<Coin[]> = Observable.combineLatest(
      data,
      this.allCoins$,
      (data: PairHelper[], coinData: any) => {
        if(data == null || coinData == null){ return []; }
        let coinList: Coin[] = [];
        let pairList: Pair[] = [];

        let currentBase = data[0].baseCoin;
        for(let i = 0; i<data.length; i++){
          let current = data[i];
          if(current.baseCoin != currentBase || i == data.length-1){
            let currentCoin = this.formCoinObject();
            currentCoin.mktCap = coinData[currentBase].mktcap;
            currentCoin.name = currentBase;
            currentCoin.pairs = pairList;
            this.getCoinLiquidity(currentCoin);
            coinList.push(currentCoin);
            pairList = [];
            currentBase = current.baseCoin;
          }

          let currentPair: Pair = this.formPairObject();
          currentPair.baseCoin = current.baseCoin;
          currentPair.secondCoin = current.secondCoin;
          currentPair.orders = current.bids;
          currentPair.mktCap = current.secondMktCap;
          currentPair.volume = +current.baseVolume.toPrecision(5);
          currentPair.last = current.bids[0][0];
          currentPair.liquidityAll = current.bidLiquidityAll;
          currentPair.liquidity10 = current.bidLiquidity10;
          currentPair.liquidity1 = current.bidLiquidity1;

          pairList.push(currentPair);

        }
        console.log(coinList);
        return coinList;
      });
    return list$;
  }

  makeListFromOthers(data: Observable<PairHelper[]>){
    let list$: Observable<Coin[]> = Observable.combineLatest(
      data,
      this.allCoins$,
      (data: PairHelper[], coinData: any) => {
        if(data == null || coinData == null){ return []; }
        let coinList: Coin[] = [];
        let pairList: Pair[] = [];
        data.sort(function(a,b){
          if(a.secondCoin < b.secondCoin){
            return -1;
          } else if(a.secondCoin > b.secondCoin){
            return 1;
          } else if(a.secondCoin == b.secondCoin){
            return 0;
          }
        });
        console.log(data);
        let currentBase = data[0].secondCoin;
        for(let i = 0; i<data.length; i++){
          let current = data[i];
          if(current.secondCoin != currentBase || i == data.length-1){
            let currentCoin = this.formCoinObject();
            currentCoin.mktCap = coinData[currentBase].mktcap;
            currentCoin.name = currentBase;
            currentCoin.pairs = pairList;
            this.getCoinLiquidity(currentCoin);
            coinList.push(currentCoin);
            pairList = [];
            currentBase = current.secondCoin;
          }

          let currentPair: Pair = this.formPairObject();
          currentPair.baseCoin = current.secondCoin;
          currentPair.secondCoin = current.baseCoin;
          currentPair.orders = current.asks;
          currentPair.mktCap = current.baseMktCap;
          currentPair.volume = +current.secondVolume.toPrecision(5);
          currentPair.last = current.asks[0][0];
          currentPair.liquidityAll = current.askLiquidityAll;
          currentPair.liquidity10 = current.askLiquidity10;
          currentPair.liquidity1 = current.askLiquidity1;

          pairList.push(currentPair);

        }
        console.log(coinList);
        return coinList;
      });
    return list$;
  }

  formCoinObject(){
    return {
      name: null,
      sumLiquidityAll: null,
      sumLiquidity10: null,
      sumLiquidity1: null,
      sumVolume: null,
      mktCap: null,
      pairs: []
    };
  }

  formPairObject(){
    return {
      baseCoin: null,
      secondCoin: null,
      liquidity1: null,
      liquidity10: null,
      liquidityAll: null,
      last: null,
      mktCap: null,
      volume: null,
      orders: []
    };
  }

  getBidLiquidities(pairObject: PairHelper){
    let topPrice = +pairObject.bids[0][0];
    let percent1Price = topPrice*.99;
    let percent10Price = topPrice*.9;
    let sum1 = 0, sum10 = 0, sumAll = 0, previousCompare = 0;
    pairObject.bids.forEach(function(current, index, array) {
      sumAll += current[1]*(+current[0]);
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
    pairObject.bidLiquidity1 = +sum1.toPrecision(5);
    pairObject.bidLiquidity10 = +sum10.toPrecision(5);
    pairObject.bidLiquidityAll = +sumAll.toPrecision(5);
  }

  getAskLiquidities(pairObject: PairHelper){
    let length = pairObject.asks.length;
    let topPrice = +pairObject.asks[0][0];
    let percent1Price = topPrice*1.01;
    let percent10Price = topPrice*1.1;
    let sum1 = 0, sum10 = 0, sumAll = 0, previousCompare = 0;
    pairObject.asks.forEach(function(current, index, array) {
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
    pairObject.askLiquidity1 = +sum1.toPrecision(5);
    pairObject.askLiquidity10 = +sum10.toPrecision(5);
    pairObject.askLiquidityAll = +sumAll.toPrecision(5);
  }

  getCoinLiquidity(coin: Coin){
    let liq1 = 0;
    let liq10 = 0;
    let liqAll = 0;
    let volume = 0;
    coin.pairs.forEach(function(current, index, array){
      liq1 += current.liquidity1;
      liq10 += current.liquidity10;
      liqAll += current.liquidityAll;
      volume += current.volume;
    });
    coin.sumLiquidity1 = +liq1.toPrecision(5);
    coin.sumLiquidity10 = +liq10.toPrecision(5);
    coin.sumLiquidityAll = +liqAll.toPrecision(5);
    coin.sumVolume = +volume.toPrecision(5);
  }

  combineCoinLists(baseList: Observable<Coin[]>, secondList: Observable<Coin[]>){
    let finalList$ = Observable.combineLatest(
      baseList,
      secondList,
      (baseList: Coin[], secondList: Coin[]) => {
        if(isEmpty(baseList) || isEmpty(secondList)){
          console.log("One or both of the lists were empty when combining");
          return [];
        }
        for(let i=0; i<secondList.length; i++){
          let existsInBaseList = false;
          for(let j=0; j<baseList.length; j++){
            if(secondList[i].name == baseList[j].name){
              baseList[j].pairs = baseList[j].pairs.concat(secondList[i].pairs).sort(function (a, b) {
               return b.mktCap-a.mktCap;
              });
              this.fixSums(baseList[j], secondList[i]);
              existsInBaseList = true;
            }
          }
          if(!existsInBaseList){
            baseList.push(secondList[i]);
          }

        }
        baseList.sort(function(a, b){ return b.mktCap-a.mktCap; });
        //this._libraryActions.setPoloniexCoins(baseList);
        return baseList;
      });
    return finalList$;
  }

  fixSums(base: Coin, second:Coin){
    let volume = +(base.sumVolume + second.sumVolume).toPrecision(5);
    let liqAll = +(base.sumLiquidityAll + second.sumLiquidityAll).toPrecision(5);
    let liq10 = +(base.sumLiquidity10 + second.sumLiquidity10).toPrecision(5);
    let liq1 = +(base.sumLiquidity1 + second.sumLiquidity1).toPrecision(5);


    base.sumVolume = 0;
    base.sumLiquidityAll = 0;
    base.sumLiquidity10 = 0;
    base.sumLiquidity1 = 0;

    base.sumVolume = volume;
    base.sumLiquidityAll = liqAll;
    base.sumLiquidity10 = liq10;
    base.sumLiquidity1 = liq1;

  }

}
