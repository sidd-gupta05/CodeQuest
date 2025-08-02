'use client';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  FlaskConical,
  Image,
  Tag,
  User, // Replaced with LabName, but keeping User icon for general identification
  Loader2,
  CheckCircle,
  XCircle,
  Briefcase,
  PlusCircle,
  MinusCircle,
  Clock, // For time input
  LocateFixed, // For fetching location
  CheckSquare,
} from 'lucide-react';
import { MapPin } from 'lucide-react';

import InputField from '@/components/InputField';
import { supabase } from '@/utils/supabase/client';

// Reusable Checkbox Component
const CheckboxField = ({ label, id, checked, onChange, icon: Icon }) => (
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

// Main LabForm component
const LabForm = () => {
  const [formData, setFormData] = useState({
    labName: '',
    testType: '',
    timeSlots: [{ date: '', time: '' }],
    experienceYears: '',
    imageUrl: '', // This will store the URL after upload
    collectionTypes: '',
    latitude: '',
    longitude: '',
    isAvailable: true, // New field
  });

  const [uploadedFile, setUploadedFile] = useState(null); // For file input
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For image preview

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);


  const handleFetchLocation = () => {
    setMessage('');
    setIsError(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setMessage('Location fetched successfully!');
          setIsError(false);
        },
        (error) => {
          setMessage(`Error fetching location: ${error.message}`);
          setIsError(true);
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
      setIsError(true);
    }
  };

  // Effect to fetch lab data if labId or labName is in the URL query
  useEffect(() => {
    
    const fetchLabData = async () => {
      setFetching(true);
      setMessage('');
      setIsError(false);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const labId = urlParams.get('labId');
        const labNameParam = urlParams.get('labName');

        let fetchUrl = '';
        if (labId) {
          fetchUrl = `/api/labs?labId=${labId}`;
        } else if (labNameParam) {
          fetchUrl = `/api/labs?labName=${labNameParam}`;
        }

        if (fetchUrl) {
          const response = await fetch(fetchUrl);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch lab data.');
          }

          setFormData({
            labName: data.labName || '',
            testType: data.testType || '',
            timeSlots:
              data.timeSlots && data.timeSlots.length > 0
                ? data.timeSlots.map((slot) => ({
                    date: slot.date
                      ? new Date(slot.date).toISOString().split('T')[0]
                      : '',
                    time: slot.time || '',
                  }))
                : [{ date: '', time: '' }],
            experienceYears: data.experienceYears || '',
            imageUrl: data.imageUrl || '', // Set fetched image URL
            collectionTypes: Array.isArray(data.collectionTypes)
              ? data.collectionTypes.join(', ')
              : '',
            latitude: data.latitude || '',
            longitude: data.longitude || '',
            isAvailable: data.isAvailable ?? true, // Set fetched availability, default to true
          });
          // If an image URL is fetched, set it for preview
          if (data.imageUrl) {
            setImagePreviewUrl(data.imageUrl);
          }
          setMessage('Lab data loaded successfully!');
          setIsError(false);
        }
      } catch (error) {
        setMessage(error.message || 'Failed to load lab data.');
        setIsError(true);
        console.error('Fetch error:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchLabData();
  }, []); // Run once on component mount
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setFormData((prevData) => ({
      ...prevData,
      timeSlots: newTimeSlots,
    }));
  };

  const addTimeSlotField = () => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlots: [...prevData.timeSlots, { date: '', time: '' }],
    }));
  };

  const removeTimeSlotField = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlots: prevData.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a local URL for preview
    } else {
      setUploadedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    // TODO: Unable to get labId from localStorage, so fetching user data directly
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
    
        localStorage.setItem('labId', user?.id || '');
        console.log('User data:', user?.id, user?.role);
        if (error || !user) {
          console.error('No user found:', error?.message);
          return;
        }


         let finalImageUrl = formData.imageUrl; // default
    
        if (uploadedFile) {
          const cleanFileName = uploadedFile.name.replace(/\s+/g, '_');
          const { data: fileData, error: fileError } = await supabase.storage
            .from('uploads')
            .upload(`lab/${user?.id}/${cleanFileName}`, uploadedFile);

          if (fileError) {
            console.error('File upload error:', fileError.message);
            alert('Failed to upload certificate');
            return;
          }

          console.log('Simulating file upload:', uploadedFile.name);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
          finalImageUrl = `https://unrlzieuyrsibokkqqbm.supabase.co/storage/v1/object/public/uploads/labs/${user?.id}/${uploadedFile.name.replace(/\s+/g, '_')}`;
          setFinalImageUrl(finalImageUrl);
          console.log('Simulated uploaded image URL:', finalImageUrl);

        }
    

    try {
      // Prepare data for API
      const payload = {
        labName: formData.labName,
        testType: formData.testType || null,
        // Filter out empty time slots and send as array of objects
        nextAvailable: formData.timeSlots
          .filter((slot) => slot.date && slot.time) // Only send slots with both date and time
          .map((slot) => ({
            date: slot.date, // Date string (YYYY-MM-DD)
            time: slot.time, // Time string (HH:MM)
          })),
        experienceYears: formData.experienceYears
          ? parseInt(formData.experienceYears)
          : null,
        imageUrl: finalImageUrl || null, // Use the uploaded URL or existing one
        collectionTypes: formData.collectionTypes ? formData.collectionTypes.split(',').map(item => item.trim()) : [],
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        isAvailable: formData.isAvailable,
      };

      console.log('Submitting payload:', payload);

      const response = await fetch('/api/labs', {
        method: 'POST', // Use POST for both create/update based on API logic
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Include cookies for authentication
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong!');
      }

      setMessage(data.message || 'Lab data added/updated successfully!');
      setIsError(false);
      // Optionally clear form or reset state after successful submission
      setFormData({
        labName: '',
        testType: '',
        timeSlots: [{ date: '', time: '' }],
        experienceYears: '',
        imageUrl: '',
        collectionTypes: '',
        latitude: '',
        longitude: '',
        isAvailable: true, // Reset availability to true
      });
    } catch (error) {
      setMessage(error.message || 'Failed to add/update lab data.');
      setIsError(true);
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter"
      style={{ background: 'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)' }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8 flex items-center justify-center">
          <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-indigo-600" />
          {fetching ? 'Loading Lab Data...' : 'Lab Details'}
        </h1>

        {fetching ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField
              label="Lab Name"
              id="labName"
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              icon={FlaskConical}
              placeholder="e.g., Central Lab Diagnostics"
              required
            />
            <InputField
              label="Test Type"
              id="testType"
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              icon={Tag}
              placeholder="e.g., Blood Test, MRI"
            />

            <div className="md:col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline-block w-4 h-4 mr-2 text-indigo-500" />
                Available Time Slots
              </label>
              {formData.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center mb-2 space-x-2">
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => handleTimeSlotChange(index, 'date', e.target.value)}
                    className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    aria-label={`Date for slot ${index + 1}`}
                  />
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => handleTimeSlotChange(index, 'time', e.target.value)}
                    className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    aria-label={`Time for slot ${index + 1}`}
                  />
                  {formData.timeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlotField(index)}
                      className="p-2 text-red-600 hover:text-red-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Remove time slot"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTimeSlotField}
                className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add another time slot
              </button>
            </div>

            <InputField
              label="Experience Years"
              type="number"
              id="experienceYears"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              icon={Briefcase}
              placeholder="e.g., 10"
              min="0"
            />

            {/* Lab Location Fields */}
            <div className="md:col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline-block w-4 h-4 mr-2 text-indigo-500" />
                Lab Location
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude"
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  step="any"
                />
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude"
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  step="any"
                />
              </div>
              <button
                type="button"
                onClick={handleFetchLocation}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                <LocateFixed className="w-4 h-4 mr-2" />
                Fetch Current Location
              </button>
            </div>

            {/* Available Checkbox */}
            <div className="md:col-span-2">
              <CheckboxField
                label="Available"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                icon={CheckSquare}
              />
            </div>

            {/* Image Upload Field */}
            <div className="md:col-span-2 mb-4">
              <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">
                <Image className="inline-block w-4 h-4 mr-2 text-indigo-500" />
                Lab Image
              </label>
              <input
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              />
              {imagePreviewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <img
                    src={imagePreviewUrl}
                    alt="Lab Preview"
                    className="w-full max-w-xs h-auto rounded-md shadow-md object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Error"; }}
                  />
                </div>
              )}
               {/* Display existing image URL if no new file is selected and URL exists */}
               {!uploadedFile && formData.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Current Lab Image"
                    className="w-full max-w-xs h-auto rounded-md shadow-md object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Error"; }}
                  />
                </div>
              )}
            </div>

            <InputField
              label="Collection Types (comma-separated)"
              id="collectionTypes"
              name="collectionTypes"
              value={formData.collectionTypes}
              onChange={handleChange}
              icon={Tag}
              placeholder="e.g., Home, Clinic, Drive-thru"
            />

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? 'Submitting...' : 'Save Lab Details'}
              </button>
            </div>
          </form>
        )}

        {message && (
          <div
            className={`mt-6 p-4 rounded-md flex items-center ${
              isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {isError ? <XCircle className="h-5 w-5 mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabForm;
