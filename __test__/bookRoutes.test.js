process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testBook;
beforeEach(async () => {
  results = await db.query(
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
  );
  testBook = results.rows;
});

afterEach(async () => {
  await db.query(`DELETE FROM books`);
});

afterAll(async () => {
  await db.end();
});

describe("GET /books", () => {
  test("Get a list of all books.", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      books: testBook,
    });
  });
});

describe("GET /books/isbn", () => {
  test("Get a specific book.", async () => {
    const res = await request(app).get(`/books/${testBook[0].isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      book: testBook[0],
    });
  });
});

describe("POST /books", () => {
  test("Add a new book.", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        book: {
          isbn: "0063226618",
          amazon_url: "http://a.co/testbook",
          author: "Nyani Nkrumah",
          language: "english",
          pages: 315,
          publisher: "Amistad",
          title: "Wade In The Water: A Novel",
          year: 2023,
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      book: {
        isbn: "0063226618",
        amazon_url: "http://a.co/testbook",
        author: "Nyani Nkrumah",
        language: "english",
        pages: 315,
        publisher: "Amistad",
        title: "Wade In The Water: A Novel",
        year: 2023,
      },
    });
  });
  test("Error: Add book with incomplete information", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        book: {
          isbn: "0063226618",
          amazon_url: "http://a.co/testbook",
          author: "Nyani Nkrumah",
          language: "english",
          pages: 315,
        },
      });
    expect(res.statusCode).toBe(500);
  });
  test("Error: Add book with invalid information", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        book: {
          isbn: "0063226618",
          amazon_url: "http://a.co/testbook",
          author: true,
          language: "english",
          pages: 315,
          publisher: "Amistad",
          title: "Wade In The Water: A Novel",
          year: 2023,
        },
      });
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: [
        {
          message: ["instance.book.author is not of a type(s) string"],
          status: 400,
        },
      ],
    });
  });
});

describe("PUT /books/:isbn", () => {
  test("Update a book.", async () => {
    const res = await request(app)
      .put(`/books/${testBook[0].isbn}`)
      .send({
        book: {
          isbn: "0691161518",
          amazon_url: "http://amazon.co/eobPtX2",
          author: "Matthew Lane",
          language: "english",
          pages: 264,
          publisher: "Princeton University Press",
          title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          year: 2017,
        },
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161518",
        amazon_url: "http://amazon.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      },
    });
  });
  test("Error: Update book with incomplete information", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        book: {
          isbn: "0063226618",
          amazon_url: "http://a.co/testbook",
          author: "Nyani Nkrumah",
          language: "english",
          pages: 315,
        },
      });
    expect(res.statusCode).toBe(500);
  });
  test("Error: Update book with invalid information", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        book: {
          isbn: "0063226618",
          amazon_url: "http://a.co/testbook",
          author: true,
          language: "english",
          pages: 315,
          publisher: "Amistad",
          title: "Wade In The Water: A Novel",
          year: 2023,
        },
      });
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: [
        {
          message: ["instance.book.author is not of a type(s) string"],
          status: 400,
        },
      ],
    });
  });
});

describe("DELETE /books/isbn", () => {
    test("Delete a book.", async () => {
      const res = await request(app).delete(`/books/${testBook[0].isbn}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message : "Book deleted"
      });
    });
    test("Error: Try to delete book that does not exist.", async () => {
        const res = await request(app).delete(`/books/12345678`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
            error : [{ message : "There is no book with an isbn '12345678", status : 404}]
        });
    });
  });
