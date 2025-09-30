// app/dashboard/lab/inventory/page.tsx
"use client";
import React, { useState, useEffect } from "react";

const Inventory = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [inventory, setInventory] = useState<string[]>([]);

  // useEffect(() => {
  //   // Simulating API call instead of setTimeout
  //   const fetchInventory = async () => {
  //     try {
  //       const res = await fetch("/api/inventory"); // replace with real endpoint
  //       const data = await res.json();
  //       setInventory(data.items);
  //     } catch (err) {
  //       console.error("Error fetching inventory", err);
  //     } finally {
  //       setPageLoading(false); // set loading false once data fetched
  //     }
  //   };

  //   fetchInventory();
  // }, []);

  useEffect(() => { const timer = setTimeout(() => { setPageLoading(false); }, 1000); return () => clearTimeout(timer); }, []);

  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          {/* Better: use animated SVG/WebM instead of GIF */}
          <video
            src="/loader.webm"
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto w-24 h-24"
          />
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Inventory</h1>
      <div className="mt-4">
        {inventory.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {inventory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Inventory;
