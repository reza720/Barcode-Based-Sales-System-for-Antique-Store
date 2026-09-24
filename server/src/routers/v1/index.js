import express from 'express';
import itemRouter from '../../modules/item/router.v1.js';
import saleRouter from '../../modules/sale/router.v1.js';

const router = express.Router();

router.use('/items', itemRouter);
router.use('/sales', saleRouter);

export default router;
