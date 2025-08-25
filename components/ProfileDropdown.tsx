// import React from 'react';
// import type { User } from '@supabase/supabase-js';
// import { Mail, Phone, LogOut, X } from 'lucide-react';

// interface ProfileData {
//   firstName: string;
//   lastName: string;
//   phone?: string;
// }

// interface ProfileDropdownProps {
//   user: User;
//   profileData: ProfileData | null;
//   onClose: () => void;
//   onLogout: () => void;
// }

// export function ProfileDropdown({
//   user,
//   profileData,
//   onClose,
//   onLogout,
// }: ProfileDropdownProps) {
//   const userInitials = profileData
//     ? `${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`.toUpperCase()
//     : user.email?.[0].toUpperCase();

//   const fullName = profileData
//     ? `${profileData.firstName} ${profileData.lastName}`
//     : 'User';

//   return (
//     // DESIGN: Added a subtle animation and a more defined shadow
//     <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95">
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//         <h3 className="text-sm font-semibold text-gray-900">Account</h3>
//         <button
//           onClick={onClose}
//           className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//         >
//           <X className="h-4 w-4" />
//         </button>
//       </div>

//       <div className="px-4 py-4">
//         {/* DESIGN: Improved layout for user info */}
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-xl font-bold text-white">
//             {userInitials}
//           </div>
//           <div className="truncate">
//             <p className="truncate text-sm font-semibold text-gray-900">
//               {fullName}
//             </p>
//             <p className="truncate text-sm text-gray-500">{user.email}</p>
//           </div>
//         </div>

//         {/* DESIGN: Added phone number with an icon */}
//         {profileData?.phone && (
//           <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
//             <Phone className="h-4 w-4 text-gray-400" />
//             <span>{profileData.phone}</span>
//           </div>
//         )}
//       </div>

//       {/* DESIGN: Clean divider */}
//       <hr className="border-gray-100" />

//       <div className="p-2">
//         {/* DESIGN: Redesigned sign-out button with an icon */}
//         <button
//           onClick={onLogout}
//           className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//         >
//           <LogOut className="h-4 w-4" />
//           Sign Out
//         </button>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import type { User } from '@supabase/supabase-js';
import {
  User as UserIcon,
  X,
  Mail,
  Phone,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

// Define the shape of your profile data based on your Prisma schema
interface ProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  // Add any other fields from your 'users' table you might need
}

interface ProfileDropdownProps {
  user: User;
  profileData: ProfileData | null;
  onClose: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({
  user,
  profileData,
  onClose,
  onLogout,
}: ProfileDropdownProps) {
  // UI/UX FIX: Create initials from the user's name for a better avatar
  const userInitials = profileData
    ? `${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`.toUpperCase()
    : user.email?.[0].toUpperCase();

  // FIX 1: Construct the full name from firstName and lastName
  const fullName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`
    : 'User';

    console.log('Profile Data:', user);
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-1000 border border-gray-200 transition-all duration-200 ease-in-out transform">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">My Profile</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close profile dropdown"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          {/* UI/UX FIX: Better avatar with user initials */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <p className="text-md font-semibold text-gray-900 truncate">
              {fullName}
            </p>
            {/* FIX 2: Ensure user.email is always displayed */}
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 flex-shrink-0" />
              {/* Guaranteed Email Visibility */}
              <span className="truncate">{user?.email || 'Loading...'}</span>
            </p>
          </div>
        </div>

        {/* UI/UX FIX: Display phone number if available */}
        {/* Guaranteed Phone Visibility */}
        {profileData?.phone && (
          <div className="text-sm text-gray-500 flex items-center gap-2 mt-3">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{profileData.phone}</span>
          </div>
        )}

        {/* UI/UX FIX: Clearer section for connection status */}
        <div className="mt-5 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Connected with
          </p>
          <div className="flex items-center space-x-2">
            {user.app_metadata?.provider === 'google' ? (
              <>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Google</span>
              </>
            ) : (
              <span className="text-sm text-gray-700 font-medium">
                Email & Password
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="py-2">
        {/* SIGN OUT FIX: The onClick now directly calls the onLogout prop. */}
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
