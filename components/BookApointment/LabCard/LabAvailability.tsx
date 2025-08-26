import React, { useEffect, useState } from 'react';
import { Lab } from '../Filters/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/utils/supabase/client';

interface LabAvailabilityProps {
  lab: Lab;
}

export const LabAvailability: React.FC<LabAvailabilityProps> = ({ lab }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
        } else {
          console.log('Current user:', user);
          setUser(user);
        }
      } catch (error) {
        console.error('Error in fetchUser:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleBookingClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in first to book an appointment');
      router.push('/auth/sign_in'); // Redirect to sign-in page
      return;
    }

    // Uncomment this if you want to prevent labs from booking
    // if (user.user_metadata?.role === 'LAB') {
    //   e.preventDefault();
    //   toast.error('Labs are not allowed to book appointments');
    //   return;
    // }

    // Allow booking for authenticated users
    return;
  };

  return (
    <>
      <div>
        <p className="text-sm font-semibold">Next available at</p>
        <p className="text-md font-bold text-[#2A787A]">{lab.nextAvailable}</p>
        {lab.timeSlots && (
          <div className="mt-2">
            <p className="text-sm font-semibold mb-1">Available Time Slots:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(lab.timeSlots).map(([period, slots]) => (
                <div key={period} className="mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    {period}:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {slots.map((slot, index) =>
                      slot !== '-' ? (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer"
                        >
                          {slot}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Link
        href={{
          pathname: '/Booking',
          query: {
            labId: lab.id,
          },
        }}
        onClick={handleBookingClick}
        className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg cursor-pointer md:mt-22 text-center ${
          lab.nextAvailable === 'Not Available'
            ? 'bg-gray-300 text-gray-500 pointer-events-none'
            : 'bg-[#2A787A] hover:bg-[#1e3232] text-white'
        }`}
      >
        Book Appointment
      </Link>
    </>
  );
};

// // components/BookAppointment/LabCard/LabAvailability.tsx
// import React, { useEffect, useState } from 'react';
// import { Lab } from '../Filters/types';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookies';

// interface LabAvailabilityProps {
//   lab: Lab;
// }

// export const LabAvailability: React.FC<LabAvailabilityProps> = ({ lab }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   console.log(isAuthenticated, userRole);

//   // useEffect(() => {
//   //   // Function to get cookie value by name

//   //   const getCookie = (name: string): string | null => {
//   //     if (typeof document === 'undefined') return null;

//   //     const value = `; ${document.cookie}`;
//   //     const parts = value.split(`; ${name}=`);
//   //     if (parts.length === 2) {
//   //       return parts.pop()?.split(';').shift() || null;
//   //     }
//   //     return null;
//   //   };

//   //   const userAud = getCookie('user-aud');
//   //   const role = getCookie('user-role');

//   //   console.log('user-aud cookie:', userAud);

//   //   setIsAuthenticated(!!userAud);
//   //   setUserRole(role);
//   // }, []);
//   useEffect(() => {
//     const userAud = Cookies.get('user-aud');
//     const role = Cookies.get('user-role');

//     setIsAuthenticated(!!userAud);
//     setUserRole(role || null);
//   }, []);

//   const handleBookingClick = (e: React.MouseEvent) => {
//     if (!isAuthenticated) {
//       e.preventDefault();
//       toast.error('Please sign in first to book an appointment');
//       return;
//     }

//     if (userRole === 'LAB') {
//       e.preventDefault();
//       toast.error('Labs are not allowed to book appointments');
//       return;
//     }

//     // Allow booking for authenticated patients
//     return;
//   };

//   return (
//     <>
//       <div>
//         <p className="text-sm font-semibold">Next available at</p>
//         <p className="text-md font-bold text-[#2A787A]">{lab.nextAvailable}</p>
//         {lab.timeSlots && (
//           <div className="mt-2">
//             <p className="text-sm font-semibold mb-1">Available Time Slots:</p>
//             <div className="flex flex-wrap gap-2">
//               {Object.entries(lab.timeSlots).map(([period, slots]) => (
//                 <div key={period} className="mb-2">
//                   <span className="text-xs font-medium text-gray-600">
//                     {period}:
//                   </span>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     {slots.map((slot, index) =>
//                       slot !== '-' ? (
//                         <span
//                           key={index}
//                           className="text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer"
//                         >
//                           {slot}
//                         </span>
//                       ) : null
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <Link
//         href={{
//           pathname: '/Booking',
//           query: {
//             labId: lab.id,
//           },
//         }}
//         onClick={handleBookingClick}
//         className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg cursor-pointer md:mt-22 text-center ${
//           lab.nextAvailable === 'Not Available'
//             ? 'bg-gray-300 text-gray-500 pointer-events-none'
//             : 'bg-[#2A787A] hover:bg-[#1e3232] text-white'
//         }`}
//       >
//         Book Appointment
//       </Link>
//     </>
//   );
// };
