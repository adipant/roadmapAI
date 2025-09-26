import React from "react";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full p-4 text-center">
      <div className="">
        <p className="text-gray-500 text-sm md:text-md">
          Made by Aditya &copy; 2025 Your Company. All rights reserved.
        </p>
      </div>

      <div className="mt-2">
        <ul className="flex items-center justify-center space-x-6">
          <li>
            <a href="https://www.linkedin.com/in/adipantsde/" target="_blank">
              <Linkedin color="#c4c4c4" strokeWidth={1.25} />
            </a>
          </li>
          <li>
            <a href="https://github.com/adipant" target="_blank">
              <Github color="#c4c4c4" strokeWidth={1.25} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
// bg-gradient-to-r from-purple-400 to-pink-600
