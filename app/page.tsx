"use client";
// src/app/page.tsx
// This is the main home page component for Rom.io.
// It combines the hero section and the trip planning form,
// adhering to a minimal design with horizontal form inputs.

import Image from 'next/image';
import Link from 'next/link';
// For authentication, assuming NextAuth.js is set up in src/auth.ts
// import { useSession, signIn, signOut } from 'next-auth/react'; 
// For icons (Lucide React), you would typically install and import them:
// import { Plane, LogIn, Sparkles, PencilRuler, Clock } from 'lucide-react';

// For AI integration
 // This component needs to be a client component to handle user input and state

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // For rendering AI's markdown response
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown support

// --- Header Component ---
// This component provides the navigation bar for the application.
function Header() {
  // const { data: session, status } = useSession(); // Uncomment when NextAuth.js is fully set up

  return (
    <header className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center rounded-b-lg z-30">
      {/* Logo */}
      <div className="flex items-center">
        {/* Simple SVG for paper airplane icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"></path>
        </svg>
        <Link href="#top" className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Rom.io
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-8">
        <Link href="#top" className="text-gray-700 hover:text-purple-600 text-lg font-medium transition-colors duration-200">
          Home
        </Link>
        <Link href="#plan-trip-form" className="text-purple-600 text-lg font-medium transition-colors duration-200 border-b-2 border-purple-600 pb-1">
          Plan a Trip
        </Link>
        <Link href="#" className="text-gray-700 hover:text-purple-600 text-lg font-medium transition-colors duration-200">
          My Trips
        </Link>
        <Link href="#" className="text-gray-700 hover:text-purple-600 text-lg font-medium transition-colors duration-200">
          About Us
        </Link>
      </nav>

      {/* Auth Buttons (Placeholder) */}
      <div className="flex items-center space-x-4">
        <button
          // onClick={() => signIn('google')} // Uncomment when NextAuth.js is fully set up
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-sm"
        >
          {/* Simple SVG for Log In icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          Sign In
        </button>
        sarthak choudhary
      </div>

      {/* Mobile Menu Icon (Placeholder) */}
      <div className="md:hidden">
        <button className="text-gray-700 focus:outline-none">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}

// --- Footer Component ---
// This component provides the footer section of the application.
function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-6 md:px-12 mt-16 rounded-t-lg z-30">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Copyright */}
        <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Rom.io. All rights reserved.</p>

        {/* Footer Links */}
        <div className="flex space-x-6">
          <Link href="#" className="text-sm hover:text-white transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:text-white transition-colors duration-200">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

// --- Feature Card Component ---
// Reusable component for displaying individual features.
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {icon}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// --- PlanTripForm Component (Client Component) ---
// This component handles the user input form and displays the AI-generated itinerary.
function PlanTripForm() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle checkbox changes for interests
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setInterests((prev) => [...prev, value]);
    } else {
      setInterests((prev) => prev.filter((interest) => interest !== value));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItinerary(''); // Clear previous itinerary

    try {
      // Construct the prompt for the AI
      const prompt = `As a highly experienced and creative travel planner, design a detailed and engaging itinerary for a trip to ${destination} from ${startDate} to ${endDate} for ${travelers} person(s).
      The traveler is highly interested in ${interests.join(', ')}.
      Their budget preference is ${budget}.
      Additional notes: ${notes || 'None'}.

      Focus on unique experiences, local culture, and efficient routing. Provide daily plans, including activities, dining suggestions (mentioning local specialties), and estimated timings. Include practical tips where relevant (e.g., best time to visit a place, local transport advice).
      Structure the output clearly, day by day, using markdown headings for days (e.g., ## Day 1: [City/Theme]) and bullet points for activities. Make it captivating and inspiring!`;

      console.log('Sending prompt to AI:', prompt); // For debugging

      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }), // Send the constructed prompt
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to generate itinerary. Please try again.');
      }

      // Read the streaming response from the AI
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setItinerary(result); // Update state incrementally for streaming effect
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating the itinerary.');
      console.error('AI generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="plan-trip-form" className="flex-grow container mx-auto px-6 py-16 flex items-center justify-center -mt-24 md:-mt-32 z-40">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-5xl transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Start Your Adventure Here</h2>
        <p className="text-center text-gray-600 mb-10">
          Simply tell us where and when you want to go, and our AI will craft a personalized itinerary just for you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Horizontal Input Group: Destination, Dates, Travelers */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">
              <label htmlFor="destination" className="sr-only">Destination</label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="Destination (e.g., Paris, France)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 min-h-[48px]"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="start_date" className="sr-only">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 min-h-[48px]"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="end_date" className="sr-only">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 min-h-[48px]"
                required
              />
            </div>
            <div className="w-full md:w-auto">
              <label htmlFor="travelers" className="sr-only">Travelers</label>
              <input
                type="number"
                id="travelers"
                name="travelers"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                placeholder="Travelers"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 min-h-[48px]"
                required
              />
            </div>
          </div>

          {/* Submit Button for the main search */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Itinerary...' : 'Generate My Itinerary'}
          </button>

          {/* Additional Inputs (Interests, Budget, Notes) */}
          <div className="space-y-6 pt-8 border-t border-gray-200 mt-8">
            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-3">What are your interests?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <label className="flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input type="checkbox" name="interests" value="adventure" checked={interests.includes('adventure')} onChange={handleInterestChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-3 text-gray-700">Adventure</span>
                </label>
                <label className="flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input type="checkbox" name="interests" value="culture" checked={interests.includes('culture')} onChange={handleInterestChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-3 text-gray-700">Culture & History</span>
                </label>
                <label className="flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input type="checkbox" name="interests" value="foodie" checked={interests.includes('foodie')} onChange={handleInterestChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-3 text-gray-700">Food & Drink</span>
                </label>
                <label className="flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input type="checkbox" name="interests" value="relaxation" checked={interests.includes('relaxation')} onChange={handleInterestChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-3 text-gray-700">Relaxation</span>
                </label>
                <label className="flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input type="checkbox" name="interests" value="nature" checked={interests.includes('nature')} onChange={handleInterestChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-3 text-gray-700">Nature & Outdoors</span>
                </label>
                <label className="flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                  <input type="checkbox" name="shopping" value="shopping" checked={interests.includes('shopping')} onChange={handleInterestChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-3 text-gray-700">Shopping</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-gray-700 text-lg font-semibold mb-2">Budget Preference</label>
              <select
                id="budget"
                name="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 min-h-[48px]"
                required
              >
                <option value="">Select a budget range</option>
                <option value="budget-friendly">Budget-friendly ($)</option>
                <option value="mid-range">Mid-range ($$)</option>
                <option value="luxury">Luxury ($$$)</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-gray-700 text-lg font-semibold mb-2">Any specific requests or notes?</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 'I prefer quiet places', 'Traveling with young children', 'Need accessible options'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
              ></textarea>
            </div>
          </div>
        </form>

        {/* Display AI-Generated Itinerary */}
        {loading && (
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg text-blue-700 font-medium">
            <div className="animate-pulse">Generating your personalized itinerary...</div>
            <div className="mt-2 text-sm">This might take a moment.</div>
          </div>
        )}
        {error && (
          <div className="text-center mt-8 p-4 bg-red-50 rounded-lg text-red-700 font-medium">
            Error: {error}
          </div>
        )}
        {itinerary && !loading && (
          <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Rom.io Itinerary!</h3>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {itinerary}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


// --- Main Home Page Component ---
// This component orchestrates all sections of the combined home page.
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="top" className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden rounded-b-xl shadow-lg z-20">
        {/* Background Image with Overlay */}
        <Image
          src="https://placehold.co/1920x1080/A7BCCF/FFFFFF.png?text=Travel+Background" // Changed to .png to avoid SVG issue
          alt="Scenic travel background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 hero-overlay z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 text-white p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Rom.io: Your Intelligent Travel Companion
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow">
            Personalized itineraries, effortlessly planned with AI. Discover the world, your way.
          </p>
        </div>
      </section>

      {/* Main Content - Plan Your Trip Form (Horizontal Layout) */}
      {/* The PlanTripForm is now a dedicated component */}
      <PlanTripForm />

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Rom.io?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1: AI-Powered Planning */}
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
              </svg>
            }
            title="AI-Powered Planning"
            description="Leverage cutting-edge AI to generate unique, personalized itineraries tailored to your interests, budget, and travel style. Say goodbye to endless research!"
          />

          {/* Feature 2: Customizable Itineraries */}
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V4M18 14V4M6 20V10"></path>
                <path d="M4 10h16"></path>
              </svg>
            }
            title="Customizable Itineraries"
            description="Your trip, your rules. Easily modify, add, or remove activities with intuitive drag-and-drop functionality. Rom.io adapts to you."
          />

          {/* Feature 3: Real-time Updates */}
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            }
            title="Real-time Updates"
            description="Stay informed with live weather forecasts, event alerts, and travel updates. Your itinerary adjusts dynamically to ensure a smooth journey."
          />
        </div>
      </section>

      {/* Secondary Call to Action */}
      <section className="bg-purple-600 text-white py-16 px-6 text-center rounded-xl mx-auto w-[90%] shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore the World?</h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Start planning your dream vacation with Rom.io today.
        </p>
        <Link href="#plan-trip-form" className="inline-block bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg shadow-xl transition-all duration-300 transform hover:scale-105">
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

