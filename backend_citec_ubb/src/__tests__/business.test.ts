import request from "supertest";
import server from "../server";
import db from "../config/db";
// Mockear console.log antes de cada test
beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

describe("GET /api/business/get-all",  () => {
    
    it("Deberia devolver una respuesta en json", async () => {
        const res = await request(server).get("/api/business/get-all")
        expect(res.headers["content-type"]).toMatch(/json/)
    })
    it("El estado de la respuesta debe ser 200", async () => {
        const res = await request(server).get("/api/business/get-all")
        expect(res.status).toBe(200)
    })

    it("Devuelve un mensaje y es de tipo string", async () => {
        const res = await request(server).get("/api/business/get-all")
        expect(typeof res.body.msg === "string").toBe(true)
    })

    it("La respuesta es un arreglo de objetos", async () => {
        const res = await request(server).get("/api/business/get-all")
        expect(Array.isArray(res.body.response)).toBe(true)

        let isObject = true;
        res.body.response.forEach(element => {
            if(typeof element !== "object"){
                isObject = false;
            }
        });
        
        expect(isObject).toBe(true);
    })

    
})


describe("GET /api/business/get-by-id/77.123.456-7 (Correcto)",  () => {
    
    it("Deberia devolver una respuesta en json", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-7")
        expect(res.headers["content-type"]).toMatch(/json/)
    })
    it("El estado de la respuesta debe ser 200", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-7")
        expect(res.status).toBe(200)
    })

    it("Devuelve un mensaje y es de tipo string", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-7")
        expect(typeof res.body.msg === "string").toBe(true)
    })

    it("La respuesta es un objeto", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-7")
        expect(typeof res.body.response === "object").toBe(true)

    })
    
})

describe("GET /api/business/get-by-id/ (Errores)",  () => {
    
    it("Deberia devolver una respuesta en json", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-")
        expect(res.headers["content-type"]).toMatch(/json/)
    })
    it("El estado de la respuesta debe ser 400", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-")
        expect(res.status).toBe(400)
    })

    it("La respuesta es un arreglo", async () => {
        const res = await request(server).get("/api/business/get-by-id/77.123.456-")
        expect(Array.isArray(res.body.errors)).toBe(true)
    })
    
})

// Cerrar la conexión de la base de datos
afterAll(async () => {
            
    await db.end();
});
// Restaurar console.log después de cada test
afterEach(() => {
    jest.restoreAllMocks();
});
