const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "https://atmos-api", // MUST match your NEW API Identifier
  issuerBaseURL: `https://dev-1h6gvgpwk6620grd.us.auth0.com/`, // Paste your Auth0 Domain
  tokenSigningAlg: "RS256",
});

module.exports = checkJwt;
