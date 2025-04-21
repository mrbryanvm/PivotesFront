'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext';
import Filters from '../components/Filters';
import CarCard from '../components/CarCard';
import { fetchCars } from '../lib/api';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  discount: number;
  rentalCount: number;
  rating: number;
  location: string;
  imageUrl: string;
  host: {
    id: number;
    email: string;
  };
}

interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

export default function Search() {
  const { token, logout } = useAuth();
  const [carsResponse, setCarsResponse] = useState<CarsResponse>({
    cars: [],
    totalCars: 0,
    currentPage: 1,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<{
    location: string;
    startDate: string;
    endDate: string;
    hostId?: number;
    carType: string;
    transmission: string;
    fuelType: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
    page: number;
    search: string;
  }>({
    location: '',
    startDate: '',
    endDate: '',
    hostId: undefined,
    carType: '',
    transmission: '',
    fuelType: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'relevance',
    page: 1,
    search: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await fetchCars(filters, token ?? undefined);
        setCarsResponse(response);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los autos');
      }
    };

    loadCars();
  }, [filters, token]);

  if (!token) {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Debes iniciar sesión para buscar autos</h1>
        <Link href="/login">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Iniciar Sesión
          </button>
        </Link>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={logout}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {/* Lista de Autos */}
      <div>
        <p className="text-gray-600 mb-4">{carsResponse.totalCars} resultados</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {carsResponse.cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>

      {/* Paginación */}
      {carsResponse.totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(carsResponse.currentPage - 1)}
            disabled={carsResponse.currentPage === 1}
            className="border p-2 rounded disabled:opacity-50"
          >
            ←
          </button>
          <span>Página {carsResponse.currentPage} de {carsResponse.totalPages}</span>
          <button
            onClick={() => handlePageChange(carsResponse.currentPage + 1)}
            disabled={carsResponse.currentPage === carsResponse.totalPages}
            className="border p-2 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}