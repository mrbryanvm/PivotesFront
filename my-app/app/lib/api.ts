import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  discount: number;
  rentalCount: number;
  rating: number;
  location: string;
  imageUrl: string;
  host: {
    id: number;
    email: string;
  };
  unavailableDates: string[]; // Nuevo: HU 7
  extraEquipment: string[];  // Nuevo: HU 8
  seats: number;
  transmission: string;
  color: string;
  isAvailable: boolean;
}

interface CarsResponse {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
}

interface Filters {
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
  page?: number;
  search?: string;
  brand?: string; // Nuevo: HU 3
  model?: string; // Nuevo: HU 3
}

export const fetchCars = async (filters: Filters, token?: string): Promise<CarsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(`${API_URL}/cars`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return response.data;
};

export const fetchMyCars = async (filters: Filters, token: string): Promise<CarsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(`${API_URL}/cars/my-cars`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Nueva función para actualizar fechas de no disponibilidad (HU 7)
export const updateCarAvailability = async (carId: number, unavailableDates: string[], token: string) => {
  const response = await axios.patch(
    `${API_URL}/cars/${carId}/availability`,
    { unavailableDates },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};