import {IAction} from '../store/root.reducer';
import {LibraryActions} from './library.actions';
import {IGlobalData} from "./global-data.model";
import {BittrexMarket} from "./bittrex-market.model";
import {CoinCapData} from "./coin-cap-data.model";

export interface ILibraryState {
  error: any;
  isLoading: boolean;
  globalData: IGlobalData;
  poloniexOrderBook: any;
  poloniexTickers: any;
  coinCapCoinData: CoinCapData[];
  bittrexMarket: BittrexMarket;
  bitfinexOrderBook: any;
}

export const INITIAL_STATE: ILibraryState = {
  error: null,
  isLoading: false,
  globalData: null,
  poloniexOrderBook: null,
  poloniexTickers: null,
  coinCapCoinData: [],
  bittrexMarket: null,
  bitfinexOrderBook: null
};

export const libraryReducer = (state: ILibraryState = INITIAL_STATE, action: IAction): ILibraryState => {
  console.log("LibraryReducer");
  switch (action.type) {
    case LibraryActions.LOAD_ALL.SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        globalData: action.payload.globalData,
        poloniexOrderBook: action.payload.poloniexOrderBook,
        poloniexTickers: action.payload.poloniexTickers,
        coinCapCoinData: action.payload.coinCapCoinData
        //bittrexMarket: action.payload.bittrexMarket
        //bitfinexOrderBook: action.payload.bitfinexOrderBook
      };
    case LibraryActions.LOAD_ALL.REQUEST:
      console.log("load all req");
      return {...state, error: null, isLoading: true};
    case LibraryActions.LOAD_ALL.ERROR:
      return {...state, error: action.payload.error, isLoading: false};
    default:
      return state;
  }
};
