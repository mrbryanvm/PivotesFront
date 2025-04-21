'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCarById } from '../../lib/api';
import { useAuth } from '../../lib/authContext';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  color: string;
  imageUrl: string;
  isAvailable: boolean;
  unavailableDates: string[];
  extraEquipment: string[];
  rentalCount: number;
  location: string;
  kilometers: string;
  licensePlate: string;
  fuelType: string;
  description?: string;
}

export default function CarDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCar = async () => {
      if (!token) return;
      try {
        const response = await fetchCarById(Number(id), token);
        setCar(response);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los detalles del auto');
      }
    };

    loadCar();
  }, [id, token]);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!car) return <p className="text-center">Cargando...</p>;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Galería */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="col-span-2">
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <img
            src={car.imageUrl}
            alt="Vista 2"
            className="w-full h-31 object-cover rounded-lg"
          />
          <img
            src={car.imageUrl}
            alt="Vista 3"
            className="w-full h-31 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Info Principal */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{car.brand} {car.model} {car.year}</h1>
        <span className="text-green-600 font-semibold">${car.pricePerDay}/día</span>
      </div>

      {/* Rating y viajes */}
      <div className="flex items-center text-yellow-500 mb-4">
        <span className="text-lg font-semibold mr-1">4.99</span>
        <span>⭐</span>
        <span className="ml-2 text-gray-600 text-sm">({car.rentalCount} viajes)</span>
      </div>

      {/* Etiquetas */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          🚗 {car.transmission}
        </span>
        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          🛣️ {car.kilometers}
        </span>
        <span className="flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
          {car.fuelType}
        </span>
        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
          🪑 {car.seats} asientos
        </span>
        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          ⚙️ {car.transmission}
        </span>
        <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
          👤 5
        </span>
      </div>

      {/* Descripción */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Descripción</h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          {car.description || 'Este auto no tiene una descripción disponible.'}
        </p>
      </div>
    </div>
  );
}
