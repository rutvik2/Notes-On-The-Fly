const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Using GET request to fetch notes of an user at api/notes/fetchnotes
router.get('/fetchnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Encountered some internal server error');
  }
});

//ROUTE 2: Using POST request to add notes of an user to database at api/notes/addnote
router.post(
  '/addnote',
  fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //To return errors upon validation using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //Saving note into database
      const { title, description, tags } = req.body;
      const note = new Note({
        title,
        description,
        tags,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Encountered some internal server error');
    }
  }
);

//ROUTE 3: Using PUT request to update notes of an user to database at api/notes/updatenote/:id
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    //creating a new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tags) {
      newNote.tags = tags;
    }

    //fetching the current note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Not Found');
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Encountered some internal server error');
  }
});

//ROUTE 4: Using DELETE request to delete note of an user at api/notes/deletenote/:id
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    //fetching the current note to be deleted
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Not Found');
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.send({ Success: 'Node has been deleted', note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Encountered some internal server error');
  }
});

module.exports = router;
