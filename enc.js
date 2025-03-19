const crypto = require('crypto');

// تولید کلید امن برای JWT_SECRET
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log('\n');

// تولید کلید امن برای REFRESH_TOKEN_SECRET
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
console.log('REFRESH_TOKEN_SECRET:');
console.log(refreshTokenSecret);