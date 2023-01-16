The is a bookstore API made in Node.js. Requests include GET, GET(all), POST, PUT, and DELETE. The API uses a SQL database. It uses jsonschema to ensure errors return when user input is invalid. The project includes Jest testing for the routes. Examples syntax for routes is below.

(GET) localhost:3000/books

(GET) localhost:3000/books/0691161518

(POST) localhost:3000/
{ 
    book : {
        "isbn": "0063226618",
        "amazon_url": "http://a.co/testbook",
        "author": true,
        "language": "english",
        "pages": 315,
        "publisher": "Amistad",
        "title": "Wade In The Water: A Novel",
        "year": 2023
    }
}

(PUT) localhost:3000/0691161518
{
    book : {
        "isbn": '0691161518', 
        "amazon_url": 'http://a.co/eobPtX2', 
        "author": 'Matthew Lane', 
        "language": 'english', 
        "pages": 264, 
        "publisher": 'Princeton University Press', 
        "title": 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
        "year": 2017
    }
}

(DELETE) localhost:3000/0691161518