import Favorite from "../models/favorite.js";
import asyncHandler from 'express-async-handler';

export const addFavorite = asyncHandler(async (req, res) => {
  const companyId  = req.params.id;
  const userid  = req.params.userid;
  try {
      const favorite = new Favorite({
        user_id: userid,
        company_id: companyId
      });
      await favorite.save();
      res.status(201).send();
  } catch (error) {
      console.error('Error adding company to favorites:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

export const deleteFavorite = asyncHandler(async (req, res) => {
    try {
        await Favorite.findOneAndRemove({ user: req.user.id, company: req.params.id });
        res.send();
    } catch (error) {
        console.error('Error removing company from favorites:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export const checkFavorite = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const userId = req.params.userid;
  try {
    const company = await Favorite.findOne({ user_id: userId, company_id: companyId });
    if (company) {
      res.json({ isFavorite: "favorite" });
    } else {
      res.json({ isFavorite: "not favorite" });
    }
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
});

  