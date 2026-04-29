const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const { search, subject } = req.query;
    const filter = { userId: req.user._id };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching notes' });
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching note' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Note created', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, message: 'Note updated', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting note' });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    note.isPinned = !note.isPinned;
    await note.save();
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error toggling pin' });
  }
};
