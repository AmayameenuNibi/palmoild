import CMS from '../models/cms.js';

// Create a new category
export const fetchCms = async (req, res) => {
    try {
        const cmsData = await CMS.find();
        res.json(cmsData);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Get all categories
export const createCms  = async (req, res) => {
    const cms = new CMS(req.body);
    try {
      const newCMS = await cms.save();
      res.status(201).json(newCMS);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};


// Update a category
export const updateCms = async (req, res) => {
    try {
        const updatedCMS = await CMS.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCMS);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a category
export const deleteCms = async (req, res) => {
    try {
        await CMS.findByIdAndDelete(req.params.id);
        res.json({ message: 'CMS entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

