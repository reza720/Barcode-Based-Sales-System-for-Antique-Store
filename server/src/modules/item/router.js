import * as itemController from "./controller.js";
import upload from "../../config/multer.js";

import express from "express";

const router = express.Router();

router.post("/", 
    itemController.addItem);
router.post("/:itemId/photos", 
    upload.array("photos"), 
    itemController.upload);
router.patch("/:itemId", 
    itemController.update);

router.delete("/:itemId/photos/:photoId", 
    itemController.deletePhoto);
router.delete("/:itemId", 
    itemController.deleteItem);

router.get("/scan", 
    itemController.scan);
router.get("/:itemId", 
    itemController.getItem);
router.get("/", 
    itemController.getItems
);

export default router;

