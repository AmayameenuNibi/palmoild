import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; // Import mongoose to convert string IDs to ObjectId
import Company from '../models/company.js';
import User from '../models/userModel.js';
import Category from '../models/category.js';
import Country from '../models/country.js';
import path from 'path';
import Staff from '../models/staff.js';

//........Get all Companies............
export const getCompanies = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $lookup: {
        from: 'categories', 
        localField: 'category_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $lookup: {
        from: 'countries', 
        localField: 'country_id',
        foreignField: '_id',
        as: 'country'
      }
    },
    {
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
        address:1,
        logo: 1,
        country_id: 1,
        website: 1,
        mobile: 1,
        address:1,
        facebook_url: 1,
        twitter_url: 1,
        linkedin_url: 1,
        insta_url: 1,
        brochure_url: 1,
        profile: 1,
        title: 1,
        category_id: 1,
        email: 1,
        user_id: 1,
        categoryName: { $arrayElemAt: ['$category.name', 0] },
        countryName: { $arrayElemAt: ['$country.name', 0] },
      }
    },
    {
      $sort: { company: 1 } 
    }
  ];
  const companies = await Company.aggregate(pipeline);
  console.log(".......");
  console.log("hai");
  res.json(companies);
});

export const getCompanyList = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
      }
    },
    {
      $sort: { company: 1 } 
    }
  ];
  const companies = await Company.aggregate(pipeline);
  res.json(companies);
});


//........Create a new Company...........
export const createCompany = asyncHandler(async (req, res) => {
  try {
      const {
          user_id,
          company,
          category_id,
          country_id,
          website,
          mobile,
          email,
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
          staff
      } = req.body;

      const existingCompany = await Company.findOne({ company: company });
      if (existingCompany) {
        return res.status(400).json({ message: "Company already exists" });
      }

      const newCompany = await Company.create({
          user_id,
          company,
          category_id,
          country_id,
          logo: req.file ? extractFileName(req.file.path) : '',
          website,
          mobile,
          email,
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
          company_slug: convertToUrlFormat(company),
      });
      if(staff){
        await Staff.insertMany(staff.map(staffMember => ({
          company_id: newCompany._id,
            ...staffMember
        })));
      }      
      res.status(201).json(newCompany);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//........Update a company.............
export const updateCompany = asyncHandler(async (req, res) => {
    try {
        const companyId = req.params.id;
        const {
            company,
            category_id,
            country_id,
            website,
            mobile,
            email,
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
            staff
        } = req.body;

        const updateFields = {
            company,
            category_id,
            country_id,
            website,
            mobile,
            email,
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
        if(staff){
          await Staff.deleteMany({ company_id: companyId });
          await Staff.insertMany(staff.map(staffMember => ({
              company_id: companyId,
              ...staffMember
          })));
        }
        
        res.json(updatedCompany);
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//.......... Extracting Image name from Path...........
function extractFileName(filePath) {
    return path.basename(filePath);
}

//...........Converting Company name to comany url.......
function convertToUrlFormat(name) {
  if (!name) {
      return ''; 
  }
  name = ''.concat(name).toLowerCase(); 
  name = name.replace(/[^\w\s]/gi, ''); 
  name = name.replace(/\s+/g, '-'); 
  return name;
}

//...........Getting Single Company Data...........
export const getCompanyDetails = asyncHandler(async (req, res) => {
  const companyName = req.params.companyName;  
  const pipeline = [
    {
      $match: { company_slug: companyName }
    },
    {
      $lookup: {
        from: 'categories', 
        localField: 'category_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $lookup: {
        from: 'countries', 
        localField: 'country_id',
        foreignField: '_id',
        as: 'country'
      }
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
        email: 1,
        address: 1,
        description: 1,
        category_id:1,
        status: 1,
        date_added: 1,
        facebook_url: 1,
        twitter_url: 1,
        linkedin_url: 1,
        insta_url: 1,
        brochure_url: 1,
        profile: 1,
        title: 1,
        categoryName: { $arrayElemAt: ['$category.name', 0] }, 
        countryName: { $arrayElemAt: ['$country.name', 0] } 
      }
    }
  ];
  const companyDetails = await Company.aggregate(pipeline);
  if (!companyDetails || companyDetails.length === 0) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.status(200).json(companyDetails[0]);
});

//...........Getting Single Company Data using ID...........
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

//..................Delete a company..................
export const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      await company.deleteOne();  
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ error: 'company not found' });
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//.........Search company from companies list.........
export const searchCompanies = asyncHandler(async (req, res) => {
  const searchTerm = req.query.term;
  const category_id = req.query.category_id;
  const country_id = req.query.country_id;
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
                path: "address",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "mobile",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "category_name",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "country",
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      }
    },
    {
      $lookup: {
        from: 'countries',
        localField: 'country_id',
        foreignField: '_id',
        as: 'country',
      }
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
        facebook_url:1,
        twitter_url:1,
        linkedin_url:1,
        insta_url:1,
        brochure_url:1,
        profile: 1,
        title: 1,
        category_id: 1,
        email:1,
        address:1,
        categoryName: { $arrayElemAt: ['$category.name', 0] },
        countryName: { $arrayElemAt: ['$country.name', 0] },
      },
    },
  ];

  if (searchTerm !== '') {    
    if (category_id !== '' && category_id !== 'All' && country_id !== '' && country_id !== 'All') {
        const categoryIds = category_id.split(',').map(id => id.trim()); 
        const countryIds = country_id.split(',').map(id => id.trim()); 
        const result = await Company.aggregate(pipeline);
        const results = result
            .filter(company => 
                categoryIds.includes(String(company.category_id)) && countryIds.includes(String(company.country_id)))
            .map(company => ({
                _id: company._id,
                company: company.company,
                email:company.email,
                company_slug: company.company_slug,
                logo: company.logo,
                countryName: company.country_id.name,
                website: company.website,
                mobile: company.mobile,
                twitter_url:company.twitter_url,
                facebook_url: company.facebook_url,
                linkedin_url: company.linkedin_url,
                insta_url: company.insta_url,
                brochure_url:company.brochure_url,
                profile: company.profile,
                title: company.title,
                address: company.address,
                categoryName: company.categoryName,
            }));
        res.json(results);
    } else if (country_id !== '' && country_id !== 'All') {
        const result = await Company.aggregate(pipeline);
        const results = result
            .filter(company => country_id.split(',').includes(String(company.country_id)))
            .map(company => ({
                _id: company._id,
                company: company.company,
                email:company.email,
                company_slug: company.company_slug,
                logo: company.logo,
                countryName: company.country_id.name,
                website: company.website,
                mobile: company.mobile,
                twitter_url:company.twitter_url,
                facebook_url: company.facebook_url,
                linkedin_url: company.linkedin_url,
                insta_url: company.insta_url,
                brochure_url:company.brochure_url,
                profile: company.profile,
                title: company.title,
                address: company.address,
                categoryName: company.categoryName,
            }));
        res.json(results);
    } else if (category_id !== '' && category_id !== 'All') {
        const categoryIds = category_id.split(',').map(id => id.trim()); // Split and trim the category_id string into an array
        const result = await Company.aggregate(pipeline);
        const results = result
            .filter(company => categoryIds.includes(String(company.category_id)))
            .map(company => ({
                _id: company._id,
                company: company.company,
                email:company.email,
                company_slug: company.company_slug,
                logo: company.logo,
                countryName: company.country_id.name,
                website: company.website,
                mobile: company.mobile,
                twitter_url:company.twitter_url,
                facebook_url: company.facebook_url,
                linkedin_url: company.linkedin_url,
                insta_url: company.insta_url,
                brochure_url:company.brochure_url,
                profile: company.profile,
                title: company.title,
                address: company.address,
                categoryName: company.categoryName,
            }));
        res.json(results);
    } else { 
        const result = await Company.aggregate(pipeline);
        res.json(result);
    }    
  } else if (category_id !== '' && category_id !== 'All') {
      if (country_id !== '' && country_id !== 'All' && category_id !== '' && category_id !== 'All') {
          const companies = await Company.find({ country_id: { $in: country_id.split(',').map(id => id.trim()) }, category_id: { $in: category_id.split(',').map(id => id.trim()) } })
              .populate('category_id', 'name')
              .populate('country_id', 'name'); 
          const result = companies.map(company => ({
              _id: company._id,
              company: company.company,
              email:company.email,
              company_slug: company.company_slug,
              logo: company.logo,
              countryName: company.country_id.name,
              website: company.website,
              mobile: company.mobile,
              twitter_url:company.twitter_url,
              facebook_url: company.facebook_url,
              linkedin_url: company.linkedin_url,
              insta_url: company.insta_url,
              brochure_url:company.brochure_url,
              profile: company.profile,
              title: company.title,
              address: company.address,
              categoryName: company.category_id.name,
          }));
          res.json(result);
      } else { 
          const companies = await Company.find({ category_id: { $in: category_id.split(',').map(id => id.trim()) } })
              .populate('category_id', 'name')
              .populate('country_id', 'name'); 
          const result = companies.map(company => ({
              _id: company._id,
              company: company.company,
              email:company.email,
              company_slug: company.company_slug,
              logo:company.logo,
              countryName:company.country_id.name,
              website:company.website,
              mobile:company.mobile,
              twitter_url:company.twitter_url,
              facebook_url: company.facebook_url,
              linkedin_url: company.linkedin_url,
              insta_url: company.insta_url,
              brochure_url:company.brochure_url,
              profile:company.profile,
              title:company.title,
              address: company.address,
              categoryName: company.category_id.name,
          }));
          res.json(result);
      }    
  } else if (country_id !== '' && country_id !== 'All') {
      const companies = await Company.find({ country_id: { $in: country_id.split(',').map(id => id.trim()) } })
          .populate('category_id', 'name')
          .populate('country_id', 'name'); 
      const result = companies.map(company => ({
          _id: company._id,
          company: company.company,
          email:company.email,
          company_slug: company.company_slug,
          logo:company.logo,
          countryName:company.country_id.name,
          website:company.website,
          mobile:company.mobile,
          twitter_url:company.twitter_url,
          facebook_url: company.facebook_url,
          linkedin_url: company.linkedin_url,
          insta_url: company.insta_url,
          brochure_url:company.brochure_url,
          profile:company.profile,
          title:company.title,
          address: company.address,
          categoryName: company.category_id.name,
      }));
      res.json(result);
  } else if (country_id === 'All' && category_id === 'All') {
      const companies = await Company.find()
          .populate('category_id', 'name')
          .populate('country_id', 'name'); 
      const result = companies.map(company => ({
          _id: company._id,
          company: company.company,
          email:company.email,
          company_slug: company.company_slug,
          logo:company.logo,
          countryName:company.country_id.name,
          website:company.website,
          mobile:company.mobile,
          twitter_url:company.twitter_url,
          facebook_url: company.facebook_url,
          linkedin_url: company.linkedin_url,
          insta_url: company.insta_url,
          brochure_url:company.brochure_url,
          profile:company.profile,
          title:company.title,
          address: company.address,
          categoryName: company.category_id.name // Access the name field from the populated category
      }));
      res.json(result);
  }else{
    const pipeline = [
      {
        $lookup: {
          from: 'categories', 
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'countries', 
          localField: 'country_id',
          foreignField: '_id',
          as: 'country'
        }
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
          facebook_url: 1,
          twitter_url: 1,
          linkedin_url: 1,
          insta_url: 1,
          brochure_url: 1,
          profile: 1,
          title: 1,
          category_id: 1,
          email: 1,
          user_id: 1,
          address:1,
          categoryName: { $arrayElemAt: ['$category.name', 0] },
          countryName: { $arrayElemAt: ['$country.name', 0] },
        }
      },
      {
        $sort: { company: 1 } // Sort by company name in ascending order
      }
    ];
    const companies = await Company.aggregate(pipeline);
    res.json(companies);
  }

});

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getFeaturedCompanies = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ status: 1 });
    const userIds = users.map(user => user._id);
    const companies = await Company.find({ user_id: { $in: userIds } })
      .populate({
        path: 'category_id',
        select: 'name', // Select only the name field
        model: 'Category'
      })
      .populate({
        path: 'country_id',
        select: 'name', // Select only the name field
        model: 'Country'
      });

    const shuffledCompanies = shuffle(companies);
    const randomCompanies = shuffledCompanies.slice(0, 3);

    const featuredCompanies = randomCompanies.map(company => ({
      ...company.toJSON(),
      categoryName: company.category_id.name,
      countryName: company.country_id.name
    }));

    res.status(200).json(featuredCompanies);
  } catch (error) {
    console.error('Error fetching featured companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export const getRelatedCompanies = async (req, res) => {
  const categoryId = req.params.catID;
  const companyIdToExclude = req.params.companyId; 
  try {
    const relatedCompanies = await Company.find({ category_id: categoryId, _id: { $ne: companyIdToExclude } });
    res.status(200).json(relatedCompanies);
  } catch (error) {
    console.error('Error fetching related companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};












