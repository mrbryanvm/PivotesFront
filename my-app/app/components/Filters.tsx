'use client';

import { useState, useEffect } from 'react';

interface FiltersProps {
  filters: {
    location?: string;
    startDate?: string;
    endDate?: string;
    hostId?: string;
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSuggestions(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


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
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({ ...filters, search: value });
  
    const saved = localStorage.getItem('searchHistory');
    const previousSearches = saved ? JSON.parse(saved) as string[] : [];
  
    const normalized = value.trim().toLowerCase();
  
    const matched = previousSearches.filter(item =>
      item.toLowerCase().includes(normalized)
    );
  
    if (value && !previousSearches.map(v => v.toLowerCase()).includes(normalized)) {
      matched.unshift(value);
    }    
  
    setSuggestions(matched);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (value: string) => {
    onFilterChange({ ...filters, search: value });
    setShowSuggestions(false);
  
    const saved = localStorage.getItem('searchHistory');
    const previousSearches = saved ? JSON.parse(saved) as string[] : [];
  
    const updatedSearches = [value, ...previousSearches.filter(v => v !== value)];
  
    localStorage.setItem('searchHistory', JSON.stringify(updatedSearches.slice(0, 10)));
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
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* FILA SUPERIOR: Ubicación, De, Hasta */}
      <div className="flex items-center justify-between bg-white rounded-full px-6 py-3 shadow-md w-full max-w-4xl">
        {/* Ubicación */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black-500">Ubicación</span>
          <select
            name="location"
            value={filters.location || ''}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium text-gray-500"
          >
            <option value="">Ubicación</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Cochabamba">Cochabamba</option>
            <option value="La Paz">La Paz</option>
          </select>
        </div>

        {/* Fecha Inicio */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black-500">De</span>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ''}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium text-gray-500"
          />
        </div>

        {/* Fecha Fin */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black-500">Hasta</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ''}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium text-gray-500"
          />
        </div>

        {/* Botón lupa */}
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

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative w-full max-w-4xl mt-4">
        <div className="flex rounded overflow-hidden border border-gray-300">
          {/* Botón de búsqueda */}
          <button
            type="button"
            onClick={() => console.log('Buscar:', filters.search)}
            className="bg-[#FBE7C2] px-6 py-2 font-semibold text-xs text-gray-700"
          >
            Buscar
          </button>

        {/* Campo de texto */}
          <input
            type="text"
            name="search"
            placeholder="Buscar"
            value={filters.search || ''}
            onChange={handleSearchInput}
            className="flex-1 px-4 py-2 bg-[#F9F1E7] text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border mt-1 z-50 shadow-lg max-h-60 overflow-y-auto rounded-md">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-100 ${
                  index === hoveredIndex ? 'bg-orange-100' : ''
                }`}
              >
                {item}
              </li>
              ))}
          </ul>
        )}
      </div>

      {/* FILTROS EN FILA */}
 
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">

      {/* HOST */}

      {filters.hostId ? (
      <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
      <span className="truncate">{filters.hostId === '1' ? 'host1@example.com' : 'host2@example.com'}</span>
      <button
        onClick={() => onFilterChange({ ...filters, hostId: '' })}
        className="ml-2 text-white hover:text-gray-200 font-bold"
      >
        ×
        </button>
      </div>
    ) : (
    <div className="w-40">
      <select
         name="hostId"
         value={filters.hostId || ''}
         onChange={handleChange}
         className="border p-2 rounded w-full"
      >
         <option value="">Host</option>
         <option value="1">host1@example.com</option>
         <option value="2">host2@example.com</option>
         </select>
     </div>
      )}

      {/*TIPO DE AUTO */}
      {filters.carType ? (

     <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
        <span className="truncate capitalize">{filters.carType}</span>
        <button
          onClick={() => onFilterChange({ ...filters, carType: '' })}
          className="ml-2 text-white hover:text-gray-200 font-bold"
        >
           ×
         </button>
       </div>
    ) : (
      <div className="w-40">
          <select
                name="carType"
                value={filters.carType || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
           >
              <option value="">Tipo de Auto</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
        )}

        {/* TRANSMISION */}
        {filters.transmission ? (
           <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
            <span className="truncate capitalize">
        {{
             manual: 'Manual',
             automático: 'Automático',
        }[filters.transmission]}
        </span>
        <button
          onClick={() => onFilterChange({ ...filters, transmission: '' })}
          className="ml-2 text-white hover:text-gray-200 font-bold"
        >
           ×
        </button>
     </div>
        ) : (
          <div className="w-40">
          <select
            name="transmission"
            value={filters.transmission || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Transmisión</option>
            <option value="manual">Manual</option>
            <option value="automático">Automático</option>
          </select>

       </div>
      )}
        
      {/*CONSUMO */}
      {filters.fuelType ? (

     <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
     <span className="truncate capitalize">{filters.fuelType}</span>
     <button
         onClick={() => onFilterChange({ ...filters, fuelType: '' })}
         className="ml-2 text-white hover:text-gray-200 font-bold"
      >
        ×
       </button>
     </div>
   ) : (
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
       )}

      {/* RELEVANCIA */}
        {filters.sortBy && filters.sortBy !== 'relevance' ? (
         <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-40 justify-between">
          <span className="truncate">{{
           relevance: 'Relevancia',
           priceAsc: 'Precio (Menor a Mayor)',
           priceDesc: 'Precio (Mayor a Menor)',
           rating: 'Calificación',
           rentalCount: 'Cantidad de Rentas'
        }[filters.sortBy]}</span>

        <button
        onClick={() => onFilterChange({ ...filters, sortBy: 'relevance' })}
        className="ml-2 text-white hover:text-gray-200 font-bold"
        >
          ×
        </button>
     </div>
         ) : (
          <div className="w-40">
          <select
          name="sortBy"
          value={filters.sortBy || 'relevance'}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          >
         <option value="relevance">Relevancia</option>
         <option value="priceAsc">Precio (Menor a Mayor)</option>
         <option value="priceDesc">Precio (Mayor a Menor)</option>
         <option value="rating">Calificación</option>
         <option value="rentalCount">Cantidad de Rentas</option>
         </select>
        </div>
         )}


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
