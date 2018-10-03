import {IAction} from '../store/root.reducer';
import {LibraryActions} from './library.actions';
import {IGlobalData} from "./global-data.model";
import {BittrexMarket} from "./bittrex-market.model";
import {CoinCapData} from "./coin-cap-data.model";
import {PairHelper} from "./pair-helper.model";
import {Coin} from "./coin.model";

export interface ILibraryState {
  error: any;
  isLoading: boolean;
  poloniexOrderBook: PairHelper[];
  poloniexTickers: any;
  allCoins: any;
  poloniexCoins: Coin[];
  bittrexMarket: BittrexMarket;
  bitfinexOrderBook: any;
}

export const INITIAL_STATE: ILibraryState = {
  error: null,
  isLoading: false,
  allCoins: null,
  poloniexCoins: [],
  poloniexOrderBook: [],
  poloniexTickers: null,
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
        allCoins: action.payload.allCoins,
        poloniexOrderBook: action.payload.poloniexOrderBook,
        poloniexTickers: action.payload.poloniexTickers
        //bitfinexOrderBook: action.payload.bitfinexMarket
      };
    case LibraryActions.LOAD_ALL.REQUEST:
      return {...state, error: null, isLoading: true};
    case LibraryActions.LOAD_ALL.ERROR:
      return {...state, error: action.payload.error, isLoading: false};
    case LibraryActions.GET_ALL_COINS.SUCCESS:
      return {...state, error: null, allCoins: action.payload.allCoins, isLoading: false};
    case LibraryActions.GET_ALL_COINS.REQUEST:
      return {...state, error: null, isLoading: true};
    case LibraryActions.GET_ALL_COINS.ERROR:
      return {...state, error: action.payload.error, isLoading: false};
    case LibraryActions.SET_POLONIEX_COINS:
      return {...state, poloniexCoins: action.payload.coins, isLoading: false};
    default:
      return state;
  }
};
