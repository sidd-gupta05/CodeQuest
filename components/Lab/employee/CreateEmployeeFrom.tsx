// // components/CreateEmployeeForm.tsx
// 'use client';

// import { useState } from 'react';

// interface EmployeeFormData {
//     name: string;
//     role: string;
//     monthlySalary: number;
//     department: string;
// }

// const CreateEmployeeForm = ({ labId }: { labId: string }) => {
//     const [formData, setFormData] = useState<EmployeeFormData>({
//         name: '',
//         role: '',
//         monthlySalary: 0,
//         department: '',
//     });

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<string | null>(null);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: name === 'monthlySalary' ? Number(value) : value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage(null);

//         try {
//             const res = await fetch('/api/employee/create-employee', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ labId, ...formData }),
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 setMessage(`Employee ${data.employee.name} created successfully!`);
//                 setFormData({
//                     name: '',
//                     role: '',
//                     monthlySalary: 0,
//                     department: '',
//                 });
//             } else {
//                 setMessage(`Error: ${data.error}`);
//             }
//         } catch (error) {
//             setMessage(`Error: ${error}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>

//             {message && (
//                 <div className="mb-4 text-sm font-medium text-center text-white bg-green-500 p-2 rounded">
//                     {message}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">

//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Employee Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     required
//                 />

//                 <input
//                     type="text"
//                     name="role"
//                     placeholder="Role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     required
//                 />

//                 <input
//                     type="number"
//                     name="monthlySalary"
//                     placeholder="Monthly Salary"
//                     value={formData.monthlySalary || ''}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     required
//                     min={0}
//                 />

//                 <input
//                     type="text"
//                     name="department"
//                     placeholder="Department"
//                     value={formData.department}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     required
//                 />

//                 <button
//                     type="submit"
//                     className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
//                         }`}
//                     disabled={loading}
//                 >
//                     {loading ? 'Creating...' : 'Create Employee'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CreateEmployeeForm;

"use client";

import { useState } from 'react';
import { X, User, Briefcase, DollarSign, Building2, IndianRupee } from 'lucide-react';

interface EmployeeFormData {
    name: string;
    role: string;
    monthlySalary: number;
    department: string;
}

interface CreateEmployeeFormProps {
    labId: string;
    onClose: () => void;
    //   onSuccess: () => void;
}

const CreateEmployeeForm = ({ labId, onClose }: CreateEmployeeFormProps) => {
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: '',
        role: '',
        monthlySalary: 0,
        department: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'monthlySalary' ? Number(value) : value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/employee/create-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ labId, ...formData }),
            });

            const data = await res.json();

            if (res.ok) {
                setFormData({
                    name: '',
                    role: '',
                    monthlySalary: 0,
                    department: '',
                });
                // onSuccess();
                onClose();
            } else {
                setError(data.error || 'Failed to create employee');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0  bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-xl font-bold">Add New Employee</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="inline mr-1" />
                            Employee Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Briefcase size={16} className="inline mr-1" />
                            Role
                        </label>
                        <input
                            type="text"
                            name="role"
                            placeholder="Lab Technician"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Building2 size={16} className="inline mr-1" />
                            Department
                        </label>
                        <input
                            type="text"
                            name="department"
                            placeholder="Finance, Operations"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <IndianRupee size={16} className="inline mr-1" />
                            Monthly Salary
                        </label>
                        <input
                            type="number"
                            name="monthlySalary"
                            placeholder="0"
                            value={formData.monthlySalary || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            required
                            min={0}
                            step="100"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-teal-600/30"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmployeeForm;
