import { ReducerStore } from "src/app/utils/reducer-store/reducer-store";
import { LogoStoreState } from "./logo.store.state";
import { LogoForwardReducer } from "./reducers/logo-forward.reducer";

export class LogoStore extends ReducerStore<LogoStoreState>{
  constructor(
    private forwardReducer: LogoForwardReducer
  ){
    super(new LogoStoreState());
  }

  executeCommand(command: string) {
    if(command==='FD 100'){
      this.forwardReducer.reduce(this.state, ['100']);
    }
  }
}
