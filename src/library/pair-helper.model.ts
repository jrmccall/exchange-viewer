import {Order} from "./order.model";

export interface PairHelper{
  baseCoin: string,
  secondCoin: string,
  bidLiquidity1: number,
  bidLiquidity10: number,
  bidLiquidityAll: number,
  askLiquidity1: number,
  askLiquidity10: number,
  askLiquidityAll: number,
  last: number,
  baseMktCap: number,
  secondMktCap: number
  baseVolume: number,
  secondVolume: number,
  bids: Order[],
  asks: Order[]
}
