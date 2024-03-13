import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; // Import mongoose to convert string IDs to ObjectId
import Company from '../models/company.js';
import Category from '../models/category.js';
import Country from '../models/country.js';
import path from 'path';

const searchCategories = async (searchTerm) => {
  const categories = await Category.aggregate([
    {
      $search: {
        index: 'category_search',
        text: {
          query: searchTerm,
          path: 'name',
        },
      },
    },
    {
      $project: { 
        _id: 1,
        name: 1, },
    },
  ]);
  return categories.map(category => category._id);
};
const searchCountry = async (searchTerm) => {
  const countries = await Country.aggregate([
    {
      $search: {
        index: 'country_search',
        text: {
          query: searchTerm,
          path: 'name',
        },
      },
    },
    {
      $project: { 
        _id: 1,
        name: 1, },
    },
  ]);
  return countries.map(country => country._id);
};

export const searchCompanies = asyncHandler(async (req, res) => {
  const searchTerm = req.query.term;
  let matchingCategoryIds = await searchCategories(searchTerm);
  let matchingCountryIds = await searchCountry(searchTerm);
  matchingCategoryIds = matchingCategoryIds.map(id => mongoose.Types.ObjectId(id));
  matchingCountryIds = matchingCountryIds.map(id => mongoose.Types.ObjectId(id));
  const pipeline = [
    {
      $search: {
        index: 'company_search',
        compound: {
          should: [
            {
              autocomplete: {
                query: searchTerm,
                path: "company",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "profile",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "title",
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    },
    {
      $match: {
        ...(matchingCategoryIds.length ? { category_id: { $in: matchingCategoryIds } } : {}),
        ...(matchingCountryIds.length ? { country_id: { $in: matchingCountryIds } } : {}),
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
        logo: 1,
        country_id: 1,
        website: 1,
        mobile: 1,
        profile: 1,
        title: 1,
        categoryName: { $arrayElemAt: ['$category.name', 0] },
      },
    },
  ];

  const result = await Company.aggregate(pipeline);
  res.json(result);
});



// @desc    Get all countries

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find()
    .populate('category_id', 'name'); // Populate the 'category_id' field with the 'name' field from the Category model

  const formattedCompanies = companies.map(company => ({
    _id: company._id,
    company: company.company,
    company_slug: company.company_slug,
    logo:company.logo,
    country_id:company.country_id,
    website:company.website,
    mobile:company.mobile,
    profile:company.profile,
    title:company.title,
    categoryName: company.category_id.name // Access the name field from the populated category
  }));

  res.json(formattedCompanies);
});


// @desc    Create a new Company
export const createCompany = asyncHandler(async (req, res) => {
  const {
      user_id,
      company,
      category_id,
      country_id,
      website,
      mobile,
      profile,
      title,
      site_id,
      address,
      description,
      status,
      facebook_url,
      twitter_url,
      linkedin_url,
      insta_url,
      brochure_url,
      featured,
  } = req.body;
  const companies = await Company.findOne({ company: company });
  if (companies) {
    res.status(400);
    throw new Error("company already exists");
  }
  try {    
      const newCompany = new Company({
          user_id,
          company,
          category_id,
          country_id,
          logo: req.file ? extractFileName(req.file.path) : '',
          website,
          mobile,
          profile,
          title,
          site_id,
          address,
          description,
          status,
          facebook_url,
          twitter_url,
          linkedin_url,
          insta_url,
          brochure_url,
          featured,
          company_slug: convertToUrlFormat(company),
      });

      await newCompany.save();
      res.json(newCompany);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// @desc    Update a company
export const updateCompany = asyncHandler(async (req, res) => {
    try {
        const companyId = req.params.id;

        const {
            company,
            category_id,
            country_id,
            website,
            mobile,
            profile,
            title,
            site_id,
            address,
            description,
            status,
            facebook_url,
            twitter_url,
            linkedin_url,
            insta_url,
            brochure_url,
            featured,
        } = req.body;

        const updateFields = {
            company,
            category_id,
            country_id,
            website,
            mobile,
            profile,
            title,
            site_id,
            address,
            description,
            status,
            facebook_url,
            twitter_url,
            linkedin_url,
            insta_url,
            brochure_url,
            featured,
            company_slug:convertToUrlFormat(company),
        };

        if (req.file) {
          updateFields.logo = extractFileName(req.file.path);
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            updateFields,
            { new: true }
        );

        if (!updatedCompany) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }

        res.json(updatedCompany);
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



function extractFileName(filePath) {
    return path.basename(filePath);
}
function convertToUrlFormat(name) {
  if (!name) {
      return ''; 
  }
  name = ''.concat(name).toLowerCase(); 
  name = name.replace(/[^\w\s]/gi, ''); 
  name = name.replace(/\s+/g, '-'); 
  return name;
}

// @desc    Delete a company
export const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      await company.deleteOne();  // Use deleteOne instead of remove
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ error: 'company not found' });
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sample implementation in the server-side controller
export const getCompanyDetails = async (req, res) => {
  try {
    const companyName = req.params.companyName;
    const company = await Company.findOne({ company_slug: companyName })
      .populate('category_id', 'name')
      .populate('country_id', 'name'); // Populate the 'country_id' field with the 'name' field from the Country model

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }    
    const companyDetails = {
      _id: company._id,
      company: company.company,
      company_slug: company.company_slug,
      logo: company.logo,
      country_id: company.country_id,
      website: company.website,
      mobile: company.mobile,
      address: company.address,
      description: company.description,
      status: company.status,
      date_added: company.date_added,
      facebook_url: company.facebook_url,
      twitter_url: company.twitter_url,
      linkedin_url: company.linkedin_url,
      insta_url: company.insta_url,
      brochure_url: company.brochure_url,
      profile: company.profile,
      title: company.title,
      categoryName: company.category_id.name,
      countryName: company.country_id.name // Access the name field from the populated country
    };

    res.status(200).json(companyDetails);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getSingleCompanyDetails = async (req, res) => {
  try {
    const userID = req.params.userID;
    const company = await Company.findOne({ user_id: userID });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSingleCompanies = async (req, res) => {
  try {
    const userID = req.params.companyId;
    const company = await Company.findOne({ _id: userID });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





