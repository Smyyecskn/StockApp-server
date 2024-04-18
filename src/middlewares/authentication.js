//!BANA GELEN TOKENI YA DA ACCESS_KEYI DOGRULAMA İŞLEMİ
const Token = require("../models/token");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization; // Token ...Tokenkey string
  const tokenKey = auth ? auth.split(" ") : null; //["Token" ""...Tokenkey"] array

  if (tokenKey) {
    if (tokenKey[0] == "Token") {
      //simpleToken
      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
        "userId"
      ); //burdaki userId'yi populate yaptıgımdan
      // console.log(tokenData)
      req.user = tokenData ? tokenData.userId : false; //buradan tokenData.userId demek bu ıdye baglı olan butun değerler gelecek.
    } else if (tokenKey[0] == "Bearer") {
      // JWT AccessToken:
      //JWT oluşturma = sign, okuma+dogrulama= verify
      // jwt.verify(accessToken, access_key, callbackFunction())
      jwt.verify(
        tokenKey[1],
        process.env.ACCESS_KEY,
        function (error, accessData) {
          // if (accessData) {
          //     console.log('JWT Verify: YES')
          //     req.user = accessData
          // } else {
          //     console.log('JWT Verify: NO')
          //     console.log(error)
          //     req.user = false
          // }
          req.user = accessData ? accessData : false;
        }
      );
    }
  }
  next();
};
