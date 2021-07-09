import { Injectable } from "@angular/core";
import { ReducerStore } from "src/app/utils/reducer-store/reducer-store";
import { LogoStoreState } from "./logo.store.state";
import { ExecuteCommandReducer } from "./reducers/execute-command.reducer";
import { LogoForwardReducer } from "./reducers/logo-forward.reducer";
import { LogoRightReducer } from "./reducers/logo-right.reducer";
import { RegisterNativeCommandReducer } from "./reducers/register-native-command.reducer";

@Injectable()
export class LogoStore extends ReducerStore<LogoStoreState>{
  constructor(
    private registerNativeCommandReducer: RegisterNativeCommandReducer,
    private executeCommandReducer: ExecuteCommandReducer,
    private forwardReducer: LogoForwardReducer,
    private rightReducer: LogoRightReducer,
  ){
    super(new LogoStoreState());
    this.reduce(this.registerNativeCommandReducer,{commandName: 'FD', commandReducer: this.forwardReducer, numArgs: 1});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'RT', commandReducer: this.rightReducer, numArgs: 1});
  }

  executeCommand(command: string) {
    this.reduce(this.executeCommandReducer, command.split(' '))
  }
}
