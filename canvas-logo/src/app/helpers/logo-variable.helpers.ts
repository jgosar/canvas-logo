import { LogoStoreState } from "../services/logo/logo.store.state";
import { LogoVariable2 } from "../services/logo/types/logo-variable-2";
import { NativeVariable2 } from "../services/logo/types/native-variable-2";
import { isDefined } from "./common.helpers";

export function evaluateArgument(state: LogoStoreState, argument: string): string {
    if (argument.startsWith('\'')) {
      return getVariableValue(state, argument.substring(1)).toString();
    } else if (argument.includes(' ')) {
      return argument;
    } else {
      return `${eval(argument)}`;
    }
  }

  function getVariableValue(state: LogoStoreState, variableName: string): number {
    variableName = variableName.toUpperCase();
    const variable: LogoVariable2 | NativeVariable2 | undefined = state.variables[variableName];
    if (variable === undefined) {
      throw new Error('Variable ' + variableName + ' does not exist!');
    } else if (isNativeVariable(variable)) {
      return (<NativeVariable2>variable).valueGetter(state);
    } else {
      return (<LogoVariable2>variable).value;
    }
  }

  function isNativeVariable(variable: NativeVariable2 | LogoVariable2): variable is NativeVariable2 {
    return isDefined(variable['valueGetter']);
  }
  