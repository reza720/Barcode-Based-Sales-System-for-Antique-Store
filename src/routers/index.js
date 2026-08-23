import express from "express";
import itemRouter from "../modules/item/router.js";

const router = express.Router();

router.use("/items", itemRouter);

export default router; 
