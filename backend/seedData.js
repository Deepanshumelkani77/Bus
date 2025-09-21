const mongoose = require('mongoose');
const Bus = require('./models/Bus'); // import your Bus model

// MongoDB connection
mongoose.connect('mongodb+srv://deepumelkani123_db_user:Bus7777@cluster0.ax4xicv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// 20 dummy buses
const buses = [
  { busNumber: 'HDW-101', city: 'Haldwani', totalSeats: 40, status: 'Active' },
  { busNumber: 'HDW-102', city: 'Haldwani', totalSeats: 35, status: 'Inactive' },
  { busNumber: 'HDW-103', city: 'Haldwani', totalSeats: 30, status: 'Active' },
  { busNumber: 'HDW-104', city: 'Haldwani', totalSeats: 45, status: 'Active' },
  { busNumber: 'HDW-105', city: 'Haldwani', totalSeats: 50, status: 'Inactive' },
  { busNumber: 'HDW-106', city: 'Haldwani', totalSeats: 42, status: 'Active' },
  { busNumber: 'HDW-107', city: 'Haldwani', totalSeats: 38, status: 'Active' },
  { busNumber: 'HDW-108', city: 'Haldwani', totalSeats: 36, status: 'Inactive' },
  { busNumber: 'HDW-109', city: 'Haldwani', totalSeats: 40, status: 'Active' },
  { busNumber: 'HDW-110', city: 'Haldwani', totalSeats: 44, status: 'Active' },

  { busNumber: 'RDP-201', city: 'Rudrapur', totalSeats: 40, status: 'Active' },
  { busNumber: 'RDP-202', city: 'Rudrapur', totalSeats: 35, status: 'Inactive' },
  { busNumber: 'RDP-203', city: 'Rudrapur', totalSeats: 30, status: 'Active' },
  { busNumber: 'RDP-204', city: 'Rudrapur', totalSeats: 45, status: 'Active' },
  { busNumber: 'RDP-205', city: 'Rudrapur', totalSeats: 50, status: 'Inactive' },
  { busNumber: 'RDP-206', city: 'Rudrapur', totalSeats: 42, status: 'Active' },
  { busNumber: 'RDP-207', city: 'Rudrapur', totalSeats: 38, status: 'Active' },
  { busNumber: 'RDP-208', city: 'Rudrapur', totalSeats: 36, status: 'Inactive' },
  { busNumber: 'RDP-209', city: 'Rudrapur', totalSeats: 40, status: 'Active' },
  { busNumber: 'RDP-210', city: 'Rudrapur', totalSeats: 44, status: 'Active' },
];

// Insert dummy data
const seedBuses = async () => {
  try {
    await Bus.deleteMany(); // optional: remove existing buses
    const insertedBuses = await Bus.insertMany(buses);
    console.log('Buses inserted:', insertedBuses);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedBuses();
