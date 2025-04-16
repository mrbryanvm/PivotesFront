'use client';

import { useState } from 'react';

interface MyCarsFiltersProps {
  filters: {
    brand?: string;
    model?: string;
    carType?: string;
    transmission?: string;
    sortBy?: string;
  };
  onFilterChange: (filters: MyCarsFiltersProps['filters']) => void;
}

export default function MyCarsFilters({ filters, onFilterChange }: MyCarsFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="mb-4">
      <div className="flex gap-4 flex-wrap">
        {/* Filtro de Marca */}
        <div>
          <input
            type="text"
            name="brand"
            value={filters.brand || ''}
            onChange={handleChange}
            placeholder="Marca"
            className="border p-2 rounded"
          />
        </div>

        {/* Filtro de Modelo */}
        <div>
          <input
            type="text"
            name="model"
            value={filters.model || ''}
            onChange={handleChange}
            placeholder="Modelo"
            className="border p-2 rounded"
          />
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
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <select
            name="sortBy"
            value={filters.sortBy || ''}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Ordenar por</option>
            <option value="priceAsc">Precio (Menor a Mayor)</option>
            <option value="priceDesc">Precio (Mayor a Menor)</option>
            <option value="rentalCount">Cantidad de Rentas</option>
            <option value="yearAsc">Antigüedad (Ascendente)</option>
            <option value="yearDesc">Antigüedad (Descendente)</option>
          </select>
        </div>
      </div>
    </div>
  );
}