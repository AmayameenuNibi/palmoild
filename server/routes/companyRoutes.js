import express from 'express';
import multer from 'multer';
import { 
  createCompany, 
  getCompanies, 
  updateCompany,
  deleteCompany,
  getCompanyDetails,
  getSingleCompanyDetails,
  getSingleCompanies,
  searchCompanies  } from '../controllers/companyController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});

const upload = multer({ storage: storage });


// Routes for companies
router.post('/', upload.single('logo'), createCompany);
router.get('/', getCompanies);
router.get('/single/:companyId', getSingleCompanies);
router.get('/search', searchCompanies);
router.put('/:id', upload.single('logo'), updateCompany);
router.delete('/:id', deleteCompany);
router.get('/:companyName', getCompanyDetails);
router.get('/user/:userID', getSingleCompanyDetails);

export default router;
