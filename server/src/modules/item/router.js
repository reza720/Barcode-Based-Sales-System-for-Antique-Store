import * as itemController from "./controller.js";
import upload from "../../config/multer.js";

import express from "express";

const router = express.Router();

router.post("/", 
    itemController.addItem
);
router.get("/", 
    itemController.getItems
);
router.get("/scan", 
    itemController.scanBarcode
);
router.post("/:itemId/photos", 
    upload.array("photos"), 
    itemController.uploadPhotos
);
router.post("/:itemId/barcode", 
    itemController.generateBarcode
);
router.delete("/photos/:photoId", 
    itemController.deletePhoto
);
router.patch("/:itemId", 
    itemController.updateItem
);
router.delete("/:itemId", 
    itemController.deleteItem
);
router.get("/:itemId", 
    itemController.getItem
);

export default router;

