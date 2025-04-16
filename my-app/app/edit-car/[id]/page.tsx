'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchCarById, updateCar } from '../../lib/api';
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
}

export default function EditCar() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCar = async () => {
      if (!token) return;
      try {
        const response = await fetchCarById(Number(id), token);
        setCar(response);
        setFormData(response);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar el auto');
      }
    };

    loadCar();
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await updateCar(Number(id), formData, token);
      router.push('/my-cars');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el auto');
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!car) return <p className="text-center">Cargando...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Auto</h1>
      <form onSubmit={handleSubmit} className="border rounded-lg shadow-md p-4 bg-white">
        <div className="mb-4">
          <label className="block text-sm font-medium">Marca</label>
          <input
            type="text"
            name="brand"
            value={formData.brand || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Modelo</label>
          <input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Año</label>
          <input
            type="number"
            name="year"
            value={formData.year || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Categoría</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
            <option value="SUV">SUV</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Precio por Día</label>
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Transmisión</label>
          <select
            name="transmission"
            value={formData.transmission || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Asientos</label>
          <input
            type="number"
            name="seats"
            value={formData.seats || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Guardar Cambios
          </button>
          <a href="/my-cars">
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </a>
        </div>
      </form>
    </div>
  );
}