import express from 'express';
import {
    fetchCms, 
    createCms, 
    updateCms, 
    deleteCms,
    fetchSingleCms,
  } from '../controllers/cmsController.js';
  
const router = express.Router();

router.get('/', fetchCms);
router.get('/:key', fetchSingleCms);
router.post('/', createCms);
router.put('/:id', updateCms);
router.delete('/:id', deleteCms);

export default router;
