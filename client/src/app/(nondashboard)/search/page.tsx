"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./Map";
import Listings from "./Listings";

const SearchPage = () => {
  // Obtener los parámetros de búsqueda de la URL
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Obtener el estado global para saber si el filtro completo está abierto
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  // Efecto para cargar y procesar los filtros iniciales desde los parámetros URL
  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }
        return acc;
      },
      {}
    );

    // Limpiar los filtros para eliminar valores vacíos o nulos
    const cleanedFilters = cleanParams(initialFilters);

    // Guardar los filtros en el estado global
    dispatch(setFilters(cleanedFilters));
  }, [searchParams, dispatch]);

  return (
    <div
      className="w-full mx-auto px-5 flex flex-col"
      style={{
        // Altura dinámica restando la altura de la barra de navegación
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      {/* Barra superior de filtros */}
      <FiltersBar />

      {/* Contenedor principal con filtros, mapa y listado */}
      <div className="flex justify-between flex-1 overflow-hidden gap-3 mb-5">
        {/* Panel lateral con filtros completos, visible solo si está abierto */}
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "w-3/12 opacity-100 visible"
              : "w-0 opacity-0 invisible"
          }`}
        >
          <FiltersFull />
        </div>

        {/* Mapa de propiedades */}
        <Map />

        {/* Listado de propiedades */}
        <div className="basis-4/12 overflow-y-auto">
          <Listings />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
