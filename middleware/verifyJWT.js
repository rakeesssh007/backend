const jwt = require('jsonwebtoken'); // ✔️ Use jwt, not jtw
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify( // <- this must be jwt, not jtw
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      console.log("Decoded token:", decoded); // optional, helpful for debug
      req.user = decoded.UserInfo.username;
     req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};

module.exports = verifyJWT;




