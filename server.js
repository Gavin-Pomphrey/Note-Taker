//import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

//create express app
const app = express();

//set port
const PORT = process.env.PORT || 3000;

//set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//define paths
const notesPath = path.join(__dirname, 'db/db.json');
const indexPath = path.join(__dirname, 'public/index.html');

//define routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(notesPath, '/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(notesPath, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.get('/api/notes/:id', (req, res) => {
    fs.readFile(notesPath, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data)[req.params.id]);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(notesPath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: notes.length
        };
        notes.push(newNote);
        fs.writeFile(notesPath, JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(notesPath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNotes = notes.filter(note => note.id != req.params.id);
        fs.writeFile(notesPath, JSON.stringify(newNotes), (err) => {
            if (err) throw err;
            res.json(newNotes);
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(indexPath, 'public/index.html'));
});

//start server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
