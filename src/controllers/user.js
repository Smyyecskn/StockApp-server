"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
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
    //!Admin olmayan sadece kendi kayıtlarını görebilir.
    const customFilters = req.user?.isAdmin ? {} : { _id: req.user.id };
    const data = await res.getModelList(User, customFilters);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */

    //!Yeni kayıtlarda isStaff ve isAdmin false OLSUN
    (req.body.isStaff = false), (req.body.isAdmin = false);

    const data = await User.create(req.body);
    /*AUTO LOGİN */ //!otomatik tokenı create etmek
    const tokenData = await Token.create({
      userId: data._id,
      token: passwordEncrypt(data._id + Date.now()),
    });
    /*AUTO LOGİN */

    res.status(201).send({
      error: false,
      token: tokenData.token,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */
    //!Sadece kendi kaydını görebilme adminse başka kayıtları görebilir admin değilse sadece kendi kaydını görebilir.
    //!Adminsen req.params.id'sini kabul et. Admin değilsen her durumda req.userdaki yani kendi ıdsını kabul eder.
    const customFilters = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user.id };

    const data = await User.findOne(customFilters);
    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */
    //!Sadece kendi kaydını GÜNCELLEYEBİLİR
    const customFilters = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user.id };

    //!admin değilse staff ve admin durumunu DEĞİŞTİREMEZ.
    if (!req.user?.isAdmin) {
      delete req.body.isStaff;
      delete req.body.isAdmin;
    }
    const data = await User.updateOne(customFilters, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      deletebody: req.body, //SİLİNEN DEĞERLERİ isStaff ve isAdmin hiç response gelmediğini gördük.
      data,
      new: await User.findOne(customFilters),
    });
  },

  delete: async (req, res) => {
    //!Sadece kendi kaydını SİLEBİLİR.Permission tarafında sadece isAdmin kontrolu yapıldıgı ıcın gerek kalmadı.
    // const customFilters = req.user?.isAdmin
    //   ? { _id: req.params.id }
    //   : { };
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */
    if (req.params.id != req.user._id) {
      const data = await User.deleteOne({ _id: req.params.id });
      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data,
      });
    } else {
      // Admin kendini silemez.
      res.errorStatusCode = 403;
      throw new Error("You can not remove your account.");
    }
  },
};
