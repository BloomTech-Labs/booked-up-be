const db = require("../data/dbConfig.js");
const Agents = require("./agent-model");

describe("agents model", () => {
  describe("insert", () => {
    it("should insert the provided agent info into the db", async () => {
      await Agents.add({
        agent_type: "mathew",
        agency_name: "herm",
        agency_address: "Herman16&",
        agency_phone_number: "1 866 848 9876",
        agency_email: "herm7@gmail.com",
        user_id: "22",
      });

      const users = await db("agent_info");
      expect(users).toHaveLength(1);
    });

    it("should return the inserted agent info", async () => {
      const agent = await Agents.add({
        agent_type: "mathew",
        agency_name: "herm",
        agency_address: "Herman16&",
        agency_phone_number: "1 866 848 9876",
        agency_email: "herm7@gmail.com",
        user_id: "22",
      });
      expect(agent.agency_name).toBe("herm");
    });
  });

  describe("get", () => {
    it("get", async () => {
      const res = await Agents.find();
      expect(res).toHaveLength(2);
    });
    it("find agent by Id", async () => {
      const res = await Agents.findById(1);
      expect(res).toEqual(expect.anything());
    });
    it("find agent by email", async () => {
      const res = await Agents.findByAgentInfoId(22);
      expect(res).toEqual(expect.anything());
    });
  });

  describe("remove", () => {
    it("should remove the agent info from the db", async () => {
      await Agents.remove(18);

      const users = await db("agent_info");
      expect(users).toHaveLength(7);
    });
  });

  describe("update", () => {
    it("should update the agent from the db", async () => {
      const agent = await Agents.update(
        22,
        {
          agent_type: "mathew",
          agency_name: "Christian",
          agency_address: "Herman16&",
          agency_phone_number: "1 866 848 9876",
          agency_email: "herm7@gmail.com",
          user_id: "22",
        },
        24
      );

      expect(agent.agency_name).toBe("Christian");
    });
  });
});

// beforeEach(async () => {
//   await db("users").truncate();
// });
