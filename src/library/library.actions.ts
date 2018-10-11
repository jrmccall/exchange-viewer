import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store/root.reducer';
import {AjaxTrio} from '../shared/ajaxTrio.class';
import {Coin} from "./coin.model";


@Injectable()
export class LibraryActions {

  static readonly LOAD_ALL = new AjaxTrio(
    'LOAD_ALL',
    'Loading library...',
    'Failed to load library'
  );

  static readonly GET_ALL_COINS = new AjaxTrio(
    'GET_ALL_COINS',
    'Loading library...',
    'Failed to load library'
  );

  static readonly SET_POLONIEX_COINS =
    'SET_POLONIEX_COINS';

  constructor(private _ngRedux: NgRedux<IAppState>) {
  }

  loadAll() {
    AjaxTrio.dispatchRequestAction(
      this._ngRedux, LibraryActions.LOAD_ALL, {});
  }

  getAllCoins(){
    console.log("getting all");
    AjaxTrio.dispatchRequestAction(
      this._ngRedux, LibraryActions.GET_ALL_COINS, {});

  }

  setPoloniexCoins(coins: Coin[]){
    this._ngRedux.dispatch({
      type: LibraryActions.SET_POLONIEX_COINS,
      payload: {coins}
    });
  }

}
