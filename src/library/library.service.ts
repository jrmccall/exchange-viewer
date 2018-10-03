import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpClientJsonpModule} from "@angular/common/http";
import {JsonpModule, Jsonp, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IGlobalData} from "./global-data.model";
import {BittrexMarkets} from "./bittrex-markets.model";
import {CoinCapData} from "./coin-cap-data.model";
import {map} from "rxjs/internal/operators";
import {PoloniexService} from "../services/exchange-services/poloniex-service";
import {CoincapService} from "../services/coin-data-services/coincap-service";
import {PairHelper} from "./pair-helper.model";

declare var require: any;
const poloniex_api_url = 'https://poloniex.com/public?command=';
const bittrex_public_api_url = 'https://bittrex.com/api/v1.1/public/';
const bitfinex_public_api_url = 'https://api.bitfinex.com/v2/';
const coin_cap_api_url = 'http://coincap.io/';

// const BFX = require('bitfinex-api-node');
// const bfx = new BFX({
//   apiKey: '',
//   apiSecret: ''
// });

@Injectable()
export class LibraryService {

  constructor(private httpClient: HttpClient, private jsonp: HttpClientJsonpModule, private poloniexService: PoloniexService, private coinDataService: CoincapService) {
  }

  getPoloniexOrderBook(): Observable<PairHelper[]>{
    let orderBookAllCoinsURL = poloniex_api_url+'returnOrderBook&currencyPair=all&depth=10000';
    return this.httpClient.get<any>(orderBookAllCoinsURL);
  }

  getPoloniexTickers(){
    let tickerURL = poloniex_api_url + 'returnTicker';
    return this.httpClient.get<any>(tickerURL);
  }

  getBittrexMarket(){
    let getMarketsURL = bittrex_public_api_url + 'getmarkets';
    return this.httpClient.jsonp(getMarketsURL, 'callback').pipe(
      map( res => {
      return res;
    }));
    // return this.http.get(getMarketsURL).map((response: Response) => response.json());
  }

  getBitfinexTickers(){
    let getTickersURL = bitfinex_public_api_url+'tickers?symbols=ALL';
    // let httpClient = this.httpClient;
    let tickers = {};
    // var promise = new Promise(function(resolve, reject) {
    //   // do a thing, possibly async, then…
    //   let tickers = httpClient.get(getTickersURL);
    //   console.log(tickers);
    //   let empty = false;
    //   tickers.isEmpty().subscribe(result => empty = result);
    //   if (empty) {
    //     console.log("resolve");
    //     resolve(tickers);
    //   }
    //   else {
    //     console.log("reject");
    //     reject(Error("It broke"));
    //   }
    // });
    //
    // promise.then(function(result) {
    //   tickers = result;
    //   let temp = {};
    //   console.log(tickers.elementAt(0));
    // }, function(err) {
    //   console.log(err); // Error: "It broke"
    // });
    return tickers;
    //return this.httpClient.get(getTickersURL);
  }

  getBitfinexOrderBook(){
    let pair = 'btcusd';
    let getOrderBookURL = bitfinex_public_api_url +'book/tBTCUSD/R0';

    return this.httpClient.get(getOrderBookURL);
  }

  getCoinCapCoinData(){
    let getFrontURL = coin_cap_api_url + 'front';
    return this.coinDataService.makeCoinTable(this.httpClient.get<CoinCapData[]>(getFrontURL));
  }
}
