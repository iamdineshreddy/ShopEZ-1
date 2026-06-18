const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  try {
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'shopez'
      }
    });
    console.log(`\n✅ In-memory MongoDB server started successfully!`);
    console.log(`   URI: ${mongoServer.getUri()}`);
    console.log(`   Port: 27017`);
    console.log(`   Database: shopez`);
    console.log(`\nKeep this process running to connect to the database.\n`);
  } catch (error) {
    console.error('❌ Failed to start In-Memory MongoDB:', error.message);
    process.exit(1);
  }
}

start();
