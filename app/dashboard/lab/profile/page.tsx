// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   FlaskConical,
//   Image,
//   Tag,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   Briefcase,
//   LocateFixed,
//   CheckSquare,
//   MapPin,
//   Calendar,
// } from 'lucide-react';

// import InputField from '@/components/InputField';
// import { supabase } from '@/utils/supabase/client';
// import { ScheduleForm } from '@/components/LabSlots/ScheduleForm';
// import { Input } from '@/components/ui/input';
// import AsideNavbar from '@/components/Lab/AsideNavbar';

// // Reusable Checkbox Component
// const CheckboxField = ({ label, id, checked, onChange, icon: Icon }) => (
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

// const LabForm = () => {
//   const [isNavOpen, setIsNavOpen] = useState(false);
//   const [labId, setLabId] = useState('');
//   const [labData, setLabData] = useState(null);

//   const [formData, setFormData] = useState({
//     labName: '',
//     testType: '',
//     timeSlots: [{ date: '', time: '' }],
//     experienceYears: '',
//     imageUrl: '',
//     collectionTypes: '',
//     latitude: '',
//     longitude: '',
//     isAvailable: true,
//   });

//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     async function fetchUser() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data, error } = await supabase
//           .from('labs')
//           .select('id')
//           .eq('userId', user.id)
//           .single();

//         if (error) {
//           console.error('Error fetching labId:', error.message);
//         } else if (data) {
//           setLabId(data.id);
//         }
//       }
//     }

//     fetchUser();
//   }, []);

//   useEffect(() => {
//     async function fetchLabData() {
//       if (!labId) return;
//       const { data, error } = await supabase
//         .from('lab_details')
//         .select('*')
//         .eq('labId', labId)
//         .maybeSingle();

//       if (error) {
//         console.error('Error fetching lab data:', error);
//         return;
//       }

//       if (data) {
//         setLabData(data);
//       } else {
//         console.warn('No lab details found for labId:', labId);
//       }
//     }

//     fetchLabData();
//   }, [labId]);

//   useEffect(() => {
//     if (labData) {
//       setFormData({
//         labName: labData?.labName || '',
//         testType: labData?.testType || '',
//         timeSlots: labData?.timeSlots || [{ date: '', time: '' }],
//         experienceYears: labData?.experienceYears?.toString() || '',
//         imageUrl: labData?.imageUrl || '',
//         collectionTypes: labData?.collectionTypes?.join(', ') || '',
//         latitude: labData?.latitude?.toString() || '',
//         longitude: labData?.longitude?.toString() || '',
//         isAvailable: labData?.isAvailable,
//       });
//     }
//   }, [labData]);

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

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setUploadedFile(file);
//       setImagePreviewUrl(URL.createObjectURL(file));
//     } else {
//       setUploadedFile(null);
//       setImagePreviewUrl(null);
//     }
//   };

//   const handleSubmit = async (e) => {
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
//           .upload(`lab/${labId}/${cleanFileName}`, uploadedFile);

//         if (fileError) throw new Error(fileError.message);

//         finalImageUrl = `https://unrlzieuyrsibokkqqbm.supabase.co/storage/v1/object/public/uploads/lab/${labId}/${cleanFileName}`;
//       }

//       const payload = {
//         labName: formData.labName,
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
//         pathlabId: labId || null,
//       };

//       const response = await fetch('/api/lab', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Failed to save lab');

//       setMessage('Lab details saved successfully!');
//       setIsError(false);
//     } catch (err) {
//       setMessage(err.message || 'Something went wrong!');
//       setIsError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <AsideNavbar
//         isOpen={isNavOpen}
//         onToggle={() => setIsNavOpen(!isNavOpen)}
//       />

//       <div className="flex-1 md:ml-64">
//         <div
//           className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter"
//           // style={{
//           //   background:
//           //     'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
//           // }}
//         >
//           <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
//             <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 flex items-center justify-center">
//               <FlaskConical className="w-8 h-8 mr-3 text-indigo-600" />
//               {fetching ? 'Loading Lab Data...' : 'Lab Details'}
//             </h1>

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
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     <MapPin className="inline-block w-4 h-4 mr-2 text-indigo-500" />
//                     Lab Location
//                   </label>
//                   <div className="flex space-x-2 mb-2">
//                     <Input
//                       type="number"
//                       disabled
//                       id="latitude"
//                       name="latitude"
//                       value={formData.latitude}
//                       onChange={handleChange}
//                       placeholder="Latitude"
//                       className="w-1/2 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
//                       step="any"
//                     />
//                     <Input
//                       type="number"
//                       disabled
//                       id="longitude"
//                       name="longitude"
//                       value={formData.longitude}
//                       onChange={handleChange}
//                       placeholder="Longitude"
//                       className="w-1/2 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
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
//                   label="Available"
//                   id="isAvailable"
//                   checked={formData.isAvailable}
//                   onChange={handleChange}
//                 />

//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     <Image className="inline-block w-4 h-4 mr-2 text-indigo-500" />
//                     Lab Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                   />
//                   {imagePreviewUrl ? (
//                     <img
//                       src={imagePreviewUrl}
//                       alt="Preview"
//                       className="mt-3 w-full max-w-xs rounded-md shadow-md"
//                     />
//                   ) : labData?.imageUrl ? (
//                     <img
//                       src={labData.imageUrl}
//                       alt="Current Lab"
//                       className="mt-3 w-full max-w-xs rounded-md shadow-md"
//                     />
//                   ) : null}
//                 </div>

//                 <div className="mt-4">
//                   <InputField
//                     label="Collection Types (comma-separated)"
//                     id="collectionTypes"
//                     name="collectionTypes"
//                     value={formData.collectionTypes}
//                     onChange={handleChange}
//                     icon={Tag}
//                     placeholder="e.g., Home, Clinic"
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

//                 <div className="mt-2">
//                   <button
//                     type="submit"
//                     className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//                     disabled={loading}
//                   >
//                     {loading && (
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     )}
//                     {loading ? 'Submitting...' : 'Save Lab Details'}
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




'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from 'react';
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

// ---------------- Types ----------------
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

// ---------------- Reusable Checkbox ----------------
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

// ---------------- Main Component ----------------
const LabForm: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  // const [labId, setLabId] = useState<string>('');
  // const [labData, setLabData] = useState<LabDetails | null>(null);

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

  // ---------------- Fetch User ----------------

  const contextData = useContext(LabContext);
  const labId = contextData?.labId;
  const labData = contextData?.labData;

  // useEffect(() => {
  //   async function fetchUser() {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (user) {
  //       const { data, error } = await supabase
  //         .from('labs')
  //         .select('id')
  //         .eq('userId', user.id)
  //         .single();

  //       if (error) {
  //         console.error('Error fetching labId:', error.message);
  //       } else if (data) {
  //         setLabId(data.id);
  //       }
  //     }
  //   }

  //   fetchUser();
  // }, []);

  // // ---------------- Fetch Lab Data ----------------
  // useEffect(() => {
  //   async function fetchLabData() {
  //     if (!labId) return;
  //     setFetching(true);

  //     const { data, error } = await supabase
  //       .from('lab_details')
  //       .select('*')
  //       .eq('labId', labId)
  //       .maybeSingle();

  //     setFetching(false);

  //     if (error) {
  //       console.error('Error fetching lab data:', error);
  //       return;
  //     }

  //     if (data) {
  //       setLabData(data as LabDetails);
  //     } else {
  //       console.warn('No lab details found for labId:', labId);
  //     }
  //   }

  //   fetchLabData();
  // }, [labId]);

  // ---------------- Sync labData to formData ----------------
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
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-4">
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



