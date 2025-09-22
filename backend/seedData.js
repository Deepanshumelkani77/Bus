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
// 20 dummy buses with images
const buses = [
  { busNumber: 'HDW-101', city: 'Haldwani', totalSeats: 40, status: 'Active', image: 'https://i.pinimg.com/1200x/c2/38/35/c2383536d6b5e70f91baaec8a79a1307.jpg' },
  { busNumber: 'HDW-102', city: 'Haldwani', totalSeats: 35, status: 'Inactive', image: 'https://i.pinimg.com/1200x/90/a7/e4/90a7e4877354c8dd2171497c39d81eff.jpg' },
  { busNumber: 'HDW-103', city: 'Haldwani', totalSeats: 30, status: 'Active', image: 'https://i.pinimg.com/736x/b0/b6/2b/b0b62b1e32d31bdb2c403b0bd06f66ee.jpg' },
  { busNumber: 'HDW-104', city: 'Haldwani', totalSeats: 45, status: 'Active', image: 'https://i.pinimg.com/736x/73/10/0b/73100bc619c9d10d3e693b38291b075c.jpg' },
  { busNumber: 'HDW-105', city: 'Haldwani', totalSeats: 50, status: 'Inactive', image: 'https://i.pinimg.com/736x/3e/a6/94/3ea69419587fdf513f9bc21a3bd77072.jpg' },
  { busNumber: 'HDW-106', city: 'Haldwani', totalSeats: 42, status: 'Active', image: 'https://i.pinimg.com/736x/cf/c5/41/cfc541f50a8c3df730d3d578c90e94f7.jpg' },
  { busNumber: 'HDW-107', city: 'Haldwani', totalSeats: 38, status: 'Active', image: 'https://i.pinimg.com/736x/15/61/e9/1561e9ee9da9e2133b3b4560300aaadd.jpg' },
  { busNumber: 'HDW-108', city: 'Haldwani', totalSeats: 36, status: 'Inactive', image: 'https://i.pinimg.com/1200x/fb/bb/e0/fbbbe04361e52b88c0865c54fa711ac7.jpg' },
  { busNumber: 'HDW-109', city: 'Haldwani', totalSeats: 40, status: 'Active', image: 'https://i.pinimg.com/1200x/49/e6/01/49e60113d1c24142b1bddf867a902dfb.jpg' },
  { busNumber: 'HDW-110', city: 'Haldwani', totalSeats: 44, status: 'Active', image: 'https://i.pinimg.com/1200x/56/ef/93/56ef9366dd3bbf3b72214e577a6d7199.jpg' },

  { busNumber: 'RDP-201', city: 'Rudrapur', totalSeats: 40, status: 'Active', image: 'https://i.pinimg.com/1200x/c2/38/35/c2383536d6b5e70f91baaec8a79a1307.jpg' },
  { busNumber: 'RDP-202', city: 'Rudrapur', totalSeats: 35, status: 'Inactive', image: 'https://i.pinimg.com/1200x/90/a7/e4/90a7e4877354c8dd2171497c39d81eff.jpg' },
  { busNumber: 'RDP-203', city: 'Rudrapur', totalSeats: 30, status: 'Active', image: 'https://i.pinimg.com/736x/b0/b6/2b/b0b62b1e32d31bdb2c403b0bd06f66ee.jpg' },
  { busNumber: 'RDP-204', city: 'Rudrapur', totalSeats: 45, status: 'Active', image: 'https://i.pinimg.com/736x/73/10/0b/73100bc619c9d10d3e693b38291b075c.jpg' },
  { busNumber: 'RDP-205', city: 'Rudrapur', totalSeats: 50, status: 'Inactive', image: 'https://i.pinimg.com/736x/3e/a6/94/3ea69419587fdf513f9bc21a3bd77072.jpg' },
  { busNumber: 'RDP-206', city: 'Rudrapur', totalSeats: 42, status: 'Active', image: 'https://i.pinimg.com/736x/cf/c5/41/cfc541f50a8c3df730d3d578c90e94f7.jpg' },
  { busNumber: 'RDP-207', city: 'Rudrapur', totalSeats: 38, status: 'Active', image: 'https://i.pinimg.com/736x/15/61/e9/1561e9ee9da9e2133b3b4560300aaadd.jpg' },
  { busNumber: 'RDP-208', city: 'Rudrapur', totalSeats: 36, status: 'Inactive', image: 'https://i.pinimg.com/1200x/fb/bb/e0/fbbbe04361e52b88c0865c54fa711ac7.jpg' },
  { busNumber: 'RDP-209', city: 'Rudrapur', totalSeats: 40, status: 'Active', image: 'https://i.pinimg.com/1200x/49/e6/01/49e60113d1c24142b1bddf867a902dfb.jpg' },
  { busNumber: 'RDP-210', city: 'Rudrapur', totalSeats: 44, status: 'Active', image: 'https://i.pinimg.com/1200x/56/ef/93/56ef9366dd3bbf3b72214e577a6d7199.jpg' },
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
