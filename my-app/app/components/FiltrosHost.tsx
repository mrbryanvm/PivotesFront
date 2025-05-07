"use client";

import { FaTrash } from "react-icons/fa";

interface FiltersProps {
  filters: {
    brand: string;
    model: string;
    carType: string;
    transmission: string;
    sortBy: string;
    page: number;
    limit: number;
  };
  onFilterChange: (newFilters: Partial<FiltersProps["filters"]>) => void;
  onClearFilters: () => void;
}

const FiltrosHost: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hayFiltrosActivos = () => {
    return (
      filters.brand !== "" ||
      filters.carType !== "" ||
      filters.transmission !== "" ||
      filters.sortBy !== ""
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-2 items-center">
      <input
        type="text"
        placeholder="Marca"
        value={filters.brand}
        onChange={(e) => onFilterChange({ brand: e.target.value })}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Modelo"
        value={filters.model}
        onChange={(e) => onFilterChange({ model: e.target.value })}
        className="p-2 border rounded"
      />

      {filters.transmission ? (
        <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-full justify-between">
          <span className="truncate capitalize">{filters.transmission}</span>
          <button
            onClick={() => onFilterChange({ transmission: "" })}
            className="ml-2 text-white hover:text-gray-200 font-bold"
          >
            ×
          </button>
        </div>
      ) : (
        <select
          value={filters.transmission}
          onChange={(e) => onFilterChange({ transmission: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="">Transmisión</option>
          <option value="Manual">Manual</option>
          <option value="Automática">Automática</option>
        </select>
      )}

      {filters.sortBy ? (
        <div className="flex items-center bg-orange-500 text-white rounded-full px-3 py-1 w-full justify-between">
          <span className="truncate capitalize">
            {filters.sortBy === "priceAsc"
              ? "Precio: menor a mayor"
              : "Precio: mayor a menor"}
          </span>
          <button
            onClick={() => onFilterChange({ sortBy: "" })}
            className="ml-2 text-white hover:text-gray-200 font-bold"
          >
            ×
          </button>
        </div>
      ) : (
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="">Ordenar por</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="priceDesc">Precio: mayor a menor</option>
        </select>
      )}

      {hayFiltrosActivos() && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClearFilters}
            className="w-20 h-9 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltrosHost;
