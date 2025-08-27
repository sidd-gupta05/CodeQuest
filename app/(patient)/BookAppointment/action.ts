// app/(patient)/BookAppointment/actions.ts
'use client';

import { Dispatch, SetStateAction } from 'react';
import { Lab } from '@/components/BookApointment/Filters/types';

export const fetchLabs = async (): Promise<Lab[]> => {
  try {
    const res = await fetch('/api/labs', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch labs');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

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
