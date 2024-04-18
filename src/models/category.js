"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      set: (name) => name.toUpperCase(),
    },
  },
  { timestamps: true, collection: "categories" }
);

module.exports = mongoose.model("Category", CategorySchema);
