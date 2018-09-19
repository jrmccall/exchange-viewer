import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IGlobalData} from "./global-data.model";
import {BittrexMarkets} from "./bittrex-markets.model";
import {CoinCapData} from "./coin-cap-data.model";

declare var require: any;
const poloniex_api_url = 'https://poloniex.com/public?command=';
const bittrex_public_api_url = 'https://bittrex.com/api/v1.1/public/';
const bitfinex_public_api_url = 'https://api.bitfinex.com/v1/book/:';
const coin_cap_api_url = 'http://coincap.io/';

@Injectable()
export class LibraryService {

  constructor(private httpClient: HttpClient, private http: Http) {
  }

  getGlobalData(): Observable<IGlobalData> {
    return this.httpClient.get<IGlobalData>('https://api.coinmarketcap.com/v1/global/'); //.map((response: Response) => response.json());
  }

  getPoloniexOrderBook(): Observable<any>{
    let orderBookAllCoinsURL = poloniex_api_url+'returnOrderBook&currencyPair=all&depth=10000';
    return this.httpClient.get<any>(orderBookAllCoinsURL);
  }

  getPoloniexTickers(){
    let tickerURL = poloniex_api_url + 'returnTicker';
    return this.httpClient.get<any>(tickerURL);
  }

  getBittrexMarket(){
    const bittrex = require('node-bittrex-api');
    return bittrex.getmarketsummaries( function(data, err) {
      console.log(data);
      return data;
    });
    // let getMarketsURL = bittrex_public_api_url + 'getmarkets';
    // return this.http.get(getMarketsURL).map((response: Response) => response.json());
  }

  getBitfinexOrderBook(){
    let pair = 'btcusd';
    let getOrderBookURL = bitfinex_public_api_url + pair;
    return this.http.get(getOrderBookURL).map((response: Response) => response.json());
  }

  getCoinCapCoinData(){
    let getFrontURL = coin_cap_api_url + 'front';
    return this.httpClient.get<CoinCapData[]>(getFrontURL);
  }
}
