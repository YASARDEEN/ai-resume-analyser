const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const adminEmail = 'yasardeen25@gmail.com';
const adminPassword = 'yasardeen';

const hash = bcrypt.hashSync(adminPassword, 12);
console.log('New Hash:', hash);

let updated = false;
db.users = db.users.map(u => {
    if (u.email === adminEmail) {
        u.password = hash;
        updated = true;
    }
    return u;
});

if (updated) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('✅ Updated database.json successfully');

    // Test instantly
    bcrypt.compare(adminPassword, hash).then(match => {
        console.log('Verification match:', match);
    });
} else {
    console.log('❌ User not found');
}
