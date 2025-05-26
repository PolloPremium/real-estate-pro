"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";

const HeroSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Función para buscar ubicación usando la API de Mapbox
  
  const handleLocationSearch = async () => {
    try {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return; // Si no hay texto, salir

      // Llamada a la API de geocodificación de Mapbox con el texto ingresado
    
      const response = await fetch(
   
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          trimmedQuery
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();

  
      // Si hay resultados, extraer latitud y longitud
  
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
      
      
        // Actualizar filtros en el estado global con la ubicación y coordenadas
        dispatch(
          setFilters({
            location: trimmedQuery,
            coordinates: [lat, lng],
          })
        );

      
      
        // Construir parámetros para la URL y navegar a la página de búsqueda
       
        const params = new URLSearchParams({
          location: trimmedQuery,
          lat: lat.toString(),
          lng: lng.toString(),
        });
        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error buscando la ubicación:", error);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Imagen de fondo */}
    
      <Image
       
       src="/landing-splash.jpg"
        alt="Sección principal de AmityVille Renter"
        fill
        className="object-cover object-center"
     
        priority
      />
    
      {/* Capa oscura semi-transparente encima de la imagen para mejorar legibilidad */}
     
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>


      {/* Texto animado y barra de búsqueda */}
     
     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
       
          <h1 className="text-5xl font-bold text-white mb-4">
            Comienza tu viaje para encontrar el lugar perfecto para llamar hogar
          </h1>
         
         
          <p className="text-xl text-white mb-8">
            ¡Explora nuestra amplia variedad de propiedades en renta adaptadas a tu estilo de vida y necesidades!
          </p>

          {/* Barra de búsqueda */}
         
          <div className="flex justify-center">
           
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por ciudad, barrio o dirección"
              className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
            />
            <Button
              onClick={handleLocationSearch}
              className="bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12"
          
          >
              Buscar
          
            </Button>
          </div>
    
        </div>
   
      </motion.div>
    </div>
  );
};

export default HeroSection;