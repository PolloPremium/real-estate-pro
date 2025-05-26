"use client"; // Indica que este componente se ejecuta en el cliente (cliente-side rendering)

import Card from "@/components/Card"; // Componente de tarjeta para mostrar propiedades
import Header from "@/components/Header"; // Componente de encabezado reutilizable
import Loading from "@/components/Loading"; // Componente de carga mientras se obtienen los datos
import {
  useGetAuthUserQuery,
  useGetManagerPropertiesQuery,
} from "@/state/api"; // Hooks para obtener el usuario autenticado y sus propiedades
import React from "react";

const Properties = () => {
  // Obtener datos del usuario autenticado
  const { data: authUser } = useGetAuthUserQuery();

  // Obtener las propiedades asociadas al usuario (manager)
  const {
    data: managerProperties,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId, // Evita ejecutar la query si no hay userId
  });

  // Mostrar componente de carga si aún están llegando los datos
  if (isLoading) return <Loading />;

  // Mostrar mensaje de error si ocurre un problema al obtener los datos
  if (error) return <div>Error al cargar las propiedades del administrador</div>;

  return (
    <div className="dashboard-container">
      {/* Encabezado principal de la página */}
      <Header
        title="Mis Propiedades"
        subtitle="Visualiza y administra tus propiedades"
      />

      {/* Grid de propiedades con diseño responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <Card
            key={property.id} // Clave única para cada propiedad
            property={property} // Datos de la propiedad enviados al componente Card
            isFavorite={false} // No se usa el botón de favoritos en este caso
            onFavoriteToggle={() => {}} // Función vacía porque no se usa aquí
            showFavoriteButton={false} // Ocultar botón de favoritos
            propertyLink={`/managers/properties/${property.id}`} // Ruta para ir a los detalles
          />
        ))}
      </div>

      {/* Mensaje si no hay propiedades */}
      {(!managerProperties || managerProperties.length === 0) && (
        <p>No administras ninguna propiedad</p>
      )}
    </div>
  );
};

export default Properties;
