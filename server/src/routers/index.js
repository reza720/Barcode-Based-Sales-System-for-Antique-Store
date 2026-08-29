import express from "express";
import itemRouter from "../modules/item/router.js";
import saleRouter from "../modules/sale/router.js";

const router = express.Router();

router.use("/items", itemRouter);
router.use("/sales", saleRouter);

export default router; 
