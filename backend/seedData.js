const mongoose = require('mongoose');
const Trip = require('./models/Trip');

// MongoDB connection
mongoose.connect('mongodb+srv://deepumelkani123_db_user:Bus7777@cluster0.ax4xicv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Clean any existing dummy data and prepare for real driver-created trips
const cleanDummyData = async () => {
  try {
    console.log('🧹 Cleaning any existing dummy/test data...');
    
    // Remove any trips that might be test data (without proper driver/bus references)
    const result = await Trip.deleteMany({
      $or: [
        { driver: { $exists: false } },
        { bus: { $exists: false } },
        { driver: null },
        { bus: null }
      ]
    });

    console.log(`✅ Cleaned ${result.deletedCount} dummy/invalid trips`);
    console.log('\n🎯 System is now ready for real driver-created trips!');
    console.log('\n📋 To test the smart trip matching:');
    console.log('   1. Use the DriverApp to create a trip (Source A → Destination B)');
    console.log('   2. Start the trip in the DriverApp to begin location tracking');
    console.log('   3. Use the web app to search for trips (Source C → Destination D)');
    console.log('   4. The system will match if C and D lie on the route A→B');
    console.log('   5. ETA will be calculated from the bus\'s current location to your pickup point');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error cleaning database:', err);
    mongoose.connection.close();
  }
};

cleanDummyData();
