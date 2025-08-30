// app/(patient)/BookAppointment/actions.ts
'use client';

import { Dispatch, SetStateAction } from 'react';
import { Lab } from '@/components/BookApointment/Filters/types';


export const handlePageChange = (
  page: number,
  setCurrentPage: Dispatch<SetStateAction<number>>
) => {
  setCurrentPage(page);
};

export const toggleLove = (
  id: number,
  labs: Lab[],
  setLabs: Dispatch<SetStateAction<Lab[]>>
) => {
  setLabs(
    labs.map((lab) =>
      lab.id === id ? { ...lab, isLoved: !lab.isLoved } : lab
    )
  );
};
