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
    search?: string;
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

  const handleResetFilters = () => {
    onFilterChange({
      location: '',
      startDate: '',
      endDate: '',
      hostId: undefined,
      carType: '',
      transmission: '',
      fuelType: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'relevance',
    });
    setShowFuelTypeOptions(false);
  };  

  const hayFiltrosActivos = () => {
    return (
      filters.location ||
      filters.startDate ||
      filters.endDate ||
      filters.hostId ||
      filters.carType ||
      filters.transmission ||
      filters.fuelType ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      (filters.sortBy && filters.sortBy !== 'relevance')
    );
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* FILA SUPERIOR: Ubicación, De, Hasta */}
      <div className="bg-white shadow rounded-full px-6 py-3 flex items-center justify-between gap-6 max-w-4xl mx-auto">
        <select
          name="location"
          value={filters.location || ''}
          onChange={handleChange}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
        >
          <option value="">Ubicación</option>
          <option value="Santa Cruz">Santa Cruz</option>
          <option value="Cochabamba">Cochabamba</option>
          <option value="La Paz">La Paz</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate || ''}
          onChange={handleChange}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate || ''}
          onChange={handleChange}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
        />

        <button type="button" className="text-orange-500 hover:text-orange-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="flex justify-center">
        <input
          type="text"
          name="search"
          placeholder="Buscar"
          value={filters.search || ''}
          onChange={handleChange}
          className="mt-4 w-full max-w-4xl px-4 py-2 border rounded bg-[#F9F1E7] text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* FILTROS EN FILA */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="w-40">
          <select name="hostId" value={filters.hostId || ''} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Host</option>
            <option value="1">host1@example.com</option>
            <option value="2">host2@example.com</option>
          </select>
        </div>

        <div className="w-40">
          <select name="carType" value={filters.carType || ''} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Tipo de Auto</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
            <option value="SUV">SUV</option>
          </select>
        </div>

        <div className="w-40">
          <select name="transmission" value={filters.transmission || ''} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Transmisión</option>
            <option value="manual">Manual</option>
            <option value="automático">Automático</option>
          </select>
        </div>

        <div className="w-40 relative">
          <button
            type="button"
            onClick={() => setShowFuelTypeOptions(!showFuelTypeOptions)}
            className="border p-2 rounded flex items-center justify-between w-full"
          >
            {filters.fuelType || 'Consumo'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showFuelTypeOptions && (
            <div className="absolute bg-white border rounded mt-2 p-2 shadow-lg z-10">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.fuelType === 'Gas'} onChange={() => handleFuelTypeChange('Gas')} />
                Gas
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.fuelType === 'Gasolina'} onChange={() => handleFuelTypeChange('Gasolina')} />
                Gasolina
              </label>
            </div>
          )}
        </div>

        <div className="w-40">
          <select name="sortBy" value={filters.sortBy || 'relevance'} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="relevance">Relevancia</option>
            <option value="priceAsc">Precio (Menor a Mayor)</option>
            <option value="priceDesc">Precio (Mayor a Menor)</option>
            <option value="rating">Calificación</option>
            <option value="rentalCount">Cantidad de Rentas</option>
          </select>
        </div>

        {/* Botón solo si hay filtros activos */}
      
        {hayFiltrosActivos() && (
        
          <button
          type="button"
          onClick={handleResetFilters}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z" />
            </svg>
        
          </button>
        )}
      </div>
    </div>
  );
}