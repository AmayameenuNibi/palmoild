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
    const categories = await Category.find().sort({ name: 1 }).lean();
    if (categories.length === 0) {
      return res.status(404).json({ error: 'No categories found' });
    }
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getCategoryCompanies = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $match: {
          "category.name": categoryName 
        }
      },
      {
        $project: {
          _id: 1,
          company: 1,
          company_slug: 1,
        }
      },
      {
        $sort: {
          company: 1 // Sort by company name in ascending order
        }
      }
    ];
    const companies = await Company.aggregate(pipeline);
    const shuffledCompanies = shuffle(companies);
    if (companies.length === 0) {
      return res.status(404).json({ error: 'No companies found in this category' });
    }
    res.status(200).json(shuffledCompanies);
  } catch (error) {
    console.error('Error fetching companies in category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

