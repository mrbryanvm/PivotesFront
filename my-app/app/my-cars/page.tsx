'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../lib/authContext';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';

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
  createdAt: string;
}

interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

export default function MyCars() {
  const [carsResponse, setCarsResponse] = useState<CarsResponse>({
    cars: [],
    totalCars: 0,
    currentPage: 1,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<CarsResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/cars/my-cars?page=${carsResponse.currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCarsResponse(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los autos');
      }
    };

    if (token) fetchCars();
  }, [token, carsResponse.currentPage]);

  const handleDelete = async (carId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este auto?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarsResponse((prev) => ({
          ...prev,
          cars: prev.cars.filter((car) => car.id !== carId),
          totalCars: prev.totalCars - 1,
        }));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al eliminar el auto');
      }
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis autos</h1>
        {user?.role === 'host' && (
          <Link href="/add-car">
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Agregar nuevo Auto
            </button>
          </Link>
        )}
      </div>

      {carsResponse.cars.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No tienes autos registrados.</p>
          <p className="text-lg">¡Agrega uno ahora!</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">{carsResponse.totalCars} autos registrados</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {carsResponse.cars.map((car) => (
              <div
                key={car.id}
                className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
              >
                <img
                  src={car.imageUrl || '/placeholder-car.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-40 object-contain rounded mb-4"
                />
                <div className="text-lg font-bold text-orange-500">{car.pricePerDay} $</div>
                <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
                <div className="text-sm text-gray-600 mt-2">
                  <p><span className="font-medium">Año:</span> {car.year}</p>
                  <p><span className="font-medium">Plazas:</span> {car.seats}</p>
                  <p><span className="font-medium">Categoría:</span> {car.category}</p>
                  <p><span className="font-medium">Transmisión:</span> {car.transmission}</p>
                  <p><span className="font-medium">Color:</span> {car.color}</p>
                  <p>
                    <span className="font-medium">Disponible:</span>{' '}
                    <span className={car.isAvailable ? 'text-green-500' : 'text-red-500'}>
                      {car.isAvailable ? 'Disponible' : 'No Disponible'}
                    </span>
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Link href={`/edit-car/${car.id}`}>
                    <button className="text-orange-500 hover:text-orange-600">
                      <FaEdit size={20} />
                    </button>
                  </Link>
                  <Link href={`/car/${car.id}`}>
                    <button className="text-orange-600 hover:text-orange-700">
                      <FaInfoCircle size={20} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}