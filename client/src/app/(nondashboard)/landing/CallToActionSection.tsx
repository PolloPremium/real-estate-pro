"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CallToActionSection = () => {
  return (
    <div className="relative py-24">

      {/* Imagen de fondo */}

      <Image
        src="/landing-call-to-action.jpg"
        alt="Fondo de la sección de búsqueda de Rentiful"
        fill
        className="object-cover object-center"
      />

      {/* Capa oscura sobre la imagen */}

      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Contenedor con animación al entrar en vista */}

      <motion.div
       
       initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Título */}
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl font-bold text-white">
              Encuentra la propiedad de alquiler de tus sueños
           
            </h2>
          </div>

          {/* Descripción y botones */}
          <div>
            <p className="text-white mb-3">
            
              Descubre una amplia variedad de propiedades en alquiler en la ubicación que deseas.
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              {/* Botón de búsqueda: desplaza hacia arriba */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block text-primary-700 bg-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-500 hover:text-primary-50"
              >
                Buscar
              </button>

              {/* Enlace para registrarse */}

              <Link
                href="/signup"
                className="inline-block text-white bg-secondary-500 rounded-lg px-6 py-3 font-semibold hover:bg-secondary-600"
                scroll={false}
              >
                Registrarse
           
              </Link>
            </div>
        
          </div>
       
       
        </div>
      </motion.div>
    
    </div>
  );
};

export default CallToActionSection;