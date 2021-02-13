import { Store } from "rxjs-observable-store";
import { Reducer } from "./reducer";

export abstract class ReducerStore<T extends object> extends Store<T> {
  protected reduce<S>(reducer: Reducer<T, S>, params: S){
    this.setState(reducer.reduce(this.state, params));
  }
}
