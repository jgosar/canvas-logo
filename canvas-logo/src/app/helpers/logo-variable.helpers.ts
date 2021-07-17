import { LogoStoreState } from '../services/logo/logo.store.state';
import { LogoVariable } from '../services/logo/types/logo-variable';
import { isDefined } from './common.helpers';

export function evaluateArgument(state: LogoStoreState, argument: string): string {
  if (argument.startsWith("'")) {
    return getVariableValue(state, argument.substring(1)).toString();
  } else if (argument.includes(' ')) {
    return argument;
  } else {
    // eslint-disable-next-line no-eval
    return `${eval(argument)}`;
  }
}

function getVariableValue(state: LogoStoreState, variableName: string): number {
  const variable: LogoVariable = state.variables[variableName];
  if (variable === undefined) {
    throw new Error('Variable ' + variableName + ' does not exist!');
  } else if (isDefined(variable.valueGetter)) {
    return variable.valueGetter(state);
  } else {
    return variable.value;
  }
}
