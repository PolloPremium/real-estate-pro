"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
} from "@/state/api";
import React from "react";

const Favorites = () => {
  // Obtener datos del usuario autenticado
  const { data: authUser } = useGetAuthUserQuery();

  // Obtener datos del inquilino usando el ID del usuario autenticado
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );

  // Obtener propiedades favoritas del inquilino
  const {
    data: favoriteProperties,
    isLoading,
    error,
  } = useGetPropertiesQuery(
    { favoriteIds: tenant?.favorites?.map((fav: { id: number }) => fav.id) },
    { skip: !tenant?.favorites || tenant?.favorites.length === 0 }
  );

  // Mostrar componente de carga si los datos están cargando
  if (isLoading) return <Loading />;

  // Mostrar mensaje de error si ocurre un problema
  if (error) return <div>Error al cargar las propiedades favoritas</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Propiedades Favoritas"
        subtitle="Explora y gestiona tus propiedades guardadas"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Renderizar cada propiedad favorita */}
        {favoriteProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={true}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>

      {/* Mostrar mensaje si no hay propiedades favoritas */}
      {(!favoriteProperties || favoriteProperties.length === 0) && (
        <p>No tienes propiedades marcadas como favoritas</p>
      )}
    </div>
  );
};

export default Favorites;
