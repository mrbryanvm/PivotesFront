'use client';
import toast from "react-hot-toast";
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
  const [formErrors, setFormErrors] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    seats: '',
    color: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // Nuevo estado para el mensaje de éxito

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
  
    return '';
  };
  

  const validateYear = (value: number) => {
    const currentYear = new Date().getFullYear();
    
    // Verificar si el valor tiene exactamente 4 dígitos
    if (value.toString().length !== 4) {
      return 'El año debe tener exactamente 4 dígitos';
    }
  
    if (value < 1900) return 'El año no puede ser menor a 1900';
    if (value > currentYear) return `El año no puede ser mayor a ${currentYear}`;
    
    return '';
  };

  const validatePricePerDay = (value: number) => {
    if (value <= 0) return 'El precio debe ser mayor a 0';
    return '';
  };

  const validateSeats = (value: number) => {
    if (value < 1 || value > 20) return 'La capacidad debe ser entre 1 y 20 asientos';
    return '';
  };

  const validateColor = (value: string) => {
    if (!value.trim()) return 'El color es obligatorio';
    if (/\d/.test(value)) return 'El color no puede contener números';
    if (/[^a-zA-Z\s]/.test(value)) return 'El color no puede contener caracteres especiales';
    return '';
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const target = e.target as HTMLInputElement | HTMLSelectElement; // Aseguramos que e.target es un input o select
    //const name = target.name; // Ahora podemos acceder a `name` de forma segura
  
    if (name === 'brand' || name === 'model') {
      const allowedChars = /^[a-zA-Z\s]*$/; // Solo letras y espacios
      if (!allowedChars.test(e.key)) {
        e.preventDefault();  // Bloquear tecla no permitida
      }
    }
    if (name === 'year') {
      // Si el valor ya tiene 4 dígitos, bloquear la tecla (no permitir más caracteres)
      if (value.length >= 4) {
        e.preventDefault();
      }
    }
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Si el campo es 'color', bloquear números y caracteres especiales en tiempo real
    if (name === 'color') {
      if (/\d/.test(value) || /[^a-zA-Z\s]/.test(value)) {
        return; // No actualizar el estado si contiene números o caracteres especiales
      }
    }
  
    // Validar cada campo según su tipo
    let errorMessage = '';
    if (name === 'brand' || name === 'model') {
      errorMessage = validateTextField(name, value);
    } else if (name === 'year') {
      errorMessage = validateYear(Number(value));
    } else if (name === 'pricePerDay') {
      errorMessage = validatePricePerDay(Number(value));
    } else if (name === 'seats') {
      errorMessage = validateSeats(Number(value));
    } else if (name === 'color') {
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
      router.push('/my-cars');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el auto');
    }
    
  };

  const isFormValid = Object.values(formErrors).every((error) => !error);

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
            onKeyDown={handleKeyDown} 
            className="border p-2 rounded w-full"
          />
          {formErrors.brand && <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>}
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
          {formErrors.model && <p className="text-red-500 text-sm mt-1">{formErrors.model}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Año</label>
          <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={validacionAño}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
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
        <div className="mb-4">
          <label className="block text-sm font-medium">Categoría</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
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
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',') {
                e.preventDefault();
              }
            }}
            step="1"
          />
          {formErrors.pricePerDay && <p className="text-red-500 text-sm mt-1">{formErrors.pricePerDay}</p>}
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
            onKeyDown={handleKeyDown} 
            className="border p-2 rounded w-full"
          />
          {formErrors.color && <p className="text-red-500 text-sm mt-1">{formErrors.color}</p>}
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
          {formErrors.seats && <p className="text-red-500 text-sm mt-1">{formErrors.seats}</p>}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            disabled={!isFormValid}
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              if (car) setFormData(car); // Restaurar valores originales
              router.push('/my-cars');   // Redirigir
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
