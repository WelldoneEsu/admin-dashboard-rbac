const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');


const signAccessToken = (payload) => {
const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};


const signRefreshToken = async (userId) => {
const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
// store raw token in DB (could also hash the refresh token for extra security)
const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn });


const decoded = jwt.decode(token);
const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : undefined;


const rt = await RefreshToken.create({ token, user: userId, expiresAt });
return rt.token;
};


module.exports = { signAccessToken, signRefreshToken };