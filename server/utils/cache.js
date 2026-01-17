const NodeCache = require("node-cache");

// Standard TTL 300 seconds (5 minutes) as per requirements
const cache = new NodeCache({ stdTTL: 300 });

module.exports = cache;
