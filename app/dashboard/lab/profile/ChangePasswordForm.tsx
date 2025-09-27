// app/dashboard/lab/profile/ChangePasswordForm.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import InputField from '@/components/InputField';
import { supabase } from '@/utils/supabase/client';

const ChangePasswordForm: React.FC = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    const { newPassword, confirmPassword } = passwords;

    // Validation
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      setIsError(true);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage(
        'Password updated successfully! You may need to log in again with your new password.'
      );
      setIsError(false);

      // Reset form
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage('An unexpected error occurred.');
      }
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Change Password
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Update your password to keep your account secure. You'll be logged out
          of all devices after changing your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div className="relative">
          <InputField
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            value={passwords.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            icon={undefined}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <InputField
            label="New Password"
            id="newPassword"
            name="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            value={passwords.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
            icon={undefined}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <InputField
            label="Confirm New Password"
            id="confirmPassword"
            name="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={passwords.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your new password"
            icon={undefined}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> After changing your password, you'll need to
            log in again on all devices.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md flex items-center ${
              isError
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isError ? (
              <XCircle className="h-5 w-5 mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="flex justify-start">
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
