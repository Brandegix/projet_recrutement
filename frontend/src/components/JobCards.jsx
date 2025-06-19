import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

export default function MobileJobCard() {
  return (
    <div className="max-w-sm mx-auto bg-gray-900 text-white rounded-2xl overflow-hidden shadow-lg">
      {/* Header with image and company info */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 flex items-center space-x-3">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded transform rotate-45 relative">
            <div className="absolute inset-1 bg-white rounded-sm transform -rotate-45"></div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">
            Développeur Web React
          </h1>
          <p className="text-orange-100 text-sm">Brandegix</p>
        </div>
        <div className="bg-orange-700 bg-opacity-50 px-2 py-1 rounded-full">
          <span className="text-xs font-medium text-white">CDI</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Location and Experience */}
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Casablanca</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>2+ ans</span>
          </div>
        </div>

        {/* Job Description */}
        <div className="text-gray-300 text-sm leading-relaxed">
          <p>
            Nous recherchons un développeur Front-End spécialisé en React.js pour rejoindre 
            une équipe dynamique à Casablanca...
          </p>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            React.js
          </span>
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            JavaScript
          </span>
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            HTML/CSS
          </span>
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            REST API
          </span>
        </div>

        {/* Wide Apply Button */}
        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
          Postuler
        </button>
      </div>
    </div>
  );
}
