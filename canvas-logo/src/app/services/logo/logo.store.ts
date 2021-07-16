import { Injectable } from "@angular/core";
import { ReducerStore } from "src/app/utils/reducer-store/reducer-store";
import { LogoStoreState } from "./logo.store.state";
import { ExecuteCommandReducer } from "./reducers/execute-command.reducer";
import { LogoForwardReducer } from "./reducers/logo-forward.reducer";
import { LogoPenDownReducer } from "./reducers/logo-pen-down.reducer";
import { LogoPenUpReducer } from "./reducers/logo-pen-up.reducer";
import { LogoRepeatReducer } from "./reducers/logo-repeat.reducer";
import { LogoRightReducer } from "./reducers/logo-right.reducer";
import { RegisterNativeCommandReducer } from "./reducers/register-native-command.reducer";

@Injectable()
export class LogoStore extends ReducerStore<LogoStoreState>{
  constructor(
    private registerNativeCommandReducer: RegisterNativeCommandReducer,
    private executeCommandReducer: ExecuteCommandReducer,
    private forwardReducer: LogoForwardReducer,
    private rightReducer: LogoRightReducer,
    private repeatReducer: LogoRepeatReducer,
    private penUpReducer: LogoPenUpReducer,
    private penDownReducer: LogoPenDownReducer,
  ){
    super(new LogoStoreState());
    this.reduce(this.registerNativeCommandReducer,{commandName: 'FD', commandReducer: this.forwardReducer, numArgs: 1});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'RT', commandReducer: this.rightReducer, numArgs: 1});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'REPEAT', commandReducer: this.repeatReducer, numArgs: 2});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'PU', commandReducer: this.penUpReducer, numArgs: 0});
    this.reduce(this.registerNativeCommandReducer,{commandName: 'PD', commandReducer: this.penDownReducer, numArgs: 0});

    this.executeCommand('TO LT :ANGLE RT -:ANGLE END');
    this.executeCommand('TO BK :DISTANCE FD -:DISTANCE END');
  }

  executeCommand(command: string) {
    this.reduce(this.executeCommandReducer, command)
  }
}
