import { hello } from "../src";

describe("hello()", () => {
  it("should return a string", () => {
    expect(hello()).toBe("Hello, world!");
  });
});
