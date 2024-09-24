const express = require('express');
const bodyParser = require('body-parser');
const client = require('./connection');
const app = express();

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

app.listen(3100, () => {
  console.log('Server running on port 3100');
});

client.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Get all books
app.get('/books', (req, res) => {
  client.query('SELECT * FROM books', (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.status(500).send(err.message);
    }
  });
});

// Insert a new book
app.post('/books', (req, res) => {
  const { title, description, author } = req.body;

  // Use parameterized query to prevent SQL injection
  const query = `INSERT INTO books(title, description, author) VALUES($1, $2, $3)`;
  const values = [title, description, author];

  client.query(query, values, (err, result) => {
    if (!err) {
      res.send('Insert Success');
    } else {
      res.status(500).send(err.message);
    }
  });
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
  const { title, description, author } = req.body;
  const { id } = req.params;

  // Use parameterized query to prevent SQL injection
  const query = `UPDATE books SET title = $1, description = $2, author = $3 WHERE id = $4`;
  const values = [title, description, author, id];

  client.query(query, values, (err, result) => {
    if (!err) {
      res.send('Update Success');
    } else {
      res.status(500).send(err.message);
    }
  });
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;

  // Use parameterized query to prevent SQL injection
  const query = `DELETE FROM books WHERE id = $1`;
  const values = [id];

  client.query(query, values, (err, result) => {
    if (!err) {
      res.send('Delete Success');
    } else {
      res.status(500).send(err.message);
    }
  });
});