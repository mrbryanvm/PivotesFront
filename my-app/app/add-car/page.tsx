'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';
import axios from 'axios';

export default function AddCar() {
  const [formData, setFormData] = useState({
    location: '',
    brand: '',
    model: '',
    year: '',
    carType: '',
    color: '',
    pricePerDay: '',
    kilometers: '',
    licensePlate: '',
    transmission: '',
    fuelType: '',
    seats: '',
    description: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      photos.forEach((photo) => {
        data.append('photos', photo);
      });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cars`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        router.push('/my-cars');
      } else {
        throw new Error('Error al agregar el auto');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al agregar el auto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length < 3 || files.length > 5) {
        setError('Debes subir entre 3 y 5 fotos');
        return;
      }
      setPhotos(files);
      setError(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primera columna - INFORMACIÓN */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Información</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Ubicación *</label>
            <input
              type="text"
              name="location"
              placeholder="Cochabamba"
              value={formData.location}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Marca *</label>
              <input
                type="text"
                name="brand"
                placeholder="Toyota"
                value={formData.brand}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Modelo</label>
              <input
                type="text"
                name="model"
                placeholder="Corolla"
                value={formData.model}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tipo de auto</label>
            <input
              type="text"
              name="carType"
              placeholder="Mediano"
              value={formData.carType}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Color</label>
              <input
                type="text"
                name="color"
                placeholder="Blanco"
                value={formData.color}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Año *</label>
              <input
                type="number"
                name="year"
                placeholder="2022"
                value={formData.year}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tarifa/Día *</label>
            <input
              type="number"
              name="pricePerDay"
              placeholder="50"
              value={formData.pricePerDay}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Kilometraje *</label>
              <input
                type="text"
                name="kilometers"
                placeholder="35,000 km"
                value={formData.kilometers}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Placa *</label>
              <input
                type="text"
                name="licensePlate"
                placeholder="XYZ-1234"
                value={formData.licensePlate}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Segunda columna - EQUIPAMIENTO */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Equipamiento</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Transmisión *</label>
            <input
              type="text"
              name="transmission"
              placeholder="Automático"
              value={formData.transmission}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Consumo *</label>
            <input
              type="text"
              name="fuelType"
              placeholder="Gasolina"
              value={formData.fuelType}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Capacidad *</label>
            <select
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            >
              <option value="">Seleccionar</option>
              <option value="2">2 personas</option>
              <option value="4">4 personas</option>
              <option value="5">5 personas</option>
              <option value="7">7 personas</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Descripción</label>
            <textarea
              name="description"
              placeholder="Descubre el Toyota Corolla 2022, un sedán compacto diseñado para ofrecer comodidad, eficiencia y tecnología en cada viaje..."
              value={formData.description}
              onChange={handleChange}
              className="border p-3 rounded w-full h-40"
            />
          </div>
        </div>

        {/* Tercera columna - FOTOS */}
        <div className="md:col-span-1">
          <div className="border rounded p-6 flex flex-col items-center justify-center h-64">
            <div className="text-center">
              <h3 className="font-bold mb-2">Añadir fotos</h3>
              <p className="text-gray-600 mb-4">PNG/JPG (mín 3, máx 5)</p>
              <input
                type="file"
                name="photos"
                accept="image/png, image/jpeg"
                multiple
                onChange={handlePhotoChange}
                className="border p-3 rounded w-full"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="border border-orange-500 text-orange-500 px-8 py-2 rounded"
          onClick={() => router.push('/my-cars')}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-orange-500 text-white px-8 py-2 rounded"
          onClick={handleSubmit}
        >
          Guardar
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}