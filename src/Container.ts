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
    const lifetime = this.getLifetime(target);

    if (lifetime === "scoped") {
      return this.resolveFromRegistry(target, this.registry) as T;
    }

    if (lifetime === "singleton") {
      return this.resolveFromRegistry(target, Container.globalRegistry) as T;
    }

    // Resolve as transient for undefined lifetime
    return this.resolveTransient(target);
  }

  private getLifetime(target: Constructor): Lifetime {
    const lifetime = Reflect.getMetadata(LIFETIME_METADATA_KEY, target);

    return lifetime;
  }

  private resolveTransient<T>(target: Constructor<T>): T {
    const types: any[] = Reflect.getMetadata("design:paramtypes", target) ?? [];
    const args = types.map((type) => this.resolve(type));

    return new target(...args);
  }

  private resolveFromRegistry(
    target: Constructor,
    registry: Registry
  ): unknown {
    let instance = registry.get(target);

    if (instance === undefined) {
      instance = this.resolveTransient(target);
      registry.set(target, instance);
    }

    return instance;
  }
}
