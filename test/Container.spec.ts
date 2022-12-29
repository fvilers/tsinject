import { Container } from "../src";

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
  });
});
