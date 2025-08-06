// components/BookAppointment/EmptyResults.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const EmptyResults: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center py-10">
      <p className="text-gray-600 font-semibold">
        No labs found matching your criteria.
      </p>
      <p className="text-sm text-gray-500">Try adjusting your filters.</p>
    </div>
  </motion.div>
);
