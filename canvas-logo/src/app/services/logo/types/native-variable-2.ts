import { LogoStoreState } from "../logo.store.state";

export interface NativeVariable2{
  valueGetter: (state: LogoStoreState)=>number;
}
