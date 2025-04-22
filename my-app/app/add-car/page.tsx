"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../lib/authContext';

export default function AddCar() {
  const [formData, setFormData] = useState({
    location: "",
    brand: "",
    model: "",
    year: "",
    carType: "",
    color: "",
    pricePerDay: "",
    kilometers: "",
    licensePlate: "",
    transmission: "",
    fuelType: "",
    seats: "",
    description: "",
    photoUrls: ["", "", ""],
    extraEquipment: [] as string[],
  });

  const [equipmentInput, setEquipmentInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUrlChange = (index: number, value: string) => {
    const newPhotoUrls = [...formData.photoUrls];
    newPhotoUrls[index] = value;
    setFormData((prev) => ({ ...prev, photoUrls: newPhotoUrls }));
  };

  const handleAddEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        extraEquipment: [...prev.extraEquipment, equipmentInput.trim()],
      }));
      setEquipmentInput("");
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraEquipment: prev.extraEquipment.filter((_, i) => i !== index),
    }));
  };

  const [yearError, setYearError] = useState('');
  const validacionAño = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 4) return;

    const year = parseInt(value);
    const currentYear = new Date().getFullYear();

    if (!isNaN(year)) {
      if (year < 1900) {
        setYearError('El año no puede ser menor a 1900');
      } else if (year > currentYear) {
        setYearError(`El año no puede ser mayor a ${currentYear}`);
      } else {
        setYearError('');
      }
    } else {
      setYearError('Ingresa un año válido');
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const [seatsError, setSeatsError] = useState('');
  const limiteAsientos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Evita que escriban letras o valores vacíos
    if (!/^\d*$/.test(value)) return;

    const number = parseInt(value);

    if (!isNaN(number)) {
      if (number > 20) {
        setSeatsError('La capacidad máxima es 20');
        return; // No actualizamos el valor en el estado
      } else {
        setSeatsError('');
      }
    } else {
      setSeatsError('Ingrese un número válido');
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const [locationError, setLocationError] = useState('');
  const validarCaracteres = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const [priceError, setPriceError] = useState('');
  const validaTarifa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setFormData({
        ...formData,
        pricePerDay: value,
      });
      setPriceError('');
    } else {
      setPriceError('Solo se permiten hasta 3 dígitos positivos');
    }
  };






  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Debes iniciar sesión para añadir un auto");
      return;
    }

    if (formData.photoUrls.filter((url) => url.trim() !== "").length < 3) {
      setError("Debes proporcionar al menos 3 URLs de fotos");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al añadir el auto");
      }

      router.push("/my-cars");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Información</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Ubicación</label>
            <select
              name="location"
              value={formData.location}
              onChange={validarCaracteres}
              className={`border p-3 rounded w-full ${locationError ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Selecciona una ubicación</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="La Paz">La Paz</option>
              {/* <option value="Trujillo">Trujillo</option>
              <option value="Piura">Piura</option> */}
              {/* Agrega más ubicaciones aquí */}
            </select>
            {locationError && (
              <p className="text-red-500 text-sm mt-1">{locationError}</p>
            )}
          </div>



          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Marca</label>
              <input
                type="text"
                name="brand"
                placeholder="Marca"
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
                placeholder="Modelo"
                value={formData.model}
                onChange={(e) => {
                  const onlyLetters = /^[a-zA-Z\s]*$/;
                  if (onlyLetters.test(e.target.value)) {
                    setFormData({ ...formData, model: e.target.value });
                  }
                }}
                className="border p-3 rounded w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tipo de Auto</label>
            <select
              name="carType"
              value={formData.carType}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Año</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={validacionAño}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`mt-1 block w-full p-2 border rounded ${yearError ? 'border-red-500' : 'border-gray-300'}`}
                required
                min="1900"
                max={new Date().getFullYear()}
              />
              {yearError && (
                <p className="text-red-500 text-sm mt-1">{yearError}</p>
              )}

            </div>

            <div>
              <label className="block text-gray-600 mb-1">Color</label>
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Tarifa/Día</label>
            <input
              type="number"
              name="pricePerDay"
              placeholder="$15"
              value={formData.pricePerDay}
              onChange={validaTarifa}
              onKeyDown={(e) => {
                const invalidChars = ['-', '+', 'e', '.', ',', 'E'];
                if (invalidChars.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`border p-3 rounded w-full ${priceError ? 'border-red-500' : 'border-gray-300'}`}
              required
              min="0"
              max="999"
            />
            {priceError && (
              <p className="text-red-500 text-sm mt-1">{priceError}</p>
            )}
          </div>



          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Kilometraje</label>
              <input
                type="number"
                name="kilometers"
                placeholder="5000 km/h"
                value={formData.kilometers}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Placa</label>
              <input
                type="text"
                name="licensePlate"
                placeholder="Placa"
                value={formData.licensePlate}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Equipamiento</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Transmisión</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Combustible</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Gas">Gas</option>
              <option value="Gasolina">Gasolina</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Capacidad (asientos)</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={limiteAsientos}
              className={`border p-3 rounded w-full ${seatsError ? 'border-red-500' : 'border-gray-300'}`}
              max="20"
              required
            />
            {seatsError && (
              <p className="text-red-500 text-sm mt-1">{seatsError}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-3 rounded w-full h-32"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 uppercase">Fotos (URL)</h2>
          {formData.photoUrls.map((url, idx) => (
            <div className="mb-2" key={idx}>
              <input
                type="text"
                value={url}
                onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                placeholder={`URL de la foto ${idx + 1}`}
                className="border p-2 rounded w-full"
                required={idx < 3}
              />
            </div>
          ))}
          {formData.photoUrls.length < 5 && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, photoUrls: [...prev.photoUrls, ""] }))
              }
              className="text-orange-500"
            >
              + Agregar otra foto
            </button>
          )}
        </div>
      </form>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="border border-orange-500 text-orange-500 px-8 py-2 rounded"
          onClick={() => router.push("/my-cars")}
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