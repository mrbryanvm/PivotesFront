"use client";
import React from "react";

interface PanelProps {
  visible: boolean;
  onClose: () => void;
}

const Panel: React.FC<PanelProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
        className="fixed top-[180px] left-[40px] bg-white border rounded-lg shadow-xl z-50 w-64 max-h-[400px] overflow-y-auto p-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
        <style jsx>{`
            div::-webkit-scrollbar {
                display: none;
            }
        `}</style>

      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">Más filtros</h4>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          ×
        </button>
      </div>

      {/* Capacidad */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Capacidad</p>
        {["1 a 2 personas", "3 a 5 personas", "6 o más"].map((capacidad) => (
          <label key={capacidad} className="flex items-center gap-2">
            <input type="checkbox" name="capacidad" value={capacidad} />
            {capacidad}
          </label>
        ))}
      </div>

      {/* Maletero */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Maletero</p>
        {["1 a 2 maletas", "3 a 4 maletas", "5 o más"].map((maletero) => (
          <label key={maletero} className="flex items-center gap-2">
            <input type="checkbox" name="maletero" value={maletero} />
            {maletero}
          </label>
        ))}
      </div>

      {/* Colores */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Color auto</p>
        {["Blanco", "Rojo", "Negro", "Gris", "Azul", "Otro"].map((color) => (
          <label key={color} className="flex items-center gap-2">
            <input type="checkbox" name="color" value={color.toLowerCase()} />
            {color}
          </label>
        ))}
      </div>

      {/* Características adicionales */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Características adicionales
        </p>
        {[
          "Aire acondicionado",
          "Pantalla táctil",
          "Sensor de retroceso",
          "Cámara",
          "Silla para niños",
          "Permite mascotas",
          "Bluetooth / USB / Auxiliar",
        ].map((item) => (
          <label key={item} className="flex items-center gap-2">
            <input type="checkbox" name="features" value={item} />
            {item}
          </label>
        ))}
      </div>

      {/* Puertas */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Puertas</p>
        {["3 puertas", "5 puertas"].map((puerta) => (
          <label key={puerta} className="flex items-center gap-2">
            <input type="checkbox" name="doors" value={puerta} />
            {puerta}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Panel;
