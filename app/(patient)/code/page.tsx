'use client';
import React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase/client';

export default function CreateLabForm() {
  const [form, setForm] = useState({
    testType: '',
    nextAvailable: '',
    rating: '',
    experienceYears: '',
    isLoved: false,
    imageUrl: '',
    collectionTypes: [],
    labLocation: '',
    nablCertificateNumber: '',
    certificateUrl: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Get current location
    let latitude = 0.0;
    let longitude = 0.0;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (error) {
      console.warn('Location access denied, using default coordinates.');
    }

    // 2️⃣ Get current logged-in user
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    console.log('Current user:', user);
    if (!user) {
      alert('User not logged in');
      setLoading(false);
      return;
    }

    // 3️⃣ Send POST request to API route
    const res = await fetch('/api/labs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        latitude,
        longitude,
        userId: user.id,
      }),
    });

    if (res.ok) {
      alert('Lab created successfully');
    } else {
      const err = await res.json();
      console.error(err);
      alert('Error creating lab');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Example: Test Type */}
      <input
        type="text"
        placeholder="Test Type"
        value={form.testType}
        onChange={(e) => setForm({ ...form, testType: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Lab'}
      </button>
    </form>
  );
}
