import "reflect-metadata";
import { Constructor } from "./Constructor";
import { Lifetime, LIFETIME_METADATA_KEY } from "./Lifetime";

type Registry = Map<Constructor<unknown>, unknown>;

export class Container {
  private registry: Registry = new Map();
  private static globalRegistry: Registry = new Map();

  createScope(): Container {
    return new Container();
  }

  resolve<T>(target: Constructor<T>): T {
    const lifetime = Reflect.getMetadata(
      LIFETIME_METADATA_KEY,
      target
    ) as Lifetime;

    if (lifetime === "scoped") {
      return this.resolveFromRegistry(target, this.registry);
    }

    if (lifetime === "singleton") {
      return this.resolveFromRegistry(target, Container.globalRegistry);
    }

    // Resolve as transient for undefined lifetime
    return this.resolveTransient(target);
  }

  private resolveTransient<T>(target: Constructor<T>): T {
    const types: any[] = Reflect.getMetadata("design:paramtypes", target) ?? [];
    const args = types.map((type) => this.resolve(type));

    return new target(...args);
  }

  private resolveFromRegistry<T>(
    target: Constructor<T>,
    registry: Registry
  ): T {
    let instance = registry.get(target);

    if (instance === undefined) {
      instance = this.resolveTransient(target);
      registry.set(target, instance);
    }

    return instance as T;
  }
}
