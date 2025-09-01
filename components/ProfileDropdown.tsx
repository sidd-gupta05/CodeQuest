// components/ProfileDropdown.tsx
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
import Image from 'next/image';

interface ProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  role: 'PATIENT' | 'LAB';
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
  const userInitials = profileData
    ? `${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`.toUpperCase()
    : user.email?.[0].toUpperCase();

  const fullName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`
    : 'User';

  const profileTitle =
    profileData?.role === 'LAB' ? 'Lab Profile' : 'Patient Profile';

  console.log('Profile Data:', user);
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-1000 border border-gray-200 transition-all duration-200 ease-in-out transform">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">{profileTitle}</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close profile dropdown"
        >
          <X className="h-4 w-4 text-gray-500 cursor-pointer" />
        </button>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <p className="text-md font-semibold text-gray-900 truncate">
              {fullName}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {user.user_metadata.email || 'Loading...'}
              </span>
            </p>
          </div>
        </div>

        {profileData?.phone && (
          <div className="text-sm text-gray-500 flex items-center gap-2 mt-3">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{profileData.phone}</span>
          </div>
        )}

        {/* Display role information */}
        <div className="text-sm text-gray-500 flex items-center gap-2 mt-3">
          <UserIcon className="w-4 h-4 flex-shrink-0 " />
          <span className="capitalize">
            {profileData?.role?.toLowerCase() || 'user'}
          </span>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Connected with
          </p>
          <div className="flex items-center space-x-2">
            {user.app_metadata?.provider === 'google' ? (
              <>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border">
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-sm text-gray-700">Google</span>
              </>
            ) : (
              <span className="text-sm text-gray-700 font-medium">
                Email & Phone
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="py-2">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
