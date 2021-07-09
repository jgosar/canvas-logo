import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";

export interface NativeCodeBlock2 {
  reducer: Reducer<LogoStoreState, string[]>;
  numArgs: number;
}
