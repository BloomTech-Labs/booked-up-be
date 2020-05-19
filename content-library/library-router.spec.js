const library = require("../content-library/library-model");
// const request = require("supertest");

describe.skip("Get /", () => {
  //   it("should return 200", async () => {
  //     const res = await request(library).get("/");
  //     expect(res.status).toBe(200);
  //   });

  //   it("should return JSON", async () => {
  //     const res = await request(library).get("/");
  //     expect(res.type).toBe("application/json");
  //   });
  it("get", async () => {
    const res = await library.find();
    expect(res).toHaveLength(1);
  });
});
