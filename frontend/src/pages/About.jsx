import React from 'react';
import { Bus, MapPin, Clock, Users, Smartphone, Globe, Shield, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-600 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Bus className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">About BusTrac</h1>
            <p className="text-xl text-navy-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing public transportation with smart route matching, real-time tracking, 
              and intelligent ETA calculations for a seamless travel experience.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To make public transportation more accessible, efficient, and user-friendly by connecting 
            passengers with buses through intelligent route matching and real-time tracking technology.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Matching</h3>
            <p className="text-gray-600">
              Find buses even when your stops are intermediate points on longer routes
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time ETA</h3>
            <p className="text-gray-600">
              Precise arrival times based on live GPS data and traffic conditions
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Driver App</h3>
            <p className="text-gray-600">
              Mobile app for drivers to create trips and broadcast live location
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Updates</h3>
            <p className="text-gray-600">
              Real-time seat availability and bus status information
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How BusTrac Works</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-navy-100 p-3 rounded-2xl w-12 h-12 mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-navy-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Driver Creates Trip</h3>
              <p className="text-gray-600 mb-4">
                Bus drivers use our mobile app to create trips with source and destination points. 
                The system generates route polylines using Google Maps.
              </p>
              <div className="text-sm text-navy-600 font-medium">
                Source A → Destination B
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-navy-100 p-3 rounded-2xl w-12 h-12 mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-navy-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Route Matching</h3>
              <p className="text-gray-600 mb-4">
                When you search for your journey, our algorithm checks if your pickup and 
                drop-off points lie within any active bus routes.
              </p>
              <div className="text-sm text-navy-600 font-medium">
                Your journey: C → D on route A → B
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-navy-100 p-3 rounded-2xl w-12 h-12 mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-navy-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Tracking & ETA</h3>
              <p className="text-gray-600 mb-4">
                Get real-time ETA to your pickup point based on the bus's current GPS location, 
                traffic conditions, and route optimization.
              </p>
              <div className="text-sm text-navy-600 font-medium">
                Live GPS + Traffic = Precise ETA
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Built with Modern Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="bg-blue-100 p-3 rounded-2xl w-12 h-12 mb-4 flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Web Application</h3>
              <p className="text-gray-600 text-sm mb-3">
                React 18 with modern UI/UX, TailwindCSS for styling, and real-time updates via Socket.io
              </p>
              <div className="text-xs text-blue-600 font-medium">
                React • TailwindCSS • Socket.io
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="bg-green-100 p-3 rounded-2xl w-12 h-12 mb-4 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile Driver App</h3>
              <p className="text-gray-600 text-sm mb-3">
                React Native with Expo for cross-platform compatibility and real-time GPS tracking
              </p>
              <div className="text-xs text-green-600 font-medium">
                React Native • Expo • GPS Tracking
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="bg-purple-100 p-3 rounded-2xl w-12 h-12 mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Backend & APIs</h3>
              <p className="text-gray-600 text-sm mb-3">
                Node.js with Express, MongoDB for data storage, and Google Maps APIs for routing
              </p>
              <div className="text-xs text-purple-600 font-medium">
                Node.js • MongoDB • Google Maps API
              </div>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-gradient-to-r from-navy-50 to-blue-50 rounded-3xl p-8">
          <div className="text-center">
            <div className="bg-navy-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-8 w-8 text-navy-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Privacy</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your privacy and security are our top priorities. We use industry-standard encryption, 
              secure authentication, and only collect necessary data to provide our services. 
              Location data is used solely for route matching and real-time tracking purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
