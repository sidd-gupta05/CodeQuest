//components/landingPage/StatsSection.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';

export default function StatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) setStartCount(true);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="flex justify-center items-center bg-white w-full py-10 select-none pointer-events-none"
    >
      <div
        className="flex flex-col sm:flex-row justify-between w-full max-w-5xl px-6 text-center"
        style={{ fontFamily: 'ClashDisplay-Medium, Urbanist, sans-serif' }}
      >
        <div>
          <h2
            className="text-5xl font-extrabold text-black"
            style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
          >
            {startCount && <CountUp end={10000} duration={2} separator="," />}+
          </h2>
          <p className={`text-[#363D4F] text-3xl mt-2`}>Tests Processed</p>
        </div>
        <div>
          <h2
            className="text-5xl font-extrabold text-black"
            style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
          >
            {startCount && <CountUp end={300} duration={2} />}+
          </h2>
          <p className={`text-[#363D4F] mt-2 text-3xl`}>Verified Labs</p>
        </div>
        <div>
          <h2
            className="text-5xl font-extrabold text-black"
            style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
          >
            {startCount && <CountUp end={50} duration={2} />}+
          </h2>
          <p className={`text-[#363D4F] text-3xl mt-2`}>Cities Covered</p>
        </div>
      </div>
    </div>
  );
}
