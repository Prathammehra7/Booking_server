const jwt = require("jsonwebtoken");

const gentoken = (id) => {
  return jwt.sign({
    id: id,
  },
    "secret",
    { expiresIn: "15d" },
  );
}

const authenticationChecker = (req, res, next) => {
  if (req.headers.auth) {
    try {
      const token = req.headers.auth;
      var decoded = jwt.verify(token, 'secret');
      next();
    } catch (error) {
     return res.status(500).send("User not authenticated");
    }
  }

  else {
    return res.status(500).send("No headers Detected");
  }
};

module.exports = { gentoken, authenticationChecker };