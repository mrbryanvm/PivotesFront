'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext';
import MyCarsFilters from '../../components/MyCarsFilters';
import { fetchMyCars, updateCarAvailability } from '../lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
}

interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

export default function MyCars() {
  const { token, role, logout } = useAuth();
  const [carsResponse, setCarsResponse] = useState<CarsResponse>({
    cars: [],
    totalCars: 0,
    currentPage: 1,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    carType: '',
    transmission: '',
    sortBy: '',
    page: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenCalendar = (car: Car) => {
    setSelectedCarId(car.id);
    const dates = car.unavailableDates.map((date) => new Date(date));
    setUnavailableDates(dates);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return; // Ignora si date es null
    const newDates = unavailableDates.includes(date)
      ? unavailableDates.filter((d) => d.getTime() !== date.getTime())
      : [...unavailableDates, date];
    setUnavailableDates(newDates);
  };

  const handleSaveAvailability = async () => {
    if (!selectedCarId || !token) return;

    try {
      const formattedDates = unavailableDates.map((date) => date.toISOString().split('T')[0]);
      await updateCarAvailability(selectedCarId, formattedDates, token);
      setCarsResponse((prev) => ({
        ...prev,
        cars: prev.cars.map((car) =>
          car.id === selectedCarId ? { ...car, unavailableDates: formattedDates } : car
        ),
      }));
      setSelectedCarId(null);
      setUnavailableDates([]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar la disponibilidad');
    }
  };

  useEffect(() => {
    if (!token || role !== 'host') return;

    const loadCars = async () => {
      try {
        const response = await fetchMyCars(filters, token);
        setCarsResponse(response);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los autos');
      }
    };

    loadCars();
  }, [filters, token, role]);

  if (!token || role !== 'host') {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Autos</h1>
        <div className="flex gap-4">
          <Link href="/add-car">
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Añadir Auto
            </button>
          </Link>
          <Link href="/">
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Volver al Inicio
            </button>
          </Link>
          <button
            onClick={logout}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Filtros y Ordenamiento (HU 3) */}
      <MyCarsFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Lista de Autos */}
      <div>
        <p className="text-gray-600 mb-4">{carsResponse.totalCars} autos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {carsResponse.cars.map((car) => (
            <div key={car.id} className="border rounded-lg shadow-md p-4 bg-white">
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
              {/* Equipamientos Extras (HU 8) */}
              {car.extraEquipment.length > 0 && (
                <p className="text-sm text-gray-600">
                  Equipamientos: {car.extraEquipment.join(', ')}
                </p>
              )}
              {/* Botón para gestionar disponibilidad (HU 7) */}
              <button
                onClick={() => handleOpenCalendar(car)}
                className="mt-2 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
              >
                Gestionar Disponibilidad
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para el Calendario (HU 7) */}
      {selectedCarId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Seleccionar Fechas de No Disponibilidad</h2>
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              inline
              highlightDates={unavailableDates}
              dateFormat="yyyy-MM-dd"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSaveAvailability}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setSelectedCarId(null);
                  setUnavailableDates([]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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