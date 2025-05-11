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
  kilometers: string;
  fuelType: string;
  color: string;
  imageUrls: string[];
  isAvailable: boolean;
  unavailableDates: string[];
  description?: string;
}

export default function EditCar() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    imageUrls: [], 
  });

  const [formErrors, setFormErrors] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    seats: "",
    color: "",
    kilometers: "",
    fuelType: "",
    transmission: "",
  });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadCar = async () => {
      if (!token) return;
      try {
        const response = await fetchCarById(Number(id), token);
  
        // Verifica si la respuesta tiene `imageUrl` y convierte a un arreglo de URLs
        const imageUrls = Array.isArray(response.imageUrl) 
          ? response.imageUrl // Si ya es un arreglo, lo dejamos tal cual
          : response.imageUrl 
          ? [response.imageUrl] // Si es un solo string, lo convertimos en un arreglo
          : []; // Si es undefined o null, usamos un arreglo vacío
  
        // Asegúrate de que imageUrls tenga al menos 5 elementos
        const transformedResponse: Car = {
          ...response,
          imageUrls: imageUrls.length >= 5
            ? imageUrls // Si ya tiene 5 o más, lo dejamos igual
            : [...imageUrls, ...new Array(5 - imageUrls.length).fill('')], // Rellenamos hasta tener 5
        };
  
        setCar(transformedResponse);
        setFormData(transformedResponse);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar el auto");
      }
    };
  
    loadCar();
  }, [id, token]);
  
  

  const validatePricePerDay = (value: number) => {
    if (value <= 0) return "El precio debe ser mayor a 0";
    return "";
  };

  const validateSeats = (value: number) => {
    if (value < 1 || value > 20)
      return "La capacidad debe ser entre 1 y 20 asientos";
    return "";
  };

  const validateKilometers = (value: number) => {
    if (isNaN(value) || value < 0) return "El kilometraje debe ser un número válido";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    if (name === "pricePerDay") {
      errorMessage = validatePricePerDay(Number(value));
    } else if (name === "seats") {
      errorMessage = validateSeats(Number(value));
    } else if (name === "color") {
      errorMessage = validateColor(value);
    } else if (name === "kilometers") {
      errorMessage = validateKilometers(Number(value));
    } else if (name === "transmission") {
      errorMessage = value ? "" : "La transmisión es obligatoria";
    } else if (name === "fuelType") {
      errorMessage = value ? "" : "El combustible es obligatorio";
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
  
    // Asegurarse de que imageUrls siempre sea un arreglo de cadenas
    const validImageUrls = Array.isArray(formData.imageUrls)
      ? formData.imageUrls // Si ya es un arreglo de cadenas, lo dejamos tal cual
      : formData.imageUrls
      ? [formData.imageUrls] // Si es un string, lo convertimos en un arreglo
      : []; // Si es undefined, usamos un arreglo vacío
  
    const updatedFormData = {
      ...formData,
      imageUrls: validImageUrls, // Aseguramos que imageUrls sea siempre un arreglo de cadenas
    };
  
    try {
      console.log("Datos a enviar:", updatedFormData);
      await updateCar(Number(id), updatedFormData, token);
      toast.success("Auto editado con éxito !!");
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
            <h2 className="text-xl font-bold mb-4 uppercase">INFORMACIÓN</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                {/* Color */}
                <label className="block text-gray-600 mb-1">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {formErrors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.color}
                  </p>
                )}
              </div>

              {/* Precio por día */}
              <div>
                <label className="block text-gray-600 mb-1">
                  Precio por día *
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

            {/* Kilometraje */}
            <div>
              <label className="block text-sm font-medium">Kilometraje *</label>
              <input
                type="text"
                name="kilometers"
                value={formData.kilometers || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {formErrors.kilometers && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.kilometers}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
            </div>

            <h2 className="text-xl font-bold mb-4 uppercase">EQUIPAMIENTO</h2>
            {/* Transmision */}
            <div>
              <label className="block text-sm font-medium">Transmisión *</label>
              <select
                name="transmission"
                value={formData.transmission || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Seleccionar</option>
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
              </select>
              {formErrors.transmission && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.transmission}
                </p>
              )}
            </div>

            {/* Combustible*/}
            <div>
              <label className="block text-sm font-medium">Combustible *</label>
              <select
                name="fuelType"
                value={formData.fuelType || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 "
              >
                <option value="">Seleccionar</option>
                <option value="Gas">Gas</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
              {formErrors.fuelType && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.fuelType}
                </p>
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
            {/* Imágenes */}
            <div className="md:col-span-2">
              <label className="text-xl font-bold mb-7 uppercase">FOTOS (URL)</label>
              {(formData.imageUrls ?? []).map((url, index) => (
                <input
                  key={index}
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const updatedUrls = [...(formData.imageUrls ?? [])]; // Usamos un arreglo vacío si es undefined
                    updatedUrls[index] = e.target.value;
                    setFormData({ ...formData, imageUrls: updatedUrls });
                  }}
                  className="mt-2 block w-full p-3 border rounded-2xl shadow-sm"
                />
              ))}

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
