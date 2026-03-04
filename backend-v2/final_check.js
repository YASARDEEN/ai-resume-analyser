const bcrypt = require('bcryptjs');
const password = 'yasardeen';
const hash = '$2b$12$ccfKiO8MgErhnGLIV1Qblux8Wo92Nx5D5GX6NqmKdhKXkZPun24Wm';
bcrypt.compare(password, hash).then(m => console.log('Match:', m));
