'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';

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
    photoUrls: ['', '', ''], // Mínimo 3 fotos
    extraEquipment: [] as string[], // Nuevo: HU 8
  });
  const [equipmentInput, setEquipmentInput] = useState(''); // Para manejar la entrada de equipamientos
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUrlChange = (index: number, value: string) => {
    const newPhotoUrls = [...formData.photoUrls];
    newPhotoUrls[index] = value;
    setFormData((prev) => ({ ...prev, photoUrls: newPhotoUrls }));
  };

  // Manejar la adición de equipamientos (HU 8)
  const handleAddEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        extraEquipment: [...prev.extraEquipment, equipmentInput.trim()],
      }));
      setEquipmentInput('');
    }
  };

  // Manejar la eliminación de equipamientos (HU 8)
  const handleRemoveEquipment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraEquipment: prev.extraEquipment.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Debes iniciar sesión para añadir un auto');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al añadir el auto');
      }

      router.push('/my-cars');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Añadir Auto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Ubicación
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium">
            Marca
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium">
            Modelo
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium">
            Año
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="carType" className="block text-sm font-medium">
            Tipo de Auto
          </label>
          <select
            id="carType"
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Selecciona un tipo</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
            <option value="SUV">SUV</option>
          </select>
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="pricePerDay" className="block text-sm font-medium">
            Precio por Día
          </label>
          <input
            type="number"
            id="pricePerDay"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="kilometers" className="block text-sm font-medium">
            Kilómetros
          </label>
          <input
            type="text"
            id="kilometers"
            name="kilometers"
            value={formData.kilometers}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium">
            Placa
          </label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium">
            Transmisión
          </label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona una transmisión</option>
            <option value="Manual">Manual</option>
            <option value="automático">Automático</option>
          </select>
        </div>
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium">
            Tipo de Combustible
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un combustible</option>
            <option value="Gas">Gas</option>
            <option value="Gasolina">Gasolina</option>
          </select>
        </div>
        <div>
          <label htmlFor="seats" className="block text-sm font-medium">
            Asientos
          </label>
          <input
            type="number"
            id="seats"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fotos (mínimo 3, máximo 5 URLs)</label>
          {formData.photoUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              value={url}
              onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
              placeholder={`URL de la foto ${index + 1}`}
              className="mt-1 block w-full p-2 border rounded mb-2"
              required={index < 3}
            />
          ))}
          {formData.photoUrls.length < 5 && (
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, photoUrls: [...prev.photoUrls, ''] }))}
              className="text-orange-500"
            >
              + Agregar otra foto
            </button>
          )}
        </div>
        {/* Equipamientos Extras (HU 8) */}
        <div>
          <label className="block text-sm font-medium">Equipamientos Extras</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              placeholder="Ej: Tanque lleno, GPS, Silla para niños"
              className="mt-1 block w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddEquipment}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Añadir
            </button>
          </div>
          <ul className="list-disc pl-5">
            {formData.extraEquipment.map((equipment, index) => (
              <li key={index} className="flex justify-between items-center">
                {equipment}
                <button
                  type="button"
                  onClick={() => handleRemoveEquipment(index)}
                  className="text-red-500 ml-2"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Añadir Auto
        </button>
      </form>
    </div>
  );
}