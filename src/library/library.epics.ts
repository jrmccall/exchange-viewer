import {Injectable} from '@angular/core';
import {AjaxTrio} from '../shared/ajaxTrio.class';
import {IAction} from '../store/root.reducer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/switchMap';
import {LibraryService} from './library.service';
import 'rxjs/add/observable/forkJoin';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LibraryEpics {

  constructor(private _service: LibraryService) {
  }

  loadAll(ajaxTrio: AjaxTrio) {
    return action$ => action$
      .ofType(ajaxTrio.REQUEST)
      .switchMap((a: IAction) =>
        Observable.forkJoin(
          this._service.getGlobalData(),
          this._service.getPoloniexOrderBook(),
          this._service.getPoloniexTickers(),
          this._service.getCoinCapCoinData()
          //this._service.getBittrexMarket()
          //this._service.getBitfinexOrderBook()
        )
          .map((data: any[]) => AjaxTrio.getSuccessAction(
            ajaxTrio,
            {
              globalData: data[0],
              poloniexOrderBook: data[1],
              poloniexTickers: data[2],
              coinCapCoinData: data[3],
              bittrexMarket: data[4]
            }
          ))
          .catch(response => [AjaxTrio.getErrorAction(ajaxTrio, response.status)])
      );
  }

}
