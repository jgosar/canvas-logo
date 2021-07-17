import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";

export interface CodeBlock2 {
  reducer?: Reducer<LogoStoreState, string[]>;
  commandText?: string;
  numArgs?: number;
  terminatedBy?: string;
  skipArgsEvaluation?: true;
}