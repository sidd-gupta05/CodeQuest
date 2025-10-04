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
//   Image as ImageIcon,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   LocateFixed,
//   Calendar,
// } from 'lucide-react';

// import InputField from '@/components/InputField';
// import { supabase } from '@/utils/supabase/client';
// import { ScheduleForm } from '@/components/LabSlots/ScheduleForm';
// import { Input } from '@/components/ui/input';
// import { LabContext } from '@/app/context/LabContext';
// import ChangePasswordForm from './ChangePasswordForm';
// import NotificationSettings from './NotificationSetting';
// import LabTests from './LabTests';
// import { v4 as uuidv4 } from 'uuid';

// interface CheckboxFieldProps {
//   label: string;
//   id: string;
//   checked: boolean;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   icon?: React.ComponentType<{ className?: string }>;
// }

// interface FormData {
//   labName: string;
//   labContactNumber: string;
//   labEmailAddress: string;
//   testType: string;
//   nablCertificateNumber: string;
//   labLocation: string;
//   timeSlots: { date: string; time: string }[];
//   experienceYears: string;
//   imageUrl: string;
//   collectionTypes: string;
//   latitude: string;
//   longitude: string;
//   isAvailable: boolean;
// }

// interface LabDetails {
//   labName?: string;
//   labContactNumber?: string;
//   labEmailAddress?: string;
//   testType?: string;
//   nablCertificateNumber?: string;
//   labLocation?: string;
//   timeSlots?: { date: string; time: string }[];
//   experienceYears?: number;
//   imageUrl?: string;
//   collectionTypes?: string[];
//   latitude?: number;
//   longitude?: number;
//   isAvailable: boolean;
// }

// type ActiveTab =
//   | 'lab-settings'
//   | 'lab-tests'
//   | 'notification-settings'
//   | 'change-password';

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
//   const [activeTab, setActiveTab] = useState<ActiveTab>('lab-settings');
//   const [formData, setFormData] = useState<FormData>({
//     labName: '',
//     labContactNumber: '',
//     labEmailAddress: '',
//     testType: '',
//     nablCertificateNumber: '',
//     labLocation: '',
//     timeSlots: [{ date: '', time: '' }],
//     experienceYears: '',
//     imageUrl: '',
//     collectionTypes: '',
//     latitude: '',
//     longitude: '',
//     isAvailable: true,
//   });

//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   const contextData = useContext(LabContext);
//   const labId = contextData?.labId;
//   const labData = contextData?.labData;

//   useEffect(() => {
//     const fetchLabData = async () => {
//       if (!labId) return;

//       setFetching(true);
//       try {
//         const { data: labData, error: labError } = await supabase
//           .from('labs')
//           .select('nablCertificateNumber, labLocation')
//           .eq('id', labId)
//           .single();

//         if (labError) throw labError;

//         const { data: labDetails, error: detailsError } = await supabase
//           .from('lab_details')
//           .select('*')
//           .eq('labId', labId)
//           .single();

//         if (detailsError && detailsError.code !== 'PGRST116') {
//           throw detailsError;
//         }

//         setFormData({
//           labName: labDetails?.labName || '',
//           labContactNumber: labDetails?.labcontactNumber || '',
//           labEmailAddress: labDetails?.labemail || '',
//           testType: labDetails?.testType || '',
//           nablCertificateNumber: labData?.nablCertificateNumber || '',
//           labLocation: labData?.labLocation || '',
//           timeSlots: labDetails?.timeSlots || [{ date: '', time: '' }],
//           experienceYears: labDetails?.experienceYears?.toString() || '',
//           imageUrl: labDetails?.imageUrl || '',
//           collectionTypes: labDetails?.collectionTypes?.join(', ') || '',
//           latitude: labDetails?.latitude?.toString() || '',
//           longitude: labDetails?.longitude?.toString() || '',
//           isAvailable: labDetails?.isAvailable ?? true,
//         });
//       } catch (err: unknown) {
//         console.error('Error fetching lab data:', err);
//         setMessage('Error fetching lab data');
//         setIsError(true);
//       } finally {
//         setFetching(false);
//         setPageLoading(false);
//       }
//     };

//     // Simulate page loading with a slight delay to show the GIF
//     const timer = setTimeout(() => {
//       fetchLabData();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [labId]);

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

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'nablCertificateNumber') {
//       return;
//     }

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
//       setFormData((prev) => ({ ...prev, imageUrl: '' }));
//     } else {
//       setUploadedFile(null);
//       setImagePreviewUrl(null);
//     }
//   };

//   const handleRemoveImage = () => {
//     setUploadedFile(null);
//     setImagePreviewUrl(null);
//     setFormData((prev) => ({ ...prev, imageUrl: '' }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setIsError(false);

//     try {
//       let finalImageUrl = formData.imageUrl;

//       if (uploadedFile && labId) {
//         const cleanFileName = uploadedFile.name.replace(/\s+/g, '_');
//         const { error: fileError } = await supabase.storage
//           .from('uploads')
//           .upload(`lab/${labId}/${cleanFileName}`, uploadedFile, {
//             upsert: true,
//           });

//         if (fileError) throw new Error(fileError.message);

//         const { data: publicUrlData } = supabase.storage
//           .from('uploads')
//           .getPublicUrl(`lab/${labId}/${cleanFileName}`);

//         finalImageUrl = publicUrlData?.publicUrl || '';
//       }

//       const { error: labError } = await supabase
//         .from('labs')
//         .update({
//           labLocation: formData.labLocation,
//           updatedAt: new Date().toISOString(),
//         })
//         .eq('id', labId);

//       if (labError) throw new Error(`Lab update failed: ${labError.message}`);

//       const labDetailsPayload = {
//         id: uuidv4(),
//         labId: labId,
//         labName: formData.labName,
//         labcontactNumber: formData.labContactNumber,
//         labemail: formData.labEmailAddress,
//         testType: formData.testType || null,
//         experienceYears: formData.experienceYears
//           ? parseInt(formData.experienceYears)
//           : null,
//         imageUrl: finalImageUrl || null,
//         collectionTypes: formData.collectionTypes
//           ? formData.collectionTypes.split(',').map((s) => s.trim())
//           : [],
//         latitude: formData.latitude ? parseFloat(formData.latitude) : null,
//         longitude: formData.longitude ? parseFloat(formData.longitude) : null,
//         isAvailable: formData.isAvailable,
//       };

//       const { error: detailsError } = await supabase
//         .from('lab_details')
//         .upsert(labDetailsPayload, {
//           onConflict: 'labId',
//         });

//       if (detailsError)
//         throw new Error(`Lab details update failed: ${detailsError.message}`);

//       setMessage('Lab details saved successfully!');
//       setIsError(false);
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

//   const getInitials = (name: string) => {
//     if (!name) return '';
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'lab-tests':
//         return <LabTests />;

//       case 'notification-settings':
//         return <NotificationSettings />;

//       case 'change-password':
//         return <ChangePasswordForm />;

//       case 'lab-settings':
//       default:
//         return (
//           <>
//             <h3 className="text-xl font-medium text-gray-800 mb-2">My Lab</h3>
//             <p className="text-sm text-gray-500 mb-6">
//               This information will be displayed publicly so be careful what you
//               share.
//             </p>

//             {fetching ? (
//               <div className="flex justify-center items-center py-10">
//                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Profile Picture Section */}
//                 <div className="border border-gray-200 rounded-lg p-6">
//                   <h4 className="font-semibold text-gray-700 mb-4">
//                     Profile Picture
//                   </h4>
//                   <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                     <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                       {imagePreviewUrl || formData.imageUrl ? (
//                         <img
//                           src={imagePreviewUrl || formData.imageUrl}
//                           alt="Profile Preview"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-4xl text-gray-500 font-semibold">
//                           {getInitials(formData.labName)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="text-sm text-gray-500 flex-1 text-center sm:text-left">
//                       You can upload jpg, gif or png image files. Max size of
//                       3MB
//                     </div>
//                     <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//                       <button
//                         type="button"
//                         onClick={handleRemoveImage}
//                         className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
//                       >
//                         Remove
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           document.getElementById('file-upload')?.click()
//                         }
//                         className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] cursor-pointer"
//                       >
//                         Upload New Photo
//                       </button>
//                       <input
//                         id="file-upload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                         className="hidden"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Form Fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                   <InputField
//                     label="Lab Name"
//                     id="labName"
//                     name="labName"
//                     value={formData.labName}
//                     onChange={handleChange}
//                     placeholder="Enter your lab name"
//                   />
//                   <InputField
//                     label="Experience"
//                     id="experienceYears"
//                     name="experienceYears"
//                     value={formData.experienceYears}
//                     onChange={handleChange}
//                     placeholder="Enter Experience"
//                   />
//                   <InputField
//                     label="Lab Contact Number"
//                     id="labContactNumber"
//                     name="labContactNumber"
//                     value={formData.labContactNumber}
//                     onChange={handleChange}
//                     placeholder="e.g. +91 55656 56694"
//                   />
//                   <InputField
//                     label="Lab Email Address"
//                     id="labEmailAddress"
//                     name="labEmailAddress"
//                     value={formData.labEmailAddress}
//                     onChange={handleChange}
//                     placeholder="Enter lab's email address"
//                   />
//                   <InputField
//                     label="Test Type"
//                     id="testType"
//                     name="testType"
//                     value={formData.testType}
//                     onChange={handleChange}
//                     placeholder="Enter Test Type"
//                   />
//                   <InputField
//                     label="NABCL No."
//                     id="nablCertificateNumber"
//                     name="nablCertificateNumber"
//                     value={formData.nablCertificateNumber}
//                     onChange={handleChange}
//                     placeholder="ABCDEFGH"
//                     disabled={true}
//                   />
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Lab Location
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 items-center">
//                       <Input
//                         type="text"
//                         disabled
//                         id="latitude"
//                         name="latitude"
//                         value={formData.latitude}
//                         onChange={handleChange}
//                         placeholder="Latitude"
//                         className="px-3 py-2"
//                       />
//                       <Input
//                         type="text"
//                         disabled
//                         id="longitude"
//                         name="longitude"
//                         value={formData.longitude}
//                         onChange={handleChange}
//                         placeholder="Longitude"
//                         className="px-3 py-2"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleFetchLocation}
//                         className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] justify-center mt-2 md:mt-0 cursor-pointer"
//                       >
//                         <LocateFixed className="w-4 h-4 mr-2" />
//                         Fetch Location
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Weekly Schedule Section */}
//                 {labId && (
//                   <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
//                     <div className="flex justify-between items-center mb-6">
//                       <div className="flex items-center space-x-3">
//                         <div className="p-2 bg-emerald-100 rounded-lg">
//                           <Calendar className="w-5 h-5 text-[#006A6A]" />
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-800">
//                             Weekly Schedule
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             Set your lab's operating hours for each day
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white rounded-lg border border-gray-200 p-6">
//                       <ScheduleForm labId={labId} />
//                     </div>
//                   </div>
//                 )}

//                 {/* Save Changes Button */}
//                 <div className="mt-6 flex justify-start">
//                   <button
//                     type="submit"
//                     className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={loading}
//                   >
//                     {loading && (
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     )}
//                     {loading ? 'Saving Changes...' : 'Save Changes'}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {message && activeTab === 'lab-settings' && (
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
//           </>
//         );
//     }
//   };

//   // if (pageLoading) {
//   //   return (
//   //     <div className="flex min-h-screen bg-gray-50 items-center justify-center">
//   //       <div className="text-center">
//   //         <img src="/user.gif" alt="Loading..." className="mx-auto w-32 h-32" />
//   //         <p className="mt-4 text-gray-600">Loading profile...</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="flex-1">
//         <div className="flex items-start justify-center p-4 sm:p-6 lg:p-8 font-inter">
//           <div className="bg-white p-6 sm:p-8 rounded-xl w-full max-w-7xl">
//             {/* Header */}
//             <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
//               <span className="text-xl">Security & Settings</span>
//             </div>

//             {/* Tabs */}
//             <div className="flex space-x-2 mb-6 text-sm font-medium text-[#006A6A] bg-emerald-100 p-2 rounded-xl w-[570px]">
//               <button
//                 className={`px-4 py-2 rounded-md cursor-pointer ${
//                   activeTab === 'lab-settings'
//                     ? 'bg-[#006A6A] text-white'
//                     : 'hover:bg-[#005A5A] hover:text-white'
//                 }`}
//                 onClick={() => setActiveTab('lab-settings')}
//               >
//                 Lab Settings
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-md cursor-pointer ${
//                   activeTab === 'lab-tests'
//                     ? 'bg-[#006A6A] text-white'
//                     : 'hover:bg-[#005A5A] hover:text-white'
//                 }`}
//                 onClick={() => setActiveTab('lab-tests')}
//               >
//                 Lab Tests
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-md cursor-pointer ${
//                   activeTab === 'notification-settings'
//                     ? 'bg-[#006A6A] text-white'
//                     : 'hover:bg-[#005A5A] hover:text-white'
//                 }`}
//                 onClick={() => setActiveTab('notification-settings')}
//               >
//                 Notification Settings
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-md cursor-pointer ${
//                   activeTab === 'change-password'
//                     ? 'bg-[#006A6A] text-white'
//                     : 'hover:bg-[#005A5A] hover:text-white'
//                 }`}
//                 onClick={() => setActiveTab('change-password')}
//               >
//                 Change Password
//               </button>
//             </div>

//             {/* Main Content */}
//             {renderTabContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabForm;

// app/dashboard/lab/profile/page.tsx
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
import ChangePasswordForm from './ChangePasswordForm';
import NotificationSettings from './NotificationSetting';
import LabTests from './LabTests';
import { v4 as uuidv4 } from 'uuid';

interface CheckboxFieldProps {
  label: string;
  id: string;
  value: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FormData {
  labName: string;
  labContactNumber: string;
  labEmailAddress: string;
  testType: string;
  labLocation: string;
  timeSlots: { date: string; time: string }[];
  experienceYears: string;
  imageUrl: string;
  collectionTypes: string[];
  latitude: string;
  longitude: string;
  isAvailable: boolean;
}

interface LabDetails {
  labName?: string;
  labContactNumber?: string;
  labEmailAddress?: string;
  testType?: string;
  labLocation?: string;
  timeSlots?: { date: string; time: string }[];
  experienceYears?: number;
  imageUrl?: string;
  collectionTypes?: string[];
  latitude?: number;
  longitude?: number;
  isAvailable: boolean;
}

type ActiveTab =
  | 'lab-settings'
  | 'lab-tests'
  | 'notification-settings'
  | 'change-password';

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  value,
  checked,
  onChange,
  icon: Icon,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      name={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
    />
    <label
      htmlFor={id}
      className="ml-2 block text-sm text-gray-900 cursor-pointer"
    >
      {Icon && <Icon className="inline-block w-4 h-4 mr-2 text-indigo-500" />}
      {label}
    </label>
  </div>
);

const LabForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab-settings');
  const [formData, setFormData] = useState<FormData>({
    labName: '',
    labContactNumber: '',
    labEmailAddress: '',
    testType: '',
    labLocation: '',
    timeSlots: [{ date: '', time: '' }],
    experienceYears: '',
    imageUrl: '',
    collectionTypes: [],
    latitude: '',
    longitude: '',
    isAvailable: true,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const contextData = useContext(LabContext);
  const labId = contextData?.labId;
  const labData = contextData?.labData;

  useEffect(() => {
    const fetchLabData = async () => {
      if (!labId) return;

      setFetching(true);
      try {
        const { data: labData, error: labError } = await supabase
          .from('labs')
          .select('labLocation')
          .eq('id', labId)
          .single();

        if (labError) throw labError;

        const { data: labDetails, error: detailsError } = await supabase
          .from('lab_details')
          .select('*')
          .eq('labId', labId)
          .single();

        if (detailsError && detailsError.code !== 'PGRST116') {
          throw detailsError;
        }

        setFormData({
          labName: labDetails?.labName || '',
          labContactNumber: labDetails?.labcontactNumber || '',
          labEmailAddress: labDetails?.labemail || '',
          testType: labDetails?.testType || '',
          labLocation: labData?.labLocation || '',
          timeSlots: labDetails?.timeSlots || [{ date: '', time: '' }],
          experienceYears: labDetails?.experienceYears?.toString() || '',
          imageUrl: labDetails?.imageUrl || '',
          collectionTypes: labDetails?.collectionTypes || [],
          latitude: labDetails?.latitude?.toString() || '',
          longitude: labDetails?.longitude?.toString() || '',
          isAvailable: labDetails?.isAvailable ?? true,
        });
      } catch (err: unknown) {
        console.error('Error fetching lab data:', err);
        setMessage('Error fetching lab data');
        setIsError(true);
      } finally {
        setFetching(false);
        setPageLoading(false);
      }
    };

    // Simulate page loading with a slight delay to show the GIF
    const timer = setTimeout(() => {
      fetchLabData();
    }, 500);

    return () => clearTimeout(timer);
  }, [labId]);

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

  const handleCollectionTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        // Add the collection type if checked
        return {
          ...prev,
          collectionTypes: [...prev.collectionTypes, value],
        };
      } else {
        // Remove the collection type if unchecked
        return {
          ...prev,
          collectionTypes: prev.collectionTypes.filter(
            (type) => type !== value
          ),
        };
      }
    });
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
      }

      const { error: labError } = await supabase
        .from('labs')
        .update({
          labLocation: formData.labLocation,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', labId);

      if (labError) throw new Error(`Lab update failed: ${labError.message}`);

      const labDetailsPayload = {
        id: uuidv4(),
        labId: labId,
        labName: formData.labName,
        labcontactNumber: formData.labContactNumber,
        labemail: formData.labEmailAddress,
        testType: formData.testType || null,
        experienceYears: formData.experienceYears
          ? parseInt(formData.experienceYears)
          : null,
        imageUrl: finalImageUrl || null,
        collectionTypes: formData.collectionTypes,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        isAvailable: formData.isAvailable,
      };

      const { error: detailsError } = await supabase
        .from('lab_details')
        .upsert(labDetailsPayload, {
          onConflict: 'labId',
        });

      if (detailsError)
        throw new Error(`Lab details update failed: ${detailsError.message}`);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lab-tests':
        return <LabTests />;

      case 'notification-settings':
        return <NotificationSettings />;

      case 'change-password':
        return <ChangePasswordForm />;

      case 'lab-settings':
      default:
        return (
          <>
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
                        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById('file-upload')?.click()
                        }
                        className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] cursor-pointer"
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
                    placeholder="e.g. +91 55656 56694"
                  />
                  <InputField
                    label="Lab Email Address"
                    id="labEmailAddress"
                    name="labEmailAddress"
                    value={formData.labEmailAddress}
                    onChange={handleChange}
                    placeholder="Enter lab's email address"
                  />

                  {/* Test Type and Collection Types in the same row */}
                  <InputField
                    label="Test Type"
                    id="testType"
                    name="testType"
                    value={formData.testType}
                    onChange={handleChange}
                    placeholder="Enter Test Type"
                  />

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Collection Types
                    </label>
                    <div className="flex flex-col space-y-2">
                      <CheckboxField
                        label="Home Collection"
                        id="homeCollection"
                        value="Home Collection"
                        checked={formData.collectionTypes.includes(
                          'Home Collection'
                        )}
                        onChange={handleCollectionTypeChange}
                      />
                      <CheckboxField
                        label="Visit to Lab"
                        id="visitToLab"
                        value="Visit to Lab"
                        checked={formData.collectionTypes.includes(
                          'Visit to Lab'
                        )}
                        onChange={handleCollectionTypeChange}
                      />
                    </div>
                  </div>

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
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] justify-center mt-2 md:mt-0 cursor-pointer"
                      >
                        <LocateFixed className="w-4 h-4 mr-2" />
                        Fetch Location
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weekly Schedule Section */}
                {labId && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-[#006A6A]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Weekly Schedule
                          </h3>
                          <p className="text-sm text-gray-600">
                            Set your lab&apos;s operating hours for each day
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <ScheduleForm labId={labId} />
                    </div>
                  </div>
                )}

                {/* Save Changes Button */}
                <div className="mt-6 flex justify-start">
                  <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

            {message && activeTab === 'lab-settings' && (
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
          </>
        );
    }
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
            <div className="flex space-x-2 mb-6 text-sm font-medium text-[#006A6A] bg-emerald-100 p-2 rounded-xl w-[570px]">
              <button
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  activeTab === 'lab-settings'
                    ? 'bg-[#006A6A] text-white'
                    : 'hover:bg-[#005A5A] hover:text-white'
                }`}
                onClick={() => setActiveTab('lab-settings')}
              >
                Lab Settings
              </button>
              <button
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  activeTab === 'lab-tests'
                    ? 'bg-[#006A6A] text-white'
                    : 'hover:bg-[#005A5A] hover:text-white'
                }`}
                onClick={() => setActiveTab('lab-tests')}
              >
                Lab Tests
              </button>
              <button
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  activeTab === 'notification-settings'
                    ? 'bg-[#006A6A] text-white'
                    : 'hover:bg-[#005A5A] hover:text-white'
                }`}
                onClick={() => setActiveTab('notification-settings')}
              >
                Notification Settings
              </button>
              <button
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  activeTab === 'change-password'
                    ? 'bg-[#006A6A] text-white'
                    : 'hover:bg-[#005A5A] hover:text-white'
                }`}
                onClick={() => setActiveTab('change-password')}
              >
                Change Password
              </button>
            </div>

            {/* Main Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabForm;
