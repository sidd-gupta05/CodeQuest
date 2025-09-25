//app/dashboard/lab/profile/page.tsx
'use client';

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useContext,
} from 'react';
import {
  FlaskConical,
  Image as ImageIcon,
  Tag,
  Loader2,
  CheckCircle,
  XCircle,
  Briefcase,
  LocateFixed,
  MapPin,
  Calendar,
} from 'lucide-react';

import InputField from '@/components/InputField';
import { supabase } from '@/utils/supabase/client';
import { ScheduleForm } from '@/components/LabSlots/ScheduleForm';
import { Input } from '@/components/ui/input';
import AsideNavbar from '@/components/Lab/AsideNavbar';
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
  testType: string;
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
  testType?: string;
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
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    labName: '',
    testType: '',
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
        testType: labData?.testType || '',
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

  // ---------------- Location ----------------
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

  // ---------------- Handlers ----------------
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
    } else {
      setUploadedFile(null);
      setImagePreviewUrl(null);
    }
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
          .upload(`lab/${labId}/${cleanFileName}`, uploadedFile);

        if (fileError) throw new Error(fileError.message);

        finalImageUrl = `https://unrlzieuyrsibokkqqbm.supabase.co/storage/v1/object/public/uploads/lab/${labId}/${cleanFileName}`;
      }

      const payload = {
        labName: formData.labName,
        testType: formData.testType || null,
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

  // ---------------- Render ----------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <AsideNavbar isOpen={isNavOpen} onToggle={() => setIsNavOpen(!isNavOpen)} /> */}

      <div className="flex-1">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 flex items-center justify-center">
              {/* <FlaskConical className="w-8 h-8 mr-3 text-indigo-600" /> */}
              {fetching ? 'Loading Data...' : 'Settings'}
            </h2>

            {fetching ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline-block w-4 h-4 mr-2 text-indigo-500" />
                    Lab Location
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      type="number"
                      disabled
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Latitude"
                      className="w-1/2 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                      step="any"
                    />
                    <Input
                      type="number"
                      disabled
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Longitude"
                      className="w-1/2 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                      step="any"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    <LocateFixed className="w-4 h-4 mr-2" />
                    Fetch Current Location
                  </button>
                </div>

                {/* Availability */}
                <CheckboxField
                  label="Available"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <ImageIcon className="inline-block w-4 h-4 mr-2 text-indigo-500" />
                    Lab Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="mt-3 w-full max-w-xs rounded-md shadow-md"
                    />
                  ) : labData?.imageUrl ? (
                    <img
                      src={labData.imageUrl}
                      alt="Current Lab"
                      className="mt-3 w-full max-w-xs rounded-md shadow-md"
                    />
                  ) : null}
                </div>

                <div className="mt-4">
                  <InputField
                    label="Collection Types (comma-separated)"
                    id="collectionTypes"
                    name="collectionTypes"
                    value={formData.collectionTypes}
                    onChange={handleChange}
                    icon={Tag}
                    placeholder="e.g., Home, Clinic"
                  />
                </div>

                {/* Weekly Schedule */}
                {labId && (
                  <div>
                    <p className="flex text-sm font-medium text-gray-700 items-center mb-3">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                      Weekly Schedule
                    </p>
                    <ScheduleForm labId={labId} />
                  </div>
                )}

                <div className="mt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    {loading ? 'Submitting...' : 'Save Lab Details'}
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

// // app/dashboard/lab/profile/page.tsx
// 'use client';

// import React, {
//   useState,
//   useEffect,
//   ChangeEvent,
//   FormEvent,
//   useContext,
// } from 'react';
// import {
//   FlaskConical,
//   Briefcase,
//   LocateFixed,
//   MapPin,
//   Mail,
//   Building,
//   CheckCircle,
//   XCircle,
//   Loader2,
//   Calendar,
// } from 'lucide-react';
// import { LabContext } from '@/app/context/LabContext';
// import { supabase } from '@/utils/supabase/client';
// import InputField from '@/components/InputField';
// import { Input } from '@/components/ui/input';

// interface FormData {
//   labName: string;
//   experienceYears: string;
//   contactNumber: string;
//   email: string;
//   testType: string;
//   nablCertificateNumber: string;
//   labLocation: string;
//   latitude: string;
//   longitude: string;
//   imageUrl: string;
// }

// interface Schedule {
//   [key: string]: {
//     enabled: boolean;
//     startTime: string;
//     endTime: string;
//   };
// }

// const LabProfilePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('Lab Settings');
//   const [formData, setFormData] = useState<FormData>({
//     labName: '',
//     experienceYears: '',
//     contactNumber: '',
//     email: '',
//     testType: '',
//     nablCertificateNumber: '',
//     labLocation: '',
//     latitude: '',
//     longitude: '',
//     imageUrl: '',
//   });

//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);
//   const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);

//   // Weekly Schedule State
//   const initialSchedule: Schedule = {
//     Monday: { enabled: false, startTime: '', endTime: '' },
//     Tuesday: { enabled: false, startTime: '', endTime: '' },
//     Wednesday: { enabled: false, startTime: '', endTime: '' },
//     Thursday: { enabled: false, startTime: '', endTime: '' },
//     Friday: { enabled: false, startTime: '', endTime: '' },
//     Saturday: { enabled: false, startTime: '', endTime: '' },
//     Sunday: { enabled: false, startTime: '', endTime: '' },
//   };
//   const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
//   const [repeatForAll, setRepeatForAll] = useState(false);

//   const contextData = useContext(LabContext);
//   const labId = contextData?.labId;
//   const labData = contextData?.labData;

//   useEffect(() => {
//     if (labData) {
//       setFormData({
//         labName: labData.labName || '',
//         experienceYears: labData.experienceYears?.toString() || '',
//         contactNumber: labData.contactNumber || '',
//         email: labData.email || '',
//         testType: labData.testType || '',
//         nablCertificateNumber: labData.nablCertificateNumber || '',
//         labLocation: labData.labLocation || '',
//         latitude: labData.latitude?.toString() || '',
//         longitude: labData.longitude?.toString() || '',
//         imageUrl: labData.imageUrl || '',
//       });
//       setImagePreviewUrl(labData.imageUrl || null);
//       setSavedImageUrl(labData.imageUrl || null);

//       // Fetch schedule data if available
//       fetchScheduleData();
//     }
//   }, [labData]);

//   const fetchScheduleData = async () => {
//     if (!labId) return;

//     try {
//       const response = await fetch(`/api/lab/schedule?labId=${labId}`);
//       if (response.ok) {
//         const scheduleData = await response.json();
//         if (scheduleData) {
//           setSchedule(scheduleData);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching schedule:', error);
//     }
//   };

//   const handleFetchLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData((prev) => ({
//             ...prev,
//             latitude: position.coords.latitude.toFixed(6),
//             longitude: position.coords.longitude.toFixed(6),
//           }));
//           setMessage('Location fetched successfully!');
//           setIsError(false);
//         },
//         (error) => {
//           setMessage(`Error fetching location: ${error.message}`);
//           setIsError(true);
//         }
//       );
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setUploadedFile(file);
//       setImagePreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleScheduleChange = (
//     day: string,
//     field: 'startTime' | 'endTime' | 'enabled',
//     value: string | boolean
//   ) => {
//     setSchedule((prev) => {
//       const newSchedule = { ...prev };
//       const updatedDay = { ...newSchedule[day], [field]: value };
//       newSchedule[day] = updatedDay;

//       if (repeatForAll && (field === 'startTime' || field === 'endTime')) {
//         Object.keys(newSchedule).forEach((d) => {
//           if (newSchedule[d].enabled) {
//             newSchedule[d][field] = value as string;
//           }
//         });
//       }
//       return newSchedule;
//     });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let finalImageUrl = formData.imageUrl;

//       // Upload new image if one was selected
//       if (uploadedFile && labId) {
//         const cleanFileName = `profile_${Date.now()}`;
//         const { error } = await supabase.storage
//           .from('uploads')
//           .upload(`lab/${labId}/${cleanFileName}`, uploadedFile, {
//             upsert: true,
//           });

//         if (error) throw new Error(error.message);

//         finalImageUrl = `https://unrlzieuyrsibokkqqbm.supabase.co/storage/v1/object/public/uploads/lab/${labId}/${cleanFileName}`;
//         setSavedImageUrl(finalImageUrl);
//       }

//       // Prepare payload for API
//       const payload = {
//         labId: labId,
//         details: {
//           labName: formData.labName,
//           experienceYears: formData.experienceYears
//             ? parseInt(formData.experienceYears)
//             : null,
//           contactNumber: formData.contactNumber,
//           email: formData.email,
//           testType: formData.testType,
//           latitude: formData.latitude ? parseFloat(formData.latitude) : null,
//           longitude: formData.longitude ? parseFloat(formData.longitude) : null,
//           imageUrl: finalImageUrl,
//         },
//         lab: {
//           nablCertificateNumber: formData.nablCertificateNumber,
//           labLocation: formData.labLocation,
//         },
//         schedule: schedule,
//       };

//       // Send update request
//       const response = await fetch('/api/lab/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error('Failed to save details');

//       setMessage('Changes saved successfully!');
//       setIsError(false);

//       // Reset uploaded file state after successful save
//       setUploadedFile(null);
//     } catch (err: any) {
//       setMessage(err.message || 'An error occurred.');
//       setIsError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const daysOfWeek = Object.keys(initialSchedule);

//   return (
//     <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">
//           Security & Settings
//         </h1>

//         {/* Header Tabs */}
//         <div className="flex border-b">
//           {['Lab Settings', 'Change Password', 'Notification Settings'].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`py-2 px-4 text-sm font-medium rounded-t-md ${
//                   activeTab === tab
//                     ? 'bg-teal-500 text-white'
//                     : 'text-gray-500 hover:bg-gray-200'
//                 }`}
//               >
//                 {tab}
//               </button>
//             )
//           )}
//         </div>

//         {/* Form Container */}
//         <div className="bg-white rounded-b-lg rounded-r-lg border border-t-0 p-6 sm:p-8">
//           <h2 className="text-xl font-bold text-gray-800">My Lab</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             This information will be displayed publicly so be careful what you
//             share.
//           </p>

//           <form onSubmit={handleSubmit} className="mt-6 space-y-8">
//             {/* Profile Picture Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Profile Picture
//               </label>
//               <div className="mt-2 flex items-center space-x-6">
//                 <div className="relative">
//                   <img
//                     src={
//                       imagePreviewUrl ||
//                       savedImageUrl ||
//                       'https://via.placeholder.com/100'
//                     }
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-200"
//                   />
//                   {savedImageUrl && (
//                     <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white">
//                       <CheckCircle className="w-4 h-4 text-white" />
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-500">
//                     You can upload jpg, gif or png image files. Max size of 3MB.
//                   </p>
//                   <div className="flex items-center space-x-3 mt-3">
//                     <button
//                       type="button"
//                       className="text-sm font-medium px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
//                       onClick={() => {
//                         setUploadedFile(null);
//                         setImagePreviewUrl(savedImageUrl);
//                       }}
//                     >
//                       Remove
//                     </button>
//                     <label className="cursor-pointer text-sm text-white font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-md">
//                       Upload New Photo
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                       />
//                     </label>
//                   </div>
//                   {uploadedFile && (
//                     <p className="text-xs text-teal-600 mt-2">
//                       New image selected. Save changes to update.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Lab Details Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//               <InputField
//                 label="Lab Name"
//                 name="labName"
//                 value={formData.labName}
//                 onChange={handleChange}
//                 placeholder="Enter your lab name"
//               />
//               <InputField
//                 label="Experience"
//                 name="experienceYears"
//                 type="number"
//                 value={formData.experienceYears}
//                 onChange={handleChange}
//                 placeholder="Enter Experience"
//               />
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Lab Contact Number
//                 </label>
//                 <div className="flex">
//                   <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
//                     IN +91
//                   </span>
//                   <Input
//                     name="contactNumber"
//                     value={formData.contactNumber}
//                     onChange={handleChange}
//                     placeholder="565 5669 456"
//                     className="rounded-l-none"
//                   />
//                 </div>
//               </div>
//               <InputField
//                 label="Lab Email Address"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter lab's email address"
//               />
//               <InputField
//                 label="Lab Type"
//                 name="testType"
//                 value={formData.testType}
//                 onChange={handleChange}
//                 placeholder="Enter Lab Type"
//               />
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   NABL No.
//                 </label>
//                 <Input
//                   name="nablCertificateNumber"
//                   value={formData.nablCertificateNumber}
//                   onChange={handleChange}
//                   disabled
//                   className="bg-gray-100 cursor-not-allowed"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   NABL certificate number cannot be changed
//                 </p>
//               </div>
//               <div className="md:col-span-2">
//                 <InputField
//                   label="Lab Location"
//                   name="labLocation"
//                   value={formData.labLocation}
//                   onChange={handleChange}
//                   placeholder="Enter full lab address"
//                 />
//               </div>
//               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField
//                   label="Latitude"
//                   name="latitude"
//                   value={formData.latitude}
//                   onChange={handleChange}
//                   placeholder="Latitude"
//                   disabled
//                 />
//                 <InputField
//                   label="Longitude"
//                   name="longitude"
//                   value={formData.longitude}
//                   onChange={handleChange}
//                   placeholder="Longitude"
//                   disabled
//                 />
//               </div>
//               <div className="md:col-span-2 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={handleFetchLocation}
//                   className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200"
//                 >
//                   <LocateFixed className="w-4 h-4 mr-2" />
//                   Fetch Location
//                 </button>
//               </div>
//             </div>

//             {/* Weekly Schedule Section */}
//             <div>
//               <h3 className="font-bold text-gray-800 flex items-center">
//                 <Calendar className="w-5 h-5 mr-2 text-teal-600" />
//                 Weekly Schedule
//               </h3>
//               <div className="space-y-3 mt-4">
//                 {daysOfWeek.map((day) => (
//                   <div
//                     key={day}
//                     className="grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-2 items-center"
//                   >
//                     <div className="sm:col-span-3 flex items-center">
//                       <input
//                         type="checkbox"
//                         id={`${day}-enabled`}
//                         checked={schedule[day].enabled}
//                         onChange={(e) =>
//                           handleScheduleChange(day, 'enabled', e.target.checked)
//                         }
//                         className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
//                       />
//                       <label
//                         htmlFor={`${day}-enabled`}
//                         className={`ml-3 block text-sm font-medium ${['Saturday', 'Sunday'].includes(day) ? 'text-red-600' : 'text-gray-700'}`}
//                       >
//                         {day}
//                       </label>
//                     </div>
//                     <div className="sm:col-span-4">
//                       <Input
//                         type="time"
//                         value={schedule[day].startTime}
//                         onChange={(e) =>
//                           handleScheduleChange(day, 'startTime', e.target.value)
//                         }
//                         disabled={!schedule[day].enabled}
//                         placeholder="Work Starts at"
//                         className="text-gray-500"
//                       />
//                     </div>
//                     <div className="sm:col-span-4">
//                       <Input
//                         type="time"
//                         value={schedule[day].endTime}
//                         onChange={(e) =>
//                           handleScheduleChange(day, 'endTime', e.target.value)
//                         }
//                         disabled={!schedule[day].enabled}
//                         placeholder="Work Ends at"
//                         className="text-gray-500"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 flex items-center justify-end">
//                 <input
//                   type="checkbox"
//                   id="repeat"
//                   checked={repeatForAll}
//                   onChange={(e) => setRepeatForAll(e.target.checked)}
//                   className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
//                 />
//                 <label
//                   htmlFor="repeat"
//                   className="ml-2 block text-sm text-gray-900"
//                 >
//                   Repeat for all enabled days
//                 </label>
//               </div>
//             </div>

//             {/* Status Message */}
//             {message && (
//               <div
//                 className={`p-4 rounded-md flex items-center ${
//                   isError
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-green-100 text-green-800'
//                 }`}
//               >
//                 {isError ? (
//                   <XCircle className="h-5 w-5 mr-2" />
//                 ) : (
//                   <CheckCircle className="h-5 w-5 mr-2" />
//                 )}
//                 <p className="text-sm font-medium">{message}</p>
//               </div>
//             )}

//             {/* Save Button */}
//             <div className="pt-5 border-t mt-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
//               >
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {loading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabProfilePage;

// app/dashboard/lab/profile/page.tsx
// 'use client';

// import React, {
//   useState,
//   useEffect,
//   ChangeEvent,
//   FormEvent,
//   useContext,
// } from 'react';
// import {
//   FlaskConical,
//   Image as ImageIcon,
//   Tag,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   Briefcase,
//   LocateFixed,
//   MapPin,
//   Calendar,
//   Phone,
//   Mail,
//   Award,
// } from 'lucide-react';

// import InputField from '@/components/InputField';
// import { supabase } from '@/utils/supabase/client';
// import { ScheduleForm } from '@/components/LabSlots/ScheduleForm';
// import { Input } from '@/components/ui/input';
// import { LabContext } from '@/app/context/LabContext';

// interface CheckboxFieldProps {
//   label: string;
//   id: string;
//   checked: boolean;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   icon?: React.ComponentType<{ className?: string }>;
// }

// interface FormData {
//   labName: string;
//   testType: string;
//   experienceYears: string;
//   imageUrl: string;
//   collectionTypes: string;
//   latitude: string;
//   longitude: string;
//   isAvailable: boolean;
//   contactNumber: string;
//   email: string;
//   nablCertificateNumber: string;
// }

// interface LabDetails {
//   labName?: string;
//   testType?: string;
//   experienceYears?: number;
//   imageUrl?: string;
//   collectionTypes?: string[];
//   latitude?: number;
//   longitude?: number;
//   isAvailable: boolean;
//   contactNumber?: string;
//   email?: string;
//   nablCertificateNumber?: string;
// }

// interface LabData {
//   details?: LabDetails;
//   lab?: {
//     nablCertificateNumber?: string;
//     labLocation?: string;
//     contactNumber?: string;
//     email?: string;
//   };
// }

// const CheckboxField: React.FC<CheckboxFieldProps> = ({
//   label,
//   id,
//   checked,
//   onChange,
//   icon: Icon,
// }) => (
//   <div className="mb-4 flex items-center">
//     <input
//       type="checkbox"
//       id={id}
//       name={id}
//       checked={checked}
//       onChange={onChange}
//       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//     />
//     <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
//       {Icon && <Icon className="inline-block w-4 h-4 mr-2 text-indigo-500" />}
//       {label}
//     </label>
//   </div>
// );

// const LabForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     labName: '',
//     testType: '',
//     experienceYears: '',
//     imageUrl: '',
//     collectionTypes: '',
//     latitude: '',
//     longitude: '',
//     isAvailable: true,
//     contactNumber: '',
//     email: '',
//     nablCertificateNumber: '',
//   });

//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   const contextData = useContext(LabContext);
//   const labId = contextData?.labId;
//   const labData = contextData?.labData as LabData;

//   // Fetch lab data including NABL certificate from Lab model
//   useEffect(() => {
//     const fetchLabData = async () => {
//       if (!labId) return;

//       setFetching(true);
//       try {
//         const response = await fetch(`/api/lab/full-data?labId=${labId}`);
//         if (response.ok) {
//           const fullLabData = await response.json();

//           // Merge data from both Lab and LabDetails models
//           setFormData({
//             labName: fullLabData.details?.labName || '',
//             testType: fullLabData.details?.testType || '',
//             experienceYears:
//               fullLabData.details?.experienceYears?.toString() || '',
//             imageUrl: fullLabData.details?.imageUrl || '',
//             collectionTypes:
//               fullLabData.details?.collectionTypes?.join(', ') || '',
//             latitude: fullLabData.details?.latitude?.toString() || '',
//             longitude: fullLabData.details?.longitude?.toString() || '',
//             isAvailable: fullLabData.details?.isAvailable ?? true,
//             contactNumber:
//               fullLabData.lab?.contactNumber ||
//               fullLabData.details?.contactNumber ||
//               '',
//             email: fullLabData.lab?.email || fullLabData.details?.email || '',
//             nablCertificateNumber: fullLabData.lab?.nablCertificateNumber || '',
//           });

//           if (fullLabData.details?.imageUrl) {
//             setImagePreviewUrl(fullLabData.details.imageUrl);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching lab data:', error);
//         setMessage('Error loading lab data');
//         setIsError(true);
//       } finally {
//         setFetching(false);
//       }
//     };

//     if (labId) {
//       fetchLabData();
//     }
//   }, [labId]);

//   // ---------------- Location ----------------
//   const handleFetchLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData((prev) => ({
//             ...prev,
//             latitude: position.coords.latitude.toFixed(6),
//             longitude: position.coords.longitude.toFixed(6),
//           }));
//           setMessage('Location fetched successfully!');
//           setIsError(false);
//         },
//         (error) => {
//           setMessage(`Error fetching location: ${error.message}`);
//           setIsError(true);
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     }
//   };

//   // ---------------- Handlers ----------------
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setUploadedFile(file);
//       setImagePreviewUrl(URL.createObjectURL(file));
//     } else {
//       setUploadedFile(null);
//       setImagePreviewUrl(null);
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setIsError(false);

//     try {
//       let finalImageUrl = formData.imageUrl;

//       // Upload new image if provided
//       if (uploadedFile && labId) {
//         const cleanFileName = uploadedFile.name.replace(/\s+/g, '_');
//         const { error: fileError } = await supabase.storage
//           .from('uploads')
//           .upload(`lab/${labId}/${cleanFileName}`, uploadedFile);

//         if (fileError) throw new Error(fileError.message);

//         finalImageUrl = `https://unrlzieuyrsibokkqqbm.supabase.co/storage/v1/object/public/uploads/lab/${labId}/${cleanFileName}`;
//       }

//       // Prepare payload for both Lab and LabDetails models
//       const payload = {
//         labId: labId,
//         details: {
//           labName: formData.labName,
//           testType: formData.testType || null,
//           experienceYears: formData.experienceYears
//             ? parseInt(formData.experienceYears)
//             : null,
//           imageUrl: finalImageUrl || null,
//           collectionTypes: formData.collectionTypes
//             ? formData.collectionTypes.split(',').map((s) => s.trim())
//             : [],
//           latitude: formData.latitude ? parseFloat(formData.latitude) : null,
//           longitude: formData.longitude ? parseFloat(formData.longitude) : null,
//           isAvailable: formData.isAvailable,
//           contactNumber: formData.contactNumber || null,
//           email: formData.email || null,
//         },
//         lab: {
//           contactNumber: formData.contactNumber || null,
//           email: formData.email || null,
//           // NABL certificate is read-only from the form, but we include it for completeness
//           nablCertificateNumber: formData.nablCertificateNumber || null,
//         },
//       };

//       const response = await fetch('/api/lab/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok)
//         throw new Error(data.error || 'Failed to save lab details');

//       setMessage('Lab details saved successfully!');
//       setIsError(false);

//       // Refresh the image preview with the new URL
//       if (finalImageUrl && finalImageUrl !== formData.imageUrl) {
//         setImagePreviewUrl(finalImageUrl);
//         setFormData((prev) => ({ ...prev, imageUrl: finalImageUrl }));
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setMessage(err.message);
//       } else {
//         setMessage('Something went wrong!');
//       }
//       setIsError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Render ----------------
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="flex-1">
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
//           <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
//             <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//               {fetching ? 'Loading Data...' : 'Lab Settings'}
//             </h2>

//             {fetching ? (
//               <div className="flex justify-center items-center py-10">
//                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//               </div>
//             ) : (
//               <form
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 gap-y-4"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                   <InputField
//                     label="Lab Name"
//                     id="labName"
//                     name="labName"
//                     value={formData.labName}
//                     onChange={handleChange}
//                     icon={FlaskConical}
//                     placeholder="e.g., Central Lab Diagnostics"
//                     required
//                   />
//                   <InputField
//                     label="Test Type"
//                     id="testType"
//                     name="testType"
//                     value={formData.testType}
//                     onChange={handleChange}
//                     icon={Tag}
//                     placeholder="e.g., Blood Test, MRI"
//                   />
//                   <InputField
//                     label="Experience Years"
//                     type="number"
//                     id="experienceYears"
//                     name="experienceYears"
//                     value={formData.experienceYears}
//                     onChange={handleChange}
//                     icon={Briefcase}
//                     placeholder="e.g., 10"
//                     min="0"
//                   />
//                   <InputField
//                     label="Contact Number"
//                     id="contactNumber"
//                     name="contactNumber"
//                     value={formData.contactNumber}
//                     onChange={handleChange}
//                     icon={Phone}
//                     placeholder="e.g., +91 9876543210"
//                   />
//                   <InputField
//                     label="Email"
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     icon={Mail}
//                     placeholder="e.g., contact@lab.com"
//                   />
//                   <InputField
//                     label="NABL Certificate Number"
//                     id="nablCertificateNumber"
//                     name="nablCertificateNumber"
//                     value={formData.nablCertificateNumber}
//                     onChange={handleChange}
//                     icon={Award}
//                     placeholder="e.g., NABL12345"
//                     disabled
//                   />
//                 </div>

//                 {/* Location Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     <MapPin className="inline-block w-4 h-4 mr-2 text-indigo-500" />
//                     Lab Location Coordinates
//                   </label>
//                   <div className="flex space-x-2 mb-2">
//                     <Input
//                       type="number"
//                       id="latitude"
//                       name="latitude"
//                       value={formData.latitude}
//                       onChange={handleChange}
//                       placeholder="Latitude"
//                       className="w-1/2 px-3 py-2"
//                       step="any"
//                     />
//                     <Input
//                       type="number"
//                       id="longitude"
//                       name="longitude"
//                       value={formData.longitude}
//                       onChange={handleChange}
//                       placeholder="Longitude"
//                       className="w-1/2 px-3 py-2"
//                       step="any"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleFetchLocation}
//                     className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
//                   >
//                     <LocateFixed className="w-4 h-4 mr-2" />
//                     Fetch Current Location
//                   </button>
//                 </div>

//                 {/* Availability */}
//                 <CheckboxField
//                   label="Available for Bookings"
//                   id="isAvailable"
//                   checked={formData.isAvailable}
//                   onChange={handleChange}
//                 />

//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     <ImageIcon className="inline-block w-4 h-4 mr-2 text-indigo-500" />
//                     Lab Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                   />
//                   {imagePreviewUrl && (
//                     <img
//                       src={imagePreviewUrl}
//                       alt="Lab Preview"
//                       className="mt-3 w-full max-w-xs rounded-md shadow-md"
//                     />
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <InputField
//                     label="Collection Types (comma-separated)"
//                     id="collectionTypes"
//                     name="collectionTypes"
//                     value={formData.collectionTypes}
//                     onChange={handleChange}
//                     icon={Tag}
//                     placeholder="e.g., Home, Clinic, Hospital"
//                   />
//                 </div>

//                 {/* Weekly Schedule */}
//                 {labId && (
//                   <div>
//                     <p className="flex text-sm font-medium text-gray-700 items-center mb-3">
//                       <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
//                       Weekly Schedule
//                     </p>
//                     <ScheduleForm labId={labId} />
//                   </div>
//                 )}

//                 <div className="mt-6">
//                   <button
//                     type="submit"
//                     className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading && (
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     )}
//                     {loading ? 'Saving...' : 'Save Lab Details'}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {message && (
//               <div
//                 className={`mt-6 p-4 rounded-md flex items-center ${
//                   isError
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-green-100 text-green-800'
//                 }`}
//               >
//                 {isError ? (
//                   <XCircle className="h-5 w-5 mr-2" />
//                 ) : (
//                   <CheckCircle className="h-5 w-5 mr-2" />
//                 )}
//                 <p className="text-sm font-medium">{message}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabForm;
