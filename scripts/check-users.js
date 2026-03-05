const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.connection.collection('users');
    const users = await User.find({}).toArray();
    console.log('Users in DB:', users.map(u => ({ email: u.email, role: u.role })));
    process.exit(0);
}

check();
