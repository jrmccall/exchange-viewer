import {Order} from "./order.model";

export interface Pair{
  baseCoin: string,
  secondCoin: string,
  liquidity1: number,
  liquidity10: number,
  liquidityAll: number,
  last: number,
  mktCap: number,
  volume: number,
  orders: Order[]
}
