// import { User, Briefcase, Building2, DollarSign, IndianRupee } from 'lucide-react';

// interface Employee {
//     id: string;
//     name: string;
//     role: string;
//     department: string;
//     monthlySalary: number;
// }

// interface EmployeeCardProps {
//     employee: Employee;
// }

// const EmployeeCard = ({ employee }: EmployeeCardProps) => {
//     return (
//         <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
//             <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                     <div className="w-16 aspect-square bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                         {employee.name.charAt(0).toUpperCase()}
//                     </div>

//                     <div>
//                         <h3 className="text-lg font-bold text-gray-800">{employee.name}</h3>
//                         <p className="text-sm text-gray-500">ID : {employee.id}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-gray-700">
//                     <Briefcase size={18} className="text-teal-600" />
//                     <span className="text-sm font-medium">{employee.role}</span>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-700">
//                     <Building2 size={18} className="text-teal-600" />
//                     <span className="text-sm font-medium">{employee.department}</span>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-700">
//                     <IndianRupee size={18} className="text-teal-600" />
//                     <span className="text-sm font-medium">{employee.monthlySalary.toLocaleString()} / month</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeCard;



import { Briefcase, Building2, IndianRupee, Loader, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    monthlySalary: number;
}

interface EmployeeCardProps {
    employee: Employee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    // const [isVisible, setIsVisible] = useState(true);

    const handleDelete = async () => {
        
        try {
            setIsDeleting(true);
            const res = await fetch('/api/employee/delete-employee', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: employee.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`Failed to delete employee: ${data.error || 'Unknown error'}`);
            } else {
                console.log('Employee deleted');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong while deleting employee');
        } finally {
            setIsDeleting(false);
        }
    };

    // if (!isVisible) return null; // remove card from DOM

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-14 aspect-square bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {employee.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{employee.name}</h3>
                        <p className="text-sm text-gray-500">ID : {employee.id}</p>
                    </div>
                </div>

                {/* Delete button */}
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="ml-auto p-2 cursor-pointer rounded-full hover:bg-red-100 text-red-600"
                    title="Delete Employee"
                >
                    {isDeleting ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase size={18} className="text-teal-600" />
                    <span className="text-sm font-medium">{employee.role}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <Building2 size={18} className="text-teal-600" />
                    <span className="text-sm font-medium">{employee.department}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <IndianRupee size={18} className="text-teal-600" />
                    <span className="text-sm font-medium">{employee.monthlySalary.toLocaleString()} / month</span>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCard;
