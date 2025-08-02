import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <span>Developed with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>by</span>
            <span className="text-white font-semibold">Abhinash Kumar Dubey</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/abhinash-kumar-dubey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4" />
              <span className="text-sm">LinkedIn</span>
            </a>
            
            <a
              href="https://github.com/abhinash-kumar-dubey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 KloudScope by Kloud-Scaler. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};