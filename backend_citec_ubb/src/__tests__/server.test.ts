import request  from "supertest";
import server from "../server";

describe("GET /api", ()=>{
    it("should send back a json response", async ()=>{
        const res = await request(server).post("/api/user/login")

        expect(res.headers["content-type"]).toMatch(/json/)
        expect(res.status).toBe(200)
      
    })
})