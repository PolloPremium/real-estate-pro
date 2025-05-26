import { useGetPropertyQuery } from "@/state/api"; 
import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Cargando...</>;
  if (isError || !property) {
    return <>Propiedad no encontrada</>;
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {property.location?.country} / {property.location?.state} /{" "}
          <span className="font-semibold text-gray-600">
            {property.location?.city === "Tijuana"
              ? "Tijuana"
              : property.location?.city}
          </span>
        </div>
        <h1 className="text-3xl font-bold my-5">{property.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city === "Tijuana"
              ? "Tijuana"
              : property.location?.city}
            , {property.location?.state}, {property.location?.country}
          </span>
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews}{" "}
              Reseñas)
            </span>
            <span className="text-green-600">Publicación verificada</span>
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Renta mensual</div>
            <div className="font-semibold">
              ${property.pricePerMonth.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Habitaciones</div>
            <div className="font-semibold">{property.beds} hab</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Baños</div>
            <div className="font-semibold">{property.baths} baños</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Superficie</div>
            <div className="font-semibold">
              {property.squareFeet.toLocaleString()} pies²
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="my-16">
        <h2 className="text-xl font-semibold mb-5">Acerca de {property.name}</h2>
        <p className="text-gray-500 leading-7">
          Vive la experiencia de lujo en {property.name}, un nuevo desarrollo residencial ubicado en el corazón de <strong>Tijuana</strong>, Baja California. Nuestras modernas unidades de dos y tres recámaras combinan diseño contemporáneo con funcionalidad, ofreciendo cocinas con acabados de granito, electrodomésticos de acero inoxidable, áreas de trabajo para home office y lavandería en la unidad.
          <br /><br />
          Disfruta de amenidades como alberca, gimnasio equipado, salones de coworking y áreas comunes con asadores, perfectas para convivencias al aire libre. La ubicación privilegiada permite un acceso rápido a plazas como Plaza Río y zonas de hospitales como Hospital Ángeles Tijuana y Clínica del Prado.
          <br /><br />
          Además, estarás a pocos minutos de la garita de San Ysidro, playas de Tijuana y vialidades principales como el Bulevar Agua Caliente. ¡Contáctanos hoy y agenda tu recorrido! Vive en un entorno seguro, moderno y bien conectado.
        </p>
      </div>
    </div>
  );
};

export default PropertyOverview;
