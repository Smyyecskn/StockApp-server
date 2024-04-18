"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const category = require("../controllers/category");
const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.isStaff, category.list)
  .post(permissions.isAdmin);

router
  .route("/:id")
  .get(permissions.isStaff, category.read)
  .put(permissions.isAdmin, category.update)
  .patch(permissions.isAdmin, category.update)
  .delete(permissions.isAdmin);

module.exports = router;
