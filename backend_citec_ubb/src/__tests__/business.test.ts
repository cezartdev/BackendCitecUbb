import request from "supertest";
import server from "../server";
import db from "../config/db";


describe("GET /api/business/get-all",  () => {

    // Mockear console.log antes de cada test
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    
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

    // Restaurar console.log después de cada test
    afterEach(() => {
        jest.restoreAllMocks();
    });
    // Cerrar la conexión de la base de datos
    afterAll(async () => {
            
        await db.end();
    });
    
})


describe("GET /api/business/get-by-id/77.123.456-7",  () => {

    // Mockear console.log antes de cada test
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    
    
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
        expect(Array.isArray(res.body.response)).toBe(true)

        let isObject = true;
        res.body.response.forEach(element => {
            if(typeof element !== "object"){
                isObject = false;
            }
        });
        
        expect(isObject).toBe(true);
    })

    // Restaurar console.log después de cada test
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Cerrar la conexión de la base de datos
    afterAll(async () => {
            
        await db.end();
    });
    
})

