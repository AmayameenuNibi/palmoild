import asyncHandler from 'express-async-handler';
import Country from '../models/country.js';
import Company from '../models/company.js';
import Category from '../models/category.js';

// @desc    Get all countries
export const getCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find();
  res.json(countries);
});

// @desc    Create a new country
export const createCountry = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const country = await Country.create({
    name,
  });

  if (country) {
    res.status(201).json(country);
  } else {
    res.status(400);
    throw new Error('Invalid country data');
  }
});

// @desc    Delete a country
export const deleteCountry = asyncHandler(async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (country) {
      await country.deleteOne();  // Use deleteOne instead of remove
      res.json({ message: 'Country removed' });
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// @desc    Update a country
export const updateCountry = asyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      { $set: { name } },
      { new: true, runValidators: true }
    );
    if (updatedCountry) {
      res.json(updatedCountry);
    } else {
      res.status(404);
      throw new Error('Country not found');
    }
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(400).json({ error: error.message });
  }
});

export const getCountryCompanies = async (req, res) => {
  try {
    const countryName = req.params.countryName;
    const country = await Country.findOne({ name: countryName });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const companies = await Company.find({ country_id: country._id })
      .populate('category_id', 'name'); // Populate the 'category_id' field with the 'name' field from the Category model

    const formattedCompanies = companies.map(company => ({
      _id: company._id,
      name: company.company,
      company_slug: company.company_slug,
      categoryName: company.category_id.name // Access the name field from the populated category
    }));
    res.status(200).json(formattedCompanies);
  } catch (error) {
    console.error('Error fetching companies in category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





