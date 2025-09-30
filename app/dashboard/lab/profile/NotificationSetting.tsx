// app/dashboard/lab/profile/NotificationSettings.tsx
'use client';

import React, { useState, ChangeEvent } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  description: string;
  sentFrequency: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  checked,
  onChange,
  description,
  sentFrequency,
}) => (
  <div className="flex items-start mb-4">
    <div className="flex items-center h-5">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
      />
    </div>
    <div className="ml-3 text-sm flex-1">
      <label htmlFor={id} className="font-medium text-gray-900">
        {label}
      </label>
      <p className="text-gray-500">{description}</p>
      <p className="text-xs text-gray-400 mt-1">Sent {sentFrequency}</p>
    </div>
  </div>
);

const NotificationSettings: React.FC = () => {
  const [emailSettings, setEmailSettings] = useState({
    announcements: true,
    savings: true,
    feedback: true,
    healthTips: true,
    informational: true,
  });

  const [smsSettings, setSmsSettings] = useState({
    announcements: true,
    savings: true,
    feedback: true,
    healthTips: true,
    informational: true,
  });

  const [whatsappSettings, setWhatsappSettings] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEmailSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSmsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSmsSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWhatsappSettings(e.target.checked);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setMessage('');
    setIsError(false);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage('Notification settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Notification Settings
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Manage how you receive notifications and updates from our platform.
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Email Settings
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          You are currently receiving all promotional communications on{' '}
          <span className="font-semibold text-gray-700">
            Labsphere@gmail.com
          </span>{' '}
          <span className="text-emerald-700 cursor-pointer">(Change)</span>
        </p>
        <div className="space-y-4">
          <CheckboxField
            label="Announcements"
            id="announcements"
            checked={emailSettings.announcements}
            onChange={handleEmailChange}
            description="Most important updates on new and exciting products. Sent around once in a month."
            sentFrequency="around once in a month."
          />
          <CheckboxField
            label="Savings"
            id="savings"
            checked={emailSettings.savings}
            onChange={handleEmailChange}
            description="Get exclusive discount and offers to save money on your healthcare bill. Sent Usually once in 15 days"
            sentFrequency="Usually once in 15 days"
          />
          <CheckboxField
            label="Feedback"
            id="feedback"
            checked={emailSettings.feedback}
            onChange={handleEmailChange}
            description="Get beta invitations, Surveys and feedback forms, for sharing your suggestions. Sent once in a month."
            sentFrequency="once in a month."
          />
          <CheckboxField
            label="Health Tips"
            id="healthTips"
            checked={emailSettings.healthTips}
            onChange={handleEmailChange}
            description="Get the most insightful health tips and articles from verified doctors. Sent 1-2 times per week"
            sentFrequency="1-2 times per week"
          />
          <CheckboxField
            label="Informational"
            id="informational"
            checked={emailSettings.informational}
            onChange={handleEmailChange}
            description="Get to know what's the latest through our newsletters, product updates and more! Sent once in a week."
            sentFrequency="once in a week."
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">SMS Settings</h3>
        <p className="text-sm text-gray-500 mb-4">
          You are currently receiving all promotional communications on{' '}
          <span className="font-semibold text-gray-700">+123456789009</span>{' '}
          <span className="text-emerald-700 cursor-pointer">(Change)</span>
        </p>
        <div className="space-y-4">
          <CheckboxField
            label="Announcements"
            id="smsAnnouncements"
            checked={smsSettings.announcements}
            onChange={handleSmsChange}
            description="Most important updates on new and exciting products. Sent around once in a month."
            sentFrequency="around once in a month."
          />
          <CheckboxField
            label="Savings"
            id="smsSavings"
            checked={smsSettings.savings}
            onChange={handleSmsChange}
            description="Get exclusive discount and offers to save money on your healthcare bill. Sent Usually once in 15 days"
            sentFrequency="Usually once in 15 days"
          />
          <CheckboxField
            label="Feedback"
            id="smsFeedback"
            checked={smsSettings.feedback}
            onChange={handleSmsChange}
            description="Get beta invitations, Surveys and feedback forms, for sharing your suggestions. Sent once in a month."
            sentFrequency="once in a month."
          />
          <CheckboxField
            label="Health Tips"
            id="smsHealthTips"
            checked={smsSettings.healthTips}
            onChange={handleSmsChange}
            description="Get the most insightful health tips and articles from verified doctors. Sent 1-2 times per week"
            sentFrequency="1-2 times per week"
          />
          <CheckboxField
            label="Informational"
            id="smsInformational"
            checked={smsSettings.informational}
            onChange={handleSmsChange}
            description="Get to know what's the latest through our newsletters, product updates and more! Sent once in a week."
            sentFrequency="once in a week."
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          WhatsApp Settings
        </h3>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="whatsappUpdates"
              name="whatsappUpdates"
              type="checkbox"
              checked={whatsappSettings}
              onChange={handleWhatsappChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="whatsappUpdates"
              className="font-medium text-gray-900"
            >
              I want to receive important notifications and updates via WhatsApp
            </label>
            <p className="text-gray-500">You can Disable these at any time</p>
          </div>
          <div className="ml-auto text-emerald-700 cursor-pointer">
            (Change)
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          type="button"
          onClick={handleSaveChanges}
          className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div
          className={`mt-6 p-4 rounded-md flex items-center ${
            isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
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
    </div>
  );
};

export default NotificationSettings;
