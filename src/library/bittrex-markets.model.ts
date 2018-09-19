import {BittrexMarket} from "./bittrex-market.model";

export interface BittrexMarkets {
  success: any;
  message: string;
  result: BittrexMarket[];
}
