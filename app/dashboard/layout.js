//app/dashboard/layout.js
import { LabProvider } from '../context/LabContext';

const dashboardLayout = ({ children }) => {
  return (
    <div>
      <LabProvider>{children}</LabProvider>
    </div>
  );
};

export default dashboardLayout;
