'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditCar() {
  const [car, setCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({});
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
        setFormData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar los detalles del auto');
      }
    };

    if (token) fetchCar();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/my-cars');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el auto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isAvailable' ? value === 'true' : value,
    }));
  };

  if (!car) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Auto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={formData.brand || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="model"
          placeholder="Modelo"
          value={formData.model || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="year"
          placeholder="Año"
          value={formData.year || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="seats"
          placeholder="Asientos"
          value={formData.seats || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="transmission"
          value={formData.transmission || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Selecciona transmisión</option>
          <option value="manual">Manual</option>
          <option value="automático">Automático</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={formData.category || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="pricePerDay"
          placeholder="Precio por día"
          value={formData.pricePerDay || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="URL de la imagen"
          value={formData.imageUrl || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="isAvailable"
          value={formData.isAvailable?.toString() || 'true'}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="true">Disponible</option>
          <option value="false">No Disponible</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Guardar Cambios
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}