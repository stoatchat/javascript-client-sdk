// Merge type provided by https://dev.to/lucianbc/union-type-merging-in-typescript-9al
export type Merge<T> =
  & {
    [k in CommonKeys<T>]: PickTypeOf<T, k>;
  }
  & {
    [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
  };

type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? PickType<T, K>
  : never;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: unknown } ? T[K]
  : undefined;

type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T> = Subtract<AllKeys<T>, CommonKeys<T>>;

type AllKeys<T> = T extends unknown ? keyof T : never;
type CommonKeys<T> = keyof T;
