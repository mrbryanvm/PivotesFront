'use client';

import { useState } from 'react';

interface FiltersProps {
  filters: {
    location?: string;
    startDate?: string;
    endDate?: string;
    hostId?: number;
    carType?: string;
    transmission?: string;
    fuelType?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
  onFilterChange: (filters: FiltersProps['filters']) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [showFuelTypeOptions, setShowFuelTypeOptions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleFuelTypeChange = (fuelType: string) => {
    onFilterChange({ ...filters, fuelType });
    setShowFuelTypeOptions(false);
  };

  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      {/* Filtro de Ubicación */}
      <div>
        <select
          name="location"
          value={filters.location || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Ubicación</option>
          <option value="Santa Cruz">Santa Cruz</option>
          <option value="Cochabamba">Cochabamba</option>
          <option value="La Paz">La Paz</option>
        </select>
      </div>

      {/* Filtro de Fechas */}
      <div className="flex gap-2">
        <input
          type="date"
          name="startDate"
          value={filters.startDate || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Filtro de Host */}
      <div>
        <select
          name="hostId"
          value={filters.hostId || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Host</option>
          <option value="1">host1@example.com</option>
          <option value="2">host2@example.com</option>
        </select>
      </div>

      {/* Filtro de Tipo de Auto */}
      <div>
        <select
          name="carType"
          value={filters.carType || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Tipo de Auto</option>
          <option value="Mediano">Mediano</option>
          <option value="Grande">Grande</option>
          <option value="SUV">SUV</option>
        </select>
      </div>

      {/* Filtro de Transmisión */}
      <div>
        <select
          name="transmission"
          value={filters.transmission || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Transmisión</option>
          <option value="manual">Manual</option>
          <option value="automático">Automático</option>
        </select>
      </div>

      {/* Filtro de Consumo (Combustible) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowFuelTypeOptions(!showFuelTypeOptions)}
          className="border p-2 rounded flex items-center gap-2"
        >
          {filters.fuelType || 'Consumo'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showFuelTypeOptions && (
          <div className="absolute bg-white border rounded mt-2 p-2 shadow-lg z-10">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.fuelType === 'Gas'}
                onChange={() => handleFuelTypeChange('Gas')}
              />
              Gas
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.fuelType === 'Gasolina'}
                onChange={() => handleFuelTypeChange('Gasolina')}
              />
              Gasolina
            </label>
          </div>
        )}
      </div>

      {/* Ordenamiento */}
      <div>
        <select
          name="sortBy"
          value={filters.sortBy || 'relevance'}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="relevance">Relevancia</option>
          <option value="priceAsc">Precio (Menor a Mayor)</option>
          <option value="priceDesc">Precio (Mayor a Menor)</option>
          <option value="rating">Calificación</option>
          <option value="rentalCount">Cantidad de Rentas</option>
        </select>
      </div>
    </div>
  );
}