'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../lib/authContext';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  seats: number;
  transmission: string;
  category: string;
  color: string;
  pricePerDay: number;
  imageUrl: string;
  isAvailable: boolean;
}

export default function CarDetail() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los detalles del auto');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCar();
  }, [id, token]);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!car) return <p className="text-center text-gray-500">Auto no encontrado</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles del Auto</h1>
      <div className="border rounded-lg shadow-lg p-4 bg-background text-foreground">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">
          {car.brand} {car.model}
        </h2>
        <p>Año: {car.year}</p>
        <p>Asientos: {car.seats}</p>
        <p>Transmisión: {car.transmission}</p>
        <p>Categoría: {car.category}</p>
        <p>Color: {car.color}</p>
        <p>Precio por día: ${car.pricePerDay}</p>
        <p className="flex items-center gap-2 mt-2">
          <span
            className={`w-4 h-4 rounded-full ${car.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          {car.isAvailable ? 'Disponible' : 'No Disponible'}
        </p>
      </div>
    </div>
  );
}