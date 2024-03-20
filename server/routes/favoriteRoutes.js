import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    addFavorite,
    deleteFavorite,
    checkFavorite,
} from '../controllers/favoriteController.js';

const router = express.Router();

// Routes for countries
router.post('/add/:id/:userid', addFavorite);
router.delete('/delete/:id/:userid', deleteFavorite);
router.get('/check/:id/:userid', checkFavorite);

export default router;
