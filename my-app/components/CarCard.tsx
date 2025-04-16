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
    <Link href={`/car/${car.id}`}>
      <div className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-40 object-contain rounded mb-4"
        />
        <div className="text-lg font-bold text-orange-500">{car.pricePerDay}$</div>
        <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
        <p className="text-sm text-gray-600">{car.location}</p>
        <p className="text-sm text-gray-600">Cant de rentas: {car.rentalCount}</p>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span>{car.rating}</span>
        </div>
        {car.discount > 0 && (
          <p className="text-green-500">%{car.discount} descuento</p>
        )}
      </div>
    </Link>
  );
}