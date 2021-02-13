export abstract class Reducer<T,S>{
  abstract reduce(state: T, params: S): T;
}
