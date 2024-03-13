import Category from '../models/category.js';
import Company from '../models/company.js';

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { site_id, name } = req.body;
    const newCategory = new Category({ site_id, name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { site_id, name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { site_id, name },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCategoryCompanies = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const companies = await Company.find({ category_id: category._id });
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies in category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




