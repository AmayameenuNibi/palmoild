import express from "express";
import auth from '../middleware/authMiddleware.js';
import Favorite from "../models/favorite.js";
const router = express.Router();

// Add a company to favorites
router.post('/add', auth, async (req, res) => {
  try {
    const { companyId } = req.body;
    const favorite = new Favorite({
      user: req.user.id,
      company: companyId
    });
    await favorite.save();
    res.status(201).send();
  } catch (error) {
    console.error('Error adding company to favorites:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Remove a company from favorites
router.delete('/remove/:id', auth, async (req, res) => {
  try {
    await Favorite.findOneAndRemove({ user: req.user.id, company: req.params.id });
    res.send();
  } catch (error) {
    console.error('Error removing company from favorites:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
