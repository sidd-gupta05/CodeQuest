'use client';

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useContext,
} from 'react';
import {
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  XCircle,
  LocateFixed,
  Calendar,
} from 'lucide-react';

import InputField from '@/components/InputField';
import { supabase } from '@/utils/supabase/client';
import { ScheduleForm } from '@/components/LabSlots/ScheduleForm';
import { Input } from '@/components/ui/input';
import { LabContext } from '@/app/context/LabContext';

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FormData {
  labName: string;
  labContactNumber: string;
  labEmailAddress: string;
  testType: string;
  nabclNo: string;
  labLocation: string;
  timeSlots: { date: string; time: string }[];
  experienceYears: string;
  imageUrl: string;
  collectionTypes: string;
  latitude: string;
  longitude: string;
  isAvailable: boolean;
}

interface LabDetails {
  labName?: string;
  labContactNumber?: string;
  labEmailAddress?: string;
  testType?: string;
  nabclNo?: string;
  labLocation?: string;
  timeSlots?: { date: string; time: string }[];
  experienceYears?: number;
  imageUrl?: string;
  collectionTypes?: string[];
  latitude?: number;
  longitude?: number;
  isAvailable: boolean;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  checked,
  onChange,
  icon: Icon,
}) => (
  <div className="mb-4 flex items-center">
    <input
      type="checkbox"
      id={id}
      name={id}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
    <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
      {Icon && <Icon className="inline-block w-4 h-4 mr-2 text-indigo-500" />}
      {label}
    </label>
  </div>
);

const LabForm: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    labName: '',
    labContactNumber: '',
    labEmailAddress: '',
    testType: '',
    nabclNo: '',
    labLocation: '',
    timeSlots: [{ date: '', time: '' }],
    experienceYears: '',
    imageUrl: '',
    collectionTypes: '',
    latitude: '',
    longitude: '',
    isAvailable: true,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const contextData = useContext(LabContext);
  const labId = contextData?.labId;
  const labData = contextData?.labData;

  useEffect(() => {
    if (labData) {
      setFormData({
        labName: labData?.labName || '',
        labContactNumber: labData?.labContactNumber || '',
        labEmailAddress: labData?.labEmailAddress || '',
        testType: labData?.testType || '',
        nabclNo: labData?.nabclNo || '',
        labLocation: labData?.labLocation || '',
        timeSlots: labData?.timeSlots || [{ date: '', time: '' }],
        experienceYears: labData?.experienceYears?.toString() || '',
        imageUrl: labData?.imageUrl || '',
        collectionTypes: labData?.collectionTypes?.join(', ') || '',
        latitude: labData?.latitude?.toString() || '',
        longitude: labData?.longitude?.toString() || '',
        isAvailable: labData?.isAvailable,
      });
    }
  }, [labData]);

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setMessage('Location fetched successfully!');
          setIsError(false);
        },
        (error) => {
          setMessage(`Error fetching location: ${error.message}`);
          setIsError(true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    } else {
      setUploadedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setImagePreviewUrl(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      let finalImageUrl = formData.imageUrl;

      if (uploadedFile && labId) {
        const cleanFileName = uploadedFile.name.replace(/\s+/g, '_');
        const { error: fileError } = await supabase.storage
          .from('uploads')
          .upload(`lab/${labId}/${cleanFileName}`, uploadedFile, {
            upsert: true,
          });

        if (fileError) throw new Error(fileError.message);

        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(`lab/${labId}/${cleanFileName}`);

        finalImageUrl = publicUrlData?.publicUrl || '';
      } else if (finalImageUrl === '') {
        // Handle image removal from storage if needed, though this is a simplification
      }

      const payload = {
        labName: formData.labName,
        labContactNumber: formData.labContactNumber,
        labEmailAddress: formData.labEmailAddress,
        testType: formData.testType || null,
        nabclNo: formData.nabclNo,
        labLocation: formData.labLocation,
        experienceYears: formData.experienceYears
          ? parseInt(formData.experienceYears)
          : null,
        imageUrl: finalImageUrl || null,
        collectionTypes: formData.collectionTypes
          ? formData.collectionTypes.split(',').map((s) => s.trim())
          : [],
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        isAvailable: formData.isAvailable,
        pathlabId: labId || null,
      };

      const response = await fetch('/api/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save lab');

      setMessage('Lab details saved successfully!');
      setIsError(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('Something went wrong!');
      }
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="flex items-start justify-center p-4 sm:p-6 lg:p-8 font-inter">
          <div className="bg-white p-6 sm:p-8 rounded-xl w-full max-w-7xl">
            {/* Header */}
            <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              <span className="text-xl">Security & Settings</span>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 text-sm font-medium text-emerald-700 bg-emerald-100 p-2 rounded-xl w-[570px]">
              <button className="px-4 py-2 bg-emerald-700 text-white rounded-md">
                Lab Settings
              </button>
              <button className="px-4 py-2 hover:bg-emerald-700 hover:text-white rounded-md">
                Lab Tests
              </button>
              <button className="px-4 py-2 hover:bg-emerald-700 hover:text-white rounded-md">
                Notification Settings
              </button>
              <button className="px-4 py-2 hover:bg-emerald-700 hover:text-white rounded-md">
                Change Password
              </button>
            </div>

            {/* Main Content */}
            <h3 className="text-xl font-medium text-gray-800 mb-2">My Lab</h3>
            <p className="text-sm text-gray-500 mb-6">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            {fetching ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Profile Picture
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {imagePreviewUrl || formData.imageUrl ? (
                        <img
                          src={imagePreviewUrl || formData.imageUrl}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-gray-500 font-semibold">
                          {getInitials(formData.labName)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex-1 text-center sm:text-left">
                      You can upload jpg, gif or png image files. Max size of
                      3MB
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById('file-upload')?.click()
                        }
                        className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-emerald-700 hover:bg-emerald-800"
                      >
                        Upload New Photo
                      </button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputField
                    label="Lab Name"
                    id="labName"
                    name="labName"
                    value={formData.labName}
                    onChange={handleChange}
                    placeholder="Enter your lab name"
                  />
                  <InputField
                    label="Experience"
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="Enter Experience"
                  />
                  <InputField
                    label="Lab Contact Number"
                    id="labContactNumber"
                    name="labContactNumber"
                    value={formData.labContactNumber}
                    onChange={handleChange}
                    placeholder="e.g., +91 5565 5669 456"
                  />
                  <InputField
                    label="Lab Email Address"
                    id="labEmailAddress"
                    name="labEmailAddress"
                    value={formData.labEmailAddress}
                    onChange={handleChange}
                    placeholder="Enter lab's email address"
                  />
                  <InputField
                    label="Lab Type"
                    id="testType"
                    name="testType"
                    value={formData.testType}
                    onChange={handleChange}
                    placeholder="Enter Lab Type"
                  />
                  <InputField
                    label="NABCL No."
                    id="nabclNo"
                    name="nabclNo"
                    value={formData.nabclNo}
                    onChange={handleChange}
                    placeholder="ABCDEFGH"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Location
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 items-center">
                      <Input
                        type="text"
                        disabled
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Latitude"
                        className="px-3 py-2"
                      />
                      <Input
                        type="text"
                        disabled
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Longitude"
                        className="px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={handleFetchLocation}
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white  bg-emerald-700 hover:bg-emerald-800 justify-center mt-2 md:mt-0"
                      >
                        <LocateFixed className="w-4 h-4 mr-2" />
                        Fetch Location
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weekly Schedule Section */}
                {labId && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="flex items-center text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                        Weekly Schedule
                      </p>
                      <div className="flex items-center space-x-2">
                        {/* <Checkbox id="repeat-all" /> */}
                        {/* <Label htmlFor="repeat-all" className="text-sm">
                          Repeat for all
                        </Label> */}
                      </div>
                    </div>
                    <ScheduleForm labId={labId} />
                  </div>
                )}

                {/* Save Changes Button */}
                <div className="mt-6 flex justify-start">
                  <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-emerald-700 hover:bg-emerald-800"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {message && (
              <div
                className={`mt-6 p-4 rounded-md flex items-center ${
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabForm;
