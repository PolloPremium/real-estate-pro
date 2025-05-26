import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { HelpCircle } from "lucide-react";
import React from "react";

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Cargando detalles...</>;
  if (isError || !property) {
    return <>Propiedad no encontrada</>;
  }

  return (
    <div className="mb-6">
      {/* Amenidades */}
      <div>
        <h2 className="text-xl font-semibold my-3">Amenidades de la propiedad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {property.amenities.map((amenity: AmenityEnum) => {
            const Icon = AmenityIcons[amenity as AmenityEnum] || HelpCircle;
            return (
              <div
                key={amenity}
                className="flex flex-col items-center border rounded-xl py-8 px-4"
              >
                <Icon className="w-8 h-8 mb-2 text-gray-700" />
                <span className="text-sm text-center text-gray-700">
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destacados */}
      <div className="mt-12 mb-16">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
          Características destacadas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 w-full">
          {property.highlights.map((highlight: HighlightEnum) => {
            const Icon =
              HighlightIcons[highlight as HighlightEnum] || HelpCircle;
            return (
              <div
                key={highlight}
                className="flex flex-col items-center border rounded-xl py-8 px-4"
              >
                <Icon className="w-8 h-8 mb-2 text-primary-600 dark:text-primary-300" />
                <span className="text-sm text-center text-primary-600 dark:text-primary-300">
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección de pestañas */}
      <div>
        <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 mb-5">
          Tarifas y políticas
        </h3>
        <p className="text-sm text-primary-600 dark:text-primary-300 mt-2">
          Las tarifas mostradas se basan en datos proporcionados por la comunidad y pueden no incluir costos adicionales o servicios.
        </p>
        <Tabs defaultValue="required-fees" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required-fees">Tarifas requeridas</TabsTrigger>
            <TabsTrigger value="pets">Mascotas</TabsTrigger>
            <TabsTrigger value="parking">Estacionamiento</TabsTrigger>
          </TabsList>

          <TabsContent value="required-fees" className="w-1/3">
            <p className="font-semibold mt-5 mb-2">Tarifas únicas al mudarse</p>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Tarifa de solicitud
              </span>
              <span className="text-primary-700">
                ${property.applicationFee}
              </span>
            </div>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Depósito de seguridad
              </span>
              <span className="text-primary-700">
                ${property.securityDeposit}
              </span>
            </div>
            <hr />
          </TabsContent>

          <TabsContent value="pets">
            <p className="font-semibold mt-5 mb-2">
              Las mascotas {property.isPetsAllowed ? "están permitidas" : "no están permitidas"}
            </p>
          </TabsContent>

          <TabsContent value="parking">
            <p className="font-semibold mt-5 mb-2">
              El estacionamiento {property.isParkingIncluded ? "está incluido" : "no está incluido"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
