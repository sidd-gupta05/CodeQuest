// components/BookAppointment/MapView/MapBox.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { Lab } from '../Filters';

// Add missing types for leaflet-routing-machine using module augmentation
declare module 'leaflet' {
  interface RoutingOptions {
    waypoints?: LatLng[] | LatLngTuple[];
    lineOptions?: {
      styles?: Array<{
        color?: string;
        weight?: number;
        opacity?: number;
      }>;
    };
    // createMarker returns either a Leaflet Marker or null
    createMarker?: (
      i: number,
      wp: { latLng: LatLng } | LatLng,
      n?: number
    ) => Marker | null;
    addWaypoints?: boolean;
    draggableWaypoints?: boolean;
    fitSelectedRoutes?: boolean;
    show?: boolean;
  }

  class RoutingControl extends Control {
    constructor(options?: RoutingOptions);
    getPlan(): unknown;
    setWaypoints(waypoints: LatLng[]): void;
  }

  export const Routing: {
    Control: typeof RoutingControl;
    control(options?: RoutingOptions): RoutingControl;
  };
}

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// User icon
const userIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [30, 30],
  iconAnchor: [15, 35],
  popupAnchor: [0, -30],
});

// Green marker = Available labs
const labAvailableIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [30, 30],
  iconAnchor: [15, 35],
  popupAnchor: [0, -30],
});

// Red marker = Not Available labs
const labUnavailableIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [30, 30],
  iconAnchor: [15, 35],
  popupAnchor: [0, -30],
});

// 🛣️ Routing component
function Routing({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number] | null;
}) {
  const map = useMap();
  const controlRef = useRef<InstanceType<typeof L.Routing.Control> | null>(
    null
  );
  const lineRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!from || !to) return;

    // cleanup old route before drawing new one
    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }
    if (lineRef.current && map.hasLayer(lineRef.current)) {
      map.removeLayer(lineRef.current);
      lineRef.current = null;
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      lineOptions: {
        styles: [{ color: 'red', weight: 5, opacity: 0.7 }],
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // hide detail panel
    }).addTo(map);

    controlRef.current = control;

    // hide the details panel completely
    const panel = document.querySelector('.leaflet-routing-container');
    if (panel) panel.remove();

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
      if (lineRef.current && map.hasLayer(lineRef.current)) {
        map.removeLayer(lineRef.current);
        lineRef.current = null;
      }
    };
  }, [from, to, map]);

  return null;
}

export default function MapBox({ labs }: { labs: Lab[] }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [routeTo, setRouteTo] = useState<[number, number] | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const directionLabId = searchParams.get('directionTo');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    // If there's a directionLabId in the URL, find the lab and set the route
    if (directionLabId && position) {
      const labToRoute = labs.find((lab) => String(lab.id) === directionLabId);
      if (labToRoute && labToRoute.latitude && labToRoute.longitude) {
        setRouteTo([labToRoute.latitude, labToRoute.longitude]);

        // Center the map on the lab location
        const mapElement = document.querySelector('.leaflet-container');
        if (mapElement) {
          const map = (mapElement as any)._leaflet_map;
          if (map) {
            map.setView([labToRoute.latitude, labToRoute.longitude], 15);
          }
        }
      }
    }
  }, [directionLabId, labs, position]);

  const handleBookNow = (labId: string) => {
    router.push(`/Booking?labId=${labId}`);
  };

  const handleGetDirections = (labId: string) => {
    // Update URL with direction parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('directionTo', labId);
    window.history.pushState({}, '', newUrl.toString());

    // Find the lab and set the route
    const labToRoute = labs.find((lab) => String(lab.id) === labId);
    if (labToRoute && labToRoute.latitude && labToRoute.longitude && position) {
      setRouteTo([labToRoute.latitude, labToRoute.longitude]);

      // Center the map on the lab location
      const mapElement = document.querySelector('.leaflet-container');
      if (mapElement) {
        const map = (mapElement as any)._leaflet_map;
        if (map) {
          map.setView([labToRoute.latitude, labToRoute.longitude], 15);
        }
      }
    }
  };

  if (!position) {
    return (
      <div className="text-center mt-4 flex items-center justify-center">
        <MapPin className="animate-pulse mr-2" size={20} />
        <span>Getting your location...</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      className="h-[500px] w-full rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* User marker */}
      <Marker position={position} icon={userIcon}>
        <Popup>
          <b>You are here</b>
        </Popup>
      </Marker>

      {/* Lab markers */}
      {labs
        .filter((lab) => lab.latitude && lab.longitude)
        .map((lab) => (
          <Marker
            key={lab.id}
            position={[lab.latitude, lab.longitude]}
            icon={lab.isAvailable ? labAvailableIcon : labUnavailableIcon}
            eventHandlers={{
              dblclick: () => handleGetDirections(String(lab.id)),
            }}
          >
            <Popup>
              <div
                className={`w-56 p-1 rounded-md ${
                  lab.isAvailable
                    ? 'opacity-100'
                    : 'opacity-50 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={lab.image || '/placeholder.png'}
                    alt={lab.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{lab.name}</h3>
                    <div className="flex items-center gap-1 text-xs">
                      ⭐ {lab.rating}
                      <span
                        className={`ml-2 ${
                          lab.isAvailable ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {lab.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBookNow(String(lab.id))}
                  disabled={!lab.isAvailable}
                  className={`mt-2 w-full py-1.5 rounded-full text-sm font-semibold 
                    ${
                      lab.isAvailable
                        ? 'bg-[#2B7C7E] text-white hover:bg-[#236667] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Book Now
                </button>
                <button
                  onClick={() => handleGetDirections(String(lab.id))}
                  className="mt-2 w-full py-1.5 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Render route if user picked a lab */}
      {routeTo && position && <Routing from={position} to={routeTo} />}
    </MapContainer>
  );
}
