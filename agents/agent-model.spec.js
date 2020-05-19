const db = require("../data/dbConfig.js");
const Agents = require("./agent-model");

describe("agents model", () => {
  describe("insert", () => {
    it("should insert the provided users into the db", async () => {
      await Agents.add({
        agent_type: "mathew",
        agency_name: "herm",
        agency_address: "Herman16&",
        agency_phone_number: "1 866 848 9876",
        agency_email: "herm7@gmail.com",
        user_id: "22",
      });

      const users = await db("agent_info");
      expect(users).toHaveLength(4);
    });

    //     it("should return the inserted agent", async () => {
    //       const agent = await Agents.add({
    //         first_name: "mathew1",
    //         last_name: "herm",
    //         password: "Herman16&",
    //         email: "herm8@gmail.com",
    //         user_type: "author",
    //       });
    //       expect(agent.last_name).toBe("herm");
    //     });
    //   });

    //   describe("get", () => {
    //     it("get", async () => {
    //       const res = await Agents.find();
    //       expect(res).toHaveLength(1);
    //     });
    //     it("find agent by Id", async () => {
    //       const res = await Agents.findById(2);
    //       expect(res).toEqual(expect.anything());
    //     });
    //     it("find agent by email", async () => {
    //       const res = await Agents.findByEmail("herm@gmail.com");
    //       expect(res).toEqual(expect.anything());
    //     });
    //     it("find agent by display name", async () => {
    //       const res = await Agents.findByDisplayName("herm");
    //       expect(res).toEqual(expect.anything());
    //     });
    //   });

    //   describe("remove", () => {
    //     it("should remove the agent from the db", async () => {
    //       await Agents.removeUser(1);

    //       const users = await db("users");
    //       expect(users).toHaveLength(2);
    //     });
    //   });

    //   describe("update", () => {
    //     it("should update the agent from the db", async () => {
    //       const agent = await Agents.update(2, {
    //         first_name: "Christian",
    //         last_name: "herm",
    //         password: "Herman16&",
    //         email: "herm1@gmail.com",
    //         user_type: "agent",
    //         display_name: "herm",
    //       });

    //       expect(agent.first_name).toBe("Christian");
    //     });
  });
});
