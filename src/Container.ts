import "reflect-metadata";
import { Constructor } from "./Constructor";

export class Container {
  resolve<T>(target: Constructor<T>): T {
    const types: any[] = Reflect.getMetadata("design:paramtypes", target) ?? [];
    const args = types.map((type) => this.resolve(type));

    return new target(...args);
  }
}
