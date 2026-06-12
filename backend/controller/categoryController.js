const Category = require('../model/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    
    // If no categories in DB, return default data with MongoDB compatible format
    if (categories.length === 0) {
      const defaultCategories = [
        {
          _id: '1',
          name: 'Adventure Tours',
          description: 'Trekking & hiking',
          image1: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
          packageCount: 12
        },
        {
          _id: '2',
          name: 'Family Trips',
          description: 'Fun for everyone',
          image1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
          packageCount: 18
        },
        {
          _id: '3',
          name: 'Honeymoon Packages',
          description: 'Romantic getaways',
          image1: 'https://images.unsplash.com/photo-1519659528534-7fd73f9311a5?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
          packageCount: 15
        },
        {
          _id: '4',
          name: 'Beach Vacations',
          description: 'Sun & sand fun',
          image1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
          packageCount: 20
        },
        {
          _id: '5',
          name: 'Hill Station Tours',
          description: 'Mountain escapes',
          image1: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
          packageCount: 14
        },
        {
          _id: '6',
          name: 'Cultural Tours',
          description: 'Heritage & history',
          image1: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&q=80',
          packageCount: 10
        },
        {
          _id: '7',
          name: 'Luxury Experiences',
          description: 'Premium travel',
          image1: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
          image2: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
          packageCount: 16
        }
      ];
      return res.json(defaultCategories);
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single category by name
exports.getCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ 
      name: { $regex: new RegExp(name, 'i') },
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create category (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image1, image2, packageCount, order } = req.body;
    
    const category = new Category({
      name,
      description,
      image1,
      image2,
      packageCount,
      order
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update category (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete category (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};