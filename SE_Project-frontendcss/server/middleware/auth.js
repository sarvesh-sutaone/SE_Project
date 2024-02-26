const admin = require("firebase-admin");

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  const idToken = authHeader;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      res.status(401).json({ error: "Unauthorized: Invalid ID token" });
    });
}

module.exports = isAuthenticated;
