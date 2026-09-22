import React from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'; // Optional: using Heroicons

export default function Development({ 
  title = "Page Under Development", 
  message = "We are working hard to bring you something amazing. Please check back soon!",
  showHomeButton = true,
  onHomeClick = () => window.location.href = '/'
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated Icon Container */}
        <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center shadow-inner animate-pulse">
          <WrenchScrewdriverIcon className="w-10 h-10 text-indigo-600 animate-bounce" />
        </div>

        {/* Heading & Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-indigo-600 h-2.5 rounded-full w-2/3 animate-pulse"></div>
        </div>

        {/* Action Button */}
        {showHomeButton && (
          <div className="pt-2">
            <button
              onClick={onHomeClick}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}