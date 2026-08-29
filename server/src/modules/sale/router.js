import * as saleController from "./controller.js";
import express from "express";

const router = express.Router();

router.post("/", saleController.createSale);
//router.get("/");
router.get("/:saleId", saleController.getSale);
router.patch("/:saleId", saleController.updateSale);
router.delete("/:saleId", saleController.deleteSale);

router.post("/:saleId/itmes/:itemId", saleController.addItemToSale);
router.delete("/:saleId/items/:itemId", saleController.deleteItemOfSale);

export default router;
