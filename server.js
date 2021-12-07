const e = require('express');
const express = require('express');
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Password123',
        database: 'election'
    },
    console.log('Connected to the election database.')
);


app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});


app.post('/api/candidates/', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

app.delete('/api/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!results.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: results.affectedRows,
                id: req.params.id
            });
        }
    })
})

//Select Everyone from candidates and log the rows
//db.query(`SELECT * FROM candidates`, (err, rows) => {
//    console.log(rows)
//})

//Select candidate with ID of 1
//db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log(row)
//    }
//})

//Delete a candidate
//db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log(result)
//    }
//})

//Create a candidate
//const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;
//const params = [1, 'Ronald', 'Firbank', 1];

//db.query(sql, params, (err, results) => {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log(results);
//    }
//})

app.use((req, res) => {
    res.status(404).end();
    console.log(`404 Error`)
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});