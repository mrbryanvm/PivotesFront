"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCarById, updateCar } from "../../lib/api";
import { useAuth } from "../../lib/authContext";

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
  description?: string;
}

export default function EditCar() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({});
  const [formErrors, setFormErrors] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    seats: "",
    color: "",
  });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadCar = async () => {
      if (!token) return;
      try {
        const response = await fetchCarById(Number(id), token);
        setCar(response);
        setFormData(response);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar el auto");
      }
    };

    loadCar();
  }, [id, token]);

  // Funciones de validación
  const validateTextField = (name: string, value: string) => {
    if (!value.trim()) {
      if (name === "brand") {
        return `La marca es obligatoria`;
      } else {
        return `El modelo es obligatorio`;
      }
    }

    // Validar que no contenga números ni caracteres especiales solo para la "marca"
    if (name === "brand") {
      if (/\d/.test(value)) {
        return `La marca no puede contener números`;
      }
      if (/[^a-zA-Z\s]/.test(value)) {
        return `La marca no puede contener caracteres especiales`;
      }
    }

    // Validar que no contenga caracteres especiales para el "modelo"
    if (name === "model") {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        return `El modelo no puede contener caracteres especiales`;
      }
    }

    return "";
  };

  const validateYear = (value: number) => {
    const currentYear = new Date().getFullYear();

    // Verificar si el valor tiene exactamente 4 dígitos
    if (value.toString().length !== 4) {
      return "El año debe tener exactamente 4 dígitos";
    }

    if (value < 1900) return "El año no puede ser menor a 1900";
    if (value > currentYear)
      return `El año no puede ser mayor a ${currentYear}`;

    return "";
  };

  const validatePricePerDay = (value: number) => {
    if (value <= 0) return "El precio debe ser mayor a 0";
    return "";
  };

  const validateSeats = (value: number) => {
    if (value < 1 || value > 20)
      return "La capacidad debe ser entre 1 y 20 asientos";
    return "";
  };

  const validateColor = (value: string) => {
    if (!value.trim()) return "El color es obligatorio";
    if (/\d/.test(value)) return "El color no puede contener números";
    if (/[^a-zA-Z\s]/.test(value))
      return "El color no puede contener caracteres especiales";
    return "";
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    if (name === "brand" || name === "model") {
      const allowedChars = /^[a-zA-Z\s]*$/; // Solo letras y espacios
      if (!allowedChars.test(e.key)) {
        e.preventDefault(); // Bloquear tecla no permitida
      }
    }
    if (name === "year") {
      // Si el valor ya tiene 4 dígitos, bloquear la tecla (no permitir más caracteres)
      if (value.length >= 4) {
        e.preventDefault();
      }
    }
  };

  const [yearError, setYearError] = useState("");
  const validacionAño = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 4) return;

    const year = parseInt(value);
    const currentYear = new Date().getFullYear();

    if (!isNaN(year)) {
      if (year < 1900) {
        setYearError("El año no puede ser menor a 1900");
      } else if (year > currentYear) {
        setYearError(`El año no puede ser mayor a ${currentYear}`);
      } else {
        setYearError("");
      }
    } else {
      setYearError("Ingresa un año válido");
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Si el campo es 'color', bloquear números y caracteres especiales en tiempo real
    if (name === "color") {
      if (/\d/.test(value) || /[^a-zA-Z\s]/.test(value)) {
        return; // No actualizar el estado si contiene números o caracteres especiales
      }
    }

    // Validar cada campo según su tipo
    let errorMessage = "";
    if (name === "brand" || name === "model") {
      errorMessage = validateTextField(name, value);
    } else if (name === "year") {
      errorMessage = validateYear(Number(value));
    } else if (name === "pricePerDay") {
      errorMessage = validatePricePerDay(Number(value));
    } else if (name === "seats") {
      errorMessage = validateSeats(Number(value));
    } else if (name === "color") {
      errorMessage = validateColor(value);
    }

    // Actualizar el estado de los errores
    setFormErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    // Actualizar los datos del formulario
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await updateCar(Number(id), formData, token);
      toast.success("¡Se guardo correctamente!");
      router.push("/my-cars");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar el auto");
    }
  };

  const isFormValid = Object.values(formErrors).every((error) => !error);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!car) return <p className="text-center">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-7 pb-5 ">Editar Auto</h1>
      <div className="container mx-auto p-6 bg-white shadow-xl rounded-2xl ">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4 uppercase">Información</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                {/* Marca */}
                <label className="block text-gray-600 mb-1">Marca</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {formErrors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.brand}
                  </p>
                )}
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-gray-600 mb-1">Modelo</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {formErrors.model && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.model}
                  </p>
                )}
              </div>
            </div>

            {/* Tipo e auto */}
            <div>
              <label className="block text-sm font-medium">Tipo de Auto</label>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Selecciona un tipo de auto </option>
                <option value="Sedan">Sedán</option>
                <option value="Camioneta">Camioneta</option>
                <option value="SUV">SUV</option>
                <option value="Deportivo">Deportivo</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Año */}
              <div>
                <label className="block text-gray-600 mb-1">Año</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year || ""}
                  onChange={validacionAño}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-", "."].includes(e.key) &&
                    e.preventDefault()
                  }
                  className={`mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    yearError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {yearError && (
                  <p className="text-red-500 text-sm mt-1">{yearError}</p>
                )}
              </div>

              {/* Precio por día */}
              <div>
                <label className="block text-sm font-medium">
                  Precio por Día
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay || ""}
                  onChange={handleChange}
                  onKeyDown={(e) =>
                    (e.key === "." || e.key === ",") && e.preventDefault()
                  }
                  className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {formErrors.pricePerDay && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.pricePerDay}
                  </p>
                )}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {formErrors.color && (
                <p className="text-red-500 text-sm mt-1">{formErrors.color}</p>
              )}
            </div>
          </div>
          <div className="md:col-span-1">
            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="text-xl font-bold mb-4 uppercase">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Ejemplo: aire acondicionado, bluetooth, GPS"
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            {/* Imagen */}
            <div className="md:col-span-2">
              <label className="text-xl font-bold mb-7 uppercase"> FOTOS(URL)</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="border border-orange-500 text-orange-500 px-8 py-2 rounded"
          onClick={() => router.push("/my-cars")}
        >
          Cancelar
        </button>
        <button
          form="formulario"
          type="submit"
          className="bg-orange-500 text-white px-8 py-2 rounded"

        >
          Guardar
        </button>
      </div>
        </form>
      </div>
    </div>
  );
}
