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
  description?: string; // Cambiado a opcional
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles del Auto</h1>
      <div className="border rounded-lg shadow-md p-4 bg-white">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-40 object-contain rounded mb-4"
        />
        <h2 className="text-xl font-semibold">
          {car.brand} {car.model}
        </h2>
        <p className="text-sm text-gray-600">Año: {car.year}</p>
        <p className="text-sm text-gray-600">Tipo: {car.category}</p>
        <p className="text-sm text-gray-600">Precio por día: ${car.pricePerDay}</p>
        <p className="text-sm text-gray-600">Transmisión: {car.transmission}</p>
        <p className="text-sm text-gray-600">Color: {car.color}</p>
        <p className="text-sm text-gray-600">Asientos: {car.seats}</p>
        <p className="text-sm text-gray-600">Ubicación: {car.location}</p>
        <p className="text-sm text-gray-600">Kilometraje: {car.kilometers}</p>
        <p className="text-sm text-gray-600">Matrícula: {car.licensePlate}</p>
        <p className="text-sm text-gray-600">Tipo de combustible: {car.fuelType}</p>
        {car.description && <p className="text-sm text-gray-600">Descripción: {car.description}</p>}
        {car.extraEquipment.length > 0 && (
          <p className="text-sm text-gray-600">Equipamientos: {car.extraEquipment.join(', ')}</p>
        )}
        {car.unavailableDates.length > 0 && (
          <p className="text-sm text-gray-600">
            Fechas no disponibles: {car.unavailableDates.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}