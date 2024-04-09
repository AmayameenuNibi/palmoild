import express from 'express';
import {
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory,
    getCategoryCompanies,
    getCategoriesWithCompanies 
  } from '../controllers/categoryController.js';
  
const router = express.Router();

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/categories-companies', getCategoriesWithCompanies);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:categoryName', getCategoryCompanies);


export default router;
