import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#05303B] text-white px-6 py-16 md:px-12 lg:px-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        {/* Left: Description */}
        <div className="md:w-1/3 text-sm leading-relaxed text-left">
          <h2 className="font-semibold text-sm tracking-widest uppercase">
            LABSPHERE – SIMPLIFYING DIAGNOSTICS, AMPLIFYING CARE
          </h2>
          <p className="mt-3">
            From test booking to report delivery, LabSphere brings speed,
            transparency, and reliability to every step of the diagnostic
            journey — for patients, labs, and healthcare professionals.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="text-left">
          <h3 className="font-semibold text-sm tracking-widest uppercase mb-4">
            VISIT
          </h3>
          <ul className="space-y-3 text-base">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/appointment">Book Appointment</a>
            </li>
            <li>
              <a href="/track-report">Track Report</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
          </ul>
        </div>

        {/* Right: Social Icons */}
        <div className="flex space-x-4 w-full md:w-auto">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow LabSphere on Twitter"
            className="hover:opacity-75 transition-opacity"
          >
            <img src="/twitter2.svg" alt="Twitter" className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow LabSphere on Instagram"
            className="hover:opacity-75 transition-opacity"
          >
            <img src="/instagram2.svg" alt="Instagram" className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow LabSphere on LinkedIn"
            className="hover:opacity-75 transition-opacity"
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Labsphere Text Background */}
      <div className="pt-16 text-[12vw] sm:text-[10vw] md:text-[6vw] lg:text-[8vw] font-bold text-center tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] text-[#2A787A]/75 select-none pointer-events-none">
        Labsphere
      </div>
    </footer>
  );
};

export default Footer;
