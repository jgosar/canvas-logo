import { Injectable } from "@angular/core";
import { ReducerStore } from "src/app/utils/reducer-store/reducer-store";
import { LogoStoreState } from "./logo.store.state";
import { ExecuteCommandReducer } from "./reducers/execute-command.reducer";
import { LogoForwardReducer } from "./reducers/logo-forward.reducer";
import { LogoRepeatReducer } from "./reducers/logo-repeat.reducer";
import { LogoRightReducer } from "./reducers/logo-right.reducer";
import { RegisterLogoCommandReducer } from "./reducers/register-logo-command.reducer";
import { RegisterNativeCommandReducer } from "./reducers/register-native-command.reducer";

@Injectable()
export class LogoStore extends ReducerStore<LogoStoreState>{
  constructor(
    private registerNativeCommandReducer: RegisterNativeCommandReducer,
    private registerLogoCommandReducer: RegisterLogoCommandReducer,
    private executeCommandReducer: ExecuteCommandReducer,
    private forwardReducer: LogoForwardReducer,
    private rightReducer: LogoRightReducer,
    private repeatReducer: LogoRepeatReducer,
  ){
    super(new LogoStoreState());
    this.reduce(this.registerNativeCommandReducer,{commandName: 'FD', commandReducer: this.forwardReducer, numArgs: 1});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'RT', commandReducer: this.rightReducer, numArgs: 1});
    this.reduce(this.registerLogoCommandReducer,{commandName: 'LT', logoStatements: 'RT -@ARG0@', numArgs: 1});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'REPEAT', commandReducer: this.repeatReducer, numArgs: 2});
  }

  executeCommand(command: string) {
    this.reduce(this.executeCommandReducer, command)
  }
}
