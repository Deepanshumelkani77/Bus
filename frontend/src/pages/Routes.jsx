import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Navigation, Clock, Users } from 'lucide-react';

const Routes = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-4 rounded-2xl shadow-lg">
                <Navigation className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bus Routes</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore available bus routes and find the perfect journey for your travel needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link 
            to="/smart-search"
            className="group bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-8 hover:shadow-navy transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <Bus className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Smart Bus Search</h3>
                <p className="text-gray-600">Find buses on your route with live tracking</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Enter your pickup and destination to find buses whose routes include your journey. 
              Get real-time ETAs and live tracking.
            </p>
            <div className="flex items-center text-blue-600 font-semibold">
              <span>Search Now</span>
              <Navigation className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link 
            to="/track"
            className="group bg-white rounded-3xl shadow-navy-lg border border-gray-100 p-8 hover:shadow-navy transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-100 p-3 rounded-2xl group-hover:bg-green-200 transition-colors">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Track Specific Bus</h3>
                <p className="text-gray-600">Track a bus by its number or trip ID</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              If you know the bus number or have a trip ID, track its live location 
              and get real-time updates on its journey.
            </p>
            <div className="flex items-center text-green-600 font-semibold">
              <span>Track Bus</span>
              <MapPin className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How Smart Route Matching Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-navy-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-navy-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Driver Creates Trip</h3>
              <p className="text-gray-600">
                Bus drivers create trips from Source A → Destination B using the DriverApp
              </p>
            </div>

            <div className="text-center">
              <div className="bg-navy-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-navy-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You Search Your Route</h3>
              <p className="text-gray-600">
                Enter your pickup (C) and destination (D) to find matching trips
              </p>
            </div>

            <div className="text-center">
              <div className="bg-navy-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-navy-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                System shows buses if C and D lie on the route A→B with live ETA
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time ETA</h3>
            <p className="text-gray-600 text-sm">
              Get live arrival times based on driver's current location and traffic
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="bg-green-100 p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Live Tracking</h3>
            <p className="text-gray-600 text-sm">
              Track buses in real-time with interactive maps and route visualization
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Navigation className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Routes</h3>
            <p className="text-gray-600 text-sm">
              Intelligent matching finds buses even if your stops are mid-route
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="bg-orange-100 p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Seat Availability</h3>
            <p className="text-gray-600 text-sm">
              Check real-time seat availability and occupancy information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
