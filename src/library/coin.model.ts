import {Pair} from "./pair.model";

export interface Coin{
  name: string,
  sumLiquidityAll: number,
  sumLiquidity10: number,
  sumLiquidity1: number,
  sumVolume: number,
  mktCap: number,
  pairs: Pair[]
}
