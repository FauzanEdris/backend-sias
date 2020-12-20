const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

router.get("/users", adminController.view_users);
router.get("/users/:id", adminController.view_by_id);
router.post("/users");
router.put("/users", adminController.update_users);
router.patch("/users");
router.delete("/users");

module.exports = router;
