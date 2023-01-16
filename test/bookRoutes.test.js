process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

describe("Book Routes Test", () => {

    beforeEach(async () => {
        await db.query(
            `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
            VALUES (
                '0691161518', 
                'http://a.co/eobPtX2', 
                'Matthew Lane', 
                'english', 
                264, 
                'Princeton University Press', 
                'Power-Up: Unlocking the Hidden Mathematics in Video Games',
                2017
            ) RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`
        )
    });

    afterEach(async () => {
        await db.query(`DELETE FROM books`);
    });

    afterAll(async () => {
        await db.end();
    });
});

describe("GET /books", () => {
    test("GET a list of all books", async () => {
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
    });
});