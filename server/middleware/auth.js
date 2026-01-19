const { auth } = require("express-oauth2-jwt-bearer");

// This middleware validates the access token
const checkJwt = auth({
  audience: "https://weather-api/", // MUST match your Auth0 API Identifier
  issuerBaseURL: `https://dev-1h6gvgpwk6620grd.us.auth0.com/`, // Replace with your Auth0 Domain
  tokenSigningAlg: "RS256",
});

module.exports = checkJwt;
