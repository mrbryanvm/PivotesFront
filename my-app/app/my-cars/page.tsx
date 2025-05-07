"use client";

import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../lib/authContext";
import { fetchMyCars, updateCarAvailability, deleteCar } from "../lib/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

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
    brand: "",
    model: "",
    carType: "",
    transmission: "",
    sortBy: "",
    page: 1,
    limit: 4,
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
    if (!date) return;
    const newDates = unavailableDates.includes(date)
      ? unavailableDates.filter((d) => d.getTime() !== date.getTime())
      : [...unavailableDates, date];
    setUnavailableDates(newDates);
  };

  const handleSaveAvailability = async () => {
    if (!selectedCarId || !token) return;

    try {
      const formattedDates = unavailableDates.map(
        (date) => date.toISOString().split("T")[0]
      );
      await updateCarAvailability(selectedCarId, formattedDates, token);
      setCarsResponse((prev) => ({
        ...prev,
        cars: prev.cars.map((car) =>
          car.id === selectedCarId
            ? { ...car, unavailableDates: formattedDates }
            : car
        ),
      }));
      setSelectedCarId(null);
      setUnavailableDates([]);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Error al actualizar la disponibilidad"
      );
    }
  };

  // función para eliminar un auto
  const handleDeleteCar = async (carId: number) => {
    if (!token) return;

    try {
      await deleteCar(carId, token);
      setCarsResponse((prev) => ({
        ...prev,
        cars: prev.cars.filter((car) => car.id !== carId),
        totalCars: prev.totalCars - 1,
      }));

      // Mensaje de éxito después de eliminar
      toast.success("¡Auto eliminado exitosamente!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar el auto");
      toast.error("Error al eliminar el auto");
    }
  };

  useEffect(() => {
    if (!token || role !== "host") return;

    const loadCars = async () => {
      try {
        const response = await fetchMyCars(filters, token);
        setCarsResponse(response);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar los autos");
      }
    };

    loadCars();
  }, [filters, token, role]);

  if (!token || role !== "host") {
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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            icon: null,
            style: {
              background: "#FED7AA",
              color: "#374151",
            },
          },
          error: {
            icon: null,
            style: {
              background: "#FECACA",
              color: "#374151",
            },
          },
        }}
      />

      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-bold">Mis Autos</h1>
        <div className="flex gap-4">
          <Link href="/add-car">
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Agregar nuevo Auto
            </button>
          </Link>
        </div>
      </div>
      <p className="text-orange-500 font-semibold text-lg mb-4">
        {carsResponse.totalCars} autos registrados
      </p>



{/* Filtros de Autos */}
<div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-2 items-center">
    <input
      type="text"
      placeholder="Marca"
      value={filters.brand}
      onChange={(e) => handleFilterChange({ brand: e.target.value })}
      className="p-2 border rounded"
    />
    <input
      type="text"
      placeholder="Modelo"
      value={filters.model}
      onChange={(e) => handleFilterChange({ model: e.target.value })}
      className="p-2 border rounded"
    />
    <select
      value={filters.transmission}
      onChange={(e) => handleFilterChange({ transmission: e.target.value })}
      className="p-2 border rounded"
    >
      <option value="">Transmisión</option>
      <option value="Manual">Manual</option>
      <option value="Automático">Automático</option>
    </select>
    <select
      value={filters.sortBy}
      onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
      className="p-2 border rounded"
    >
      <option value="">Ordenar por</option>
      <option value="priceAsc">Precio Ascendente </option>
      <option value="priceDesc">Precio Descendente </option>
    </select>

    {/* Botón para eliminar todos los filtros */}
    <button
      onClick={() =>
        setFilters((prev) => ({
          ...prev,
          brand: "",
          model: "",
          carType: "",
          transmission: "",
          sortBy: "",
          page: 1,
        }))
      }
      className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 w-full"
    >
      Limpiar Filtros
    </button>
  </div>

  {/* Filtros activos con nuevo diseño */}
{Object.entries(filters)
  .filter(([key, value]) => value && !["page", "limit"].includes(key))
  .length > 0 && (
  <div className="flex flex-wrap items-center gap-2 mt-4">
    {Object.entries(filters)
      .filter(([key, value]) => value && !["page", "limit"].includes(key))
      .map(([key, value]) => (
        <div
          key={key}
          className="inline-flex items-center bg-orange-50 border border-orange-200 text-orange-700 rounded-full px-3 py-1 text-sm shadow-sm"
        >
          <span className="mr-2 font-medium capitalize">
            {key}: <span className="font-semibold">{value}</span>
          </span>
          <button
            onClick={() => handleFilterChange({ [key]: "" })}
            className="hover:bg-orange-200 rounded-full p-1 transition"
            title="Eliminar filtro"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
  </div>
)}


</div>









      


      {/* Lista de Autos */}
      {carsResponse.cars.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-xl">
          No tienes autos Registrados <br />
          ¡Agrega uno ahora!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {carsResponse.cars.map((car) => (
            <div
              key={car.id}
              className="border rounded-lg shadow-md p-4 bg-white flex items-center gap-4"
            >
              {/* Imagen a la izquierda */}
              <div className="w-1/3">
                <p className="bg-gray-100 text-center text-sm mt-1 mb-3 py-1 rounded font-semibold">
                  ${car.pricePerDay} / día
                </p>

                <img
                  src={
                    Array.isArray(car.imageUrl)
                      ? car.imageUrl[0]
                      : typeof car.imageUrl === 'string'
                        ? car.imageUrl.split(',')[0]?.trim()
                        : 'https://via.placeholder.com/300x200?text=Sin+imagen'
                  }
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x200?text=Sin+imagen';
                  }}
                />

                <p className="text-green-600 text-sm font-medium mt-2">
                  🟢 Disponible
                </p>
              </div>

              {/* Información a la derecha */}
              <div className="w-2/3">
                <h2 className="text-lg font-semibold mb-1">
                  {car.brand} {car.model}
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Año: {car.year}</p>
                  <p>{car.seats} plazas</p>
                  <p>Transmisión: {car.transmission}</p>
                  <p>Categoría: {car.category}</p>
                  <p>Color: {car.color}</p>
                </div>
                {car.extraEquipment.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Equipamiento: {car.extraEquipment.join(", ")}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex gap-6 mt-4 text-sm text-center">
                  {/* Info */}
                  <div className="flex flex-col items-center">
                    <Link href={`/car-details/${car.id}`}>
                      <button className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600">
                        <FaEye />
                      </button>
                    </Link>
                    <span className="text-gray-700 mt-1">Info</span>
                  </div>

                  {/* Editar */}
                  <div className="flex flex-col items-center">
                    <Link href={`/edit-car/${car.id}`}>
                      <button className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 ml-5">
                        <FaEdit />
                      </button>
                    </Link>
                    <span className="text-gray-700 mt-1 ml-5">Editar</span>
                  </div>

                  {/* Eliminar */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="bg-orange-500 text-white p-3 rounded-full hover:bg-red-600 ml-5"
                    >
                      <FaTrash />
                    </button>
                    <span className="text-gray-700 mt-1 ml-5">Eliminar</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      

      {/* Modal para el Calendario (HU 7) */}
      {selectedCarId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Seleccionar Fechas de No Disponibilidad
            </h2>
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
          <span>
            Página {carsResponse.currentPage} de {carsResponse.totalPages}
          </span>
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




