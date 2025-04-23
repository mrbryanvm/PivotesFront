'use Client';
import Link from 'next/link';

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
}

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/car-details/${car.id}`}>
      <div className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-40 object-contain rounded mb-4"
        />
        <div className="px-2">
          <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
          <p className="text-sm text-gray-600">Cant de rentas: {car.rentalCount}</p>
          <p className="text-sm text-gray-600">{car.location}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-lg font-bold text-black">{car.pricePerDay}$</span>
            <div className="flex items-center text-sm text-yellow-500">
              ★ <span className="text-black ml-1">{car.rating}</span>
            </div>
          </div>
          {car.discount > 0 && (
            <p className="text-green-500">%{car.discount} descuento</p>
          )}
        </div>
      </div>
    </Link>
  );
}