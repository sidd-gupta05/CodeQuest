import Image from 'next/image';
import React from 'react'
// import '@/app/global.css'; // Ensure global styles are imported
const LabSearch = () => {
  return (
    <>
            <section className="text-center mt-10">
              <h1 className="text-4xl font-bold text-[#2B7C7E] drop-shadow-sm">
                Lab Search
              </h1>
    
              <div
                className="mt-6 flex flex-wrap justify-center gap-3 px-4"
                style={{ fontFamily: 'Lufga Regular, Urbanist, sans-serif' }}
              >
                <div className="border border-[#2B7C7E] rounded-[64px] bg-white backdrop-blur-md p-4 shadow-lg flex items-center gap-3">
    
            <div className="relative ">
                    <div className="absolute  inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                      <Image
                        src="/hospital.svg"
                        alt="Hospital"
                        width={20}
                        height={20}
                      />
                    </div>
                  
                  <input
                    type="text"
                    placeholder="Search for nearby Pathlabs"
                    className="px-10 py-2 border-r-2 border-[#E6E8EE] w-74 text-black focus:outline-none"
                  />
                  </div>
    
                  <div className="relative w-52">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                      <Image
                        src="/location.svg"
                        alt="Location"
                        width={18}
                        height={18}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      className="pl-10 pr-3 py-2 w-full border-r-2 border-[#E6E8EE] text-black focus:outline-none"
                    />
                  </div>
    
                  <div className="relative w-52">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <Image
                        src="/calender.svg"
                        alt="Calendar"
                        width={18}
                        height={18}
                      /> */}
                    </div>
                    <input 
                      type="date"
                      className="pl-2 pr-3 py-2 w-full  text-[#6b7684] focus:outline-none "
                    />
                  </div>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                    </div>
                    <button className="px-6 py-3 rounded-full bg-[#2B7C7E] text-white font-semibold flex gap-1.5 hover:bg-[#236667]"
                    style={{ fontFamily: 'ClashDisplay-SemiBold, Urbanist, sans-serif' }}>
                      <Image
                        src="/search.svg"
                        alt="Search"
                        width={18}
                        height={18}
                      />
                      Search
                    </button>
                  </div>
                </div>
                </section>
    </>
  )
}

export default LabSearch;