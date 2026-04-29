const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const { search, subject } = req.query;
    const filter = { userId: req.user._id };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const resources = await Resource.find(filter).sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createResource = async (req, res) => {
  try {
    // If it's a file, req.body.data will hold the base64 string
    const resource = await Resource.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resource) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resource) return res.status(404).json({ success: false, message: 'Not found' });
    resource.isPinned = !resource.isPinned;
    await resource.save();
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
