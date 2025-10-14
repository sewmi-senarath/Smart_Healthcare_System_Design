import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('\n🔍 Testing MongoDB Connection...\n');
    
    // Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error('❌ ERROR: MONGODB_URI not found in environment variables');
      console.error('💡 Make sure you have created a .env file in the backend folder');
      console.error('💡 Run: cp .env.example .env');
      process.exit(1);
    }
    
    // Show URI (hide password)
    const safeUri = process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@');
    console.log('📡 Connection URI:', safeUri);
    console.log('⏳ Attempting to connect...\n');
    
    // Attempt connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!\n');
    
    // Get connection info
    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // List databases
    const { databases } = await admin.listDatabases();
    console.log('📚 Available databases:');
    databases.forEach(database => {
      console.log(`   - ${database.name} (${(database.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Check current database
    const currentDb = db.databaseName;
    console.log(`\n🎯 Current database: ${currentDb}`);
    
    // List collections in current database
    const collections = await db.listCollections().toArray();
    console.log(`📦 Collections in ${currentDb}:`, 
      collections.length > 0 
        ? collections.map(c => c.name).join(', ') 
        : '(empty)');
    
    console.log('\n🎉 Connection test successful!');
    console.log('✅ You can now run the seeder: node src/db/seeders/seed.js\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection test FAILED!\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('   1. Check your MongoDB username and password');
      console.error('   2. For MongoDB Atlas: Verify database user exists');
      console.error('   3. For MongoDB Atlas: Check IP whitelist (use 0.0.0.0/0 for dev)');
      console.error('   4. Wait 2-3 minutes after creating Atlas user');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('   1. Make sure MongoDB is running locally');
      console.error('   2. Windows: net start MongoDB');
      console.error('   3. Mac: brew services start mongodb-community');
      console.error('   4. Or use MongoDB Atlas instead');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('   1. Check your internet connection');
      console.error('   2. Verify the MongoDB Atlas cluster URL is correct');
      console.error('   3. Try disabling VPN temporarily');
    } else {
      console.error('   1. Check MONGODB_URI in .env file');
      console.error('   2. Read MONGODB_SETUP_GUIDE.md for detailed instructions');
    }
    
    console.error('\n📖 For detailed help, see: MONGODB_SETUP_GUIDE.md\n');
    process.exit(1);
  }
};

testConnection();
