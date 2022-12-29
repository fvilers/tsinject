import { Container, lifetime } from "../src";

describe("Container", () => {
  describe("resolve()", () => {
    let container: Container;

    beforeEach(() => {
      container = new Container();
    });

    it("should return an instance of a class", () => {
      class Foo {}

      expect(container.resolve(Foo)).toBeInstanceOf(Foo);
    });

    it("should return an instance of a class that has an injectable parameter in its constructor", () => {
      class Foo {}
      class Bar {
        readonly name = "Bar";

        constructor(_: Foo) {}
      }

      expect(container.resolve(Bar)).toBeInstanceOf(Bar);
    });

    it("should return a new instance on each resolve for undefined lifetime", () => {
      class Foo {}

      expect(container.resolve(Foo)).not.toBe(container.resolve(Foo));
    });

    it("should return a new instance on each resolve for transient lifetime", () => {
      @lifetime("transient")
      class Foo {}

      expect(container.resolve(Foo)).not.toBe(container.resolve(Foo));
    });

    it("should return the same instance on each resolve for scoped lifetime", () => {
      @lifetime("scoped")
      class Foo {}

      expect(container.resolve(Foo)).toBe(container.resolve(Foo));
    });

    it("should return the same instance on each resolve on a different scope for scoped lifetime", () => {
      @lifetime("scoped")
      class Foo {}

      const scoped = container.createScope();

      expect(scoped.resolve(Foo)).toBe(scoped.resolve(Foo));
    });

    it("should return the a new instance if resolved on a different scope for scoped lifetime", () => {
      @lifetime("scoped")
      class Foo {}

      expect(container.createScope().resolve(Foo)).not.toBe(
        container.resolve(Foo)
      );
    });

    it("should return the same instance on each resolve for singleton lifetime", () => {
      @lifetime("singleton")
      class Foo {}

      expect(container.resolve(Foo)).toBe(container.resolve(Foo));
    });
  });
});
