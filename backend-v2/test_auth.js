const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const testEmail = 'yasardeen25@gmail.com';
const testPassword = 'yasardeen';

const user = db.users.find(u => u.email === testEmail);

if (!user) {
    console.log('User not found in database.json');
} else {
    console.log('User found:', user.name);
    console.log('Stored Hash:', user.password);

    bcrypt.compare(testPassword, user.password).then(match => {
        console.log('Password match:', match);
    });
}
