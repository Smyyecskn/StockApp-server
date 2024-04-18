"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const brand = require("../controllers/brand");
const permissions = require("../middlewares/permissions");

// router
//   .route("/")
//   .get(permissions.isStaff, brand.read)
//   .post(permissions.isAdmin,brand.create);

// router
//   .route("/:id")
//   .get(permissions.isStaff, brand.read)
//   .put(permissions.isAdmin, brand.update)
//   .patch(permissions.isAdmin, brand.update)
//   .delete(permissions.isAdmin);

router
  .route("/(:id)?")
  .get(permissions.isStaff, brand.read)
  .post(permissions.isAdmin, brand.create)
  .put(permissions.isAdmin, brand.update)
  .patch(permissions.isAdmin, brand.update)
  .delete(permissions.isAdmin, brand.delete);

module.exports = router;
