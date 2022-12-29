export const LIFETIME_METADATA_KEY = "tsinject-lifetime";
export type Lifetime = "transient" | "scoped" | "singleton";

export function lifetime(value: Lifetime): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(LIFETIME_METADATA_KEY, value, target);
  };
}
