import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {CoinCapData} from "../../library/coin-cap-data.model";

export class CoincapService {

  constructor(){

  }

  makeCoinTable(coinData: any){
    let coinCapDictionary$: Observable<any> = coinData.map((coinData: CoinCapData[]) => {
      if(isEmpty(coinData)){
        return [];
      }
      let coinDict = {};
      let index = 0;
      while(index < 40){
        let key = coinData[index].short;
        coinDict[key] = coinData[index];
        index++;
      }


      console.log(coinDict);
      return coinDict;
    });

    return coinCapDictionary$;
  }
}
