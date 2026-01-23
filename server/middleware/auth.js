const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "https://atmos-api",
  issuerBaseURL: `https://dev-1h6gvgpwk6620grd.us.auth0.com/`,
  tokenSigningAlg: "RS256",
});

module.exports = checkJwt;
