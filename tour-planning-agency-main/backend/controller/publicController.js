const Destination = require('../model/Destination');
const { Blog } = require('../model/Blog');
const { Team, FAQ, Stat } = require('../model/SiteContent');
const ContactMessage = require('../model/ContactMessage');

// Get all destinations
exports.getDestinations = async (req, res) => {
  try {
    const dests = await Destination.find({ active: true });
    res.json(dests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single destination
exports.getDestinationById = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate('author', 'name').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    // increment views
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get team members
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find();
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Stat.find();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit Contact Message
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const newMessage = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
