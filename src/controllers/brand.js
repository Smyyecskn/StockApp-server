"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const Brand = require("../models/brand");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "List Categories"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */
    // const data = await res.getModelList(Brand);
    // res.status(200).send({
    //   error: false,
    //   details: await res.getModelListDetails(Brand),
    //   data,
    // });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Create Brand"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Brand 1"
                }
            }
        */

    const data = await Brand.create(req.body);
    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Get Single Brand"
            
    */
    if (req.params?.id) {
      //1 Brand
      const data = await Brand.findOne({ _id: req.params.id });
      res.status(200).send({
        error: false,
        data,
      });
    } else {
      const data = await res.getModelList(Brand);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Brand),
        data,
      });
    }
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Update Brand"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Brand 1"
                }
            }
        */

    const data = await Brand.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data, //update yapma verisi kaç update yapıldı vs..
      newData: Brand.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    const data = await Brand.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
