"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetCurrentResidencesQuery,
  useGetTenantQuery,
} from "@/state/api";
import React from "react";

const Residences = () => {
  // Obtener datos del usuario autenticado
  const { data: authUser } = useGetAuthUserQuery();

  // Obtener datos del inquilino usando el ID del usuario
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );

  // Obtener residencias actuales del inquilino
  const {
    data: currentResidences,
    isLoading,
    error,
  } = useGetCurrentResidencesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });

  // Mostrar pantalla de carga si los datos aún no han llegado
  if (isLoading) return <Loading />;

  // Mostrar error si ocurre un problema al obtener los datos
  if (error) return <div>Error al cargar las residencias actuales</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Residencias Actuales"
        subtitle="Consulta y gestiona tus espacios donde vives actualmente"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Renderizar cada residencia actual */}
        {currentResidences?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={tenant?.favorites.includes(property.id) || false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>

      {/* Mostrar mensaje si no hay residencias actuales */}
      {(!currentResidences || currentResidences.length === 0) && (
        <p>No tienes residencias actuales registradas</p>
      )}
    </div>
  );
};

export default Residences;
