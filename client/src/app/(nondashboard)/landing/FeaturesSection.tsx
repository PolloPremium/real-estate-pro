"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Animación para el contenedor principal
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

// Animación para cada tarjeta individual
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto">
        {/* Título de la sección */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-12 w-full sm:w-2/3 mx-auto"
        >
          ¡Encuentra rápidamente el hogar que deseas usando nuestros filtros de búsqueda efectivos!
        </motion.h2>

        {/* Tarjetas de características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                imageSrc={`/landing-search${3 - index}.png`}
                title={[
                  "Listados confiables y verificados",
                  "Explora listados de alquiler fácilmente",
                  "Simplifica tu búsqueda con filtros avanzados",
                ][index]}
                description={[
                  "Descubre las mejores opciones de alquiler con reseñas y valoraciones de usuarios.",
                  "Accede a reseñas y valoraciones para conocer mejor las opciones de alquiler.",
                  "Encuentra listados verificados para asegurar una experiencia sin complicaciones.",
                ][index]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de tarjeta sin botón
const FeatureCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    {/* Imagen */}
    <div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48">
      <Image
        src={imageSrc}
        width={400}
        height={400}
        className="w-full h-full object-contain"
        alt={title}
      />
    </div>

    {/* Título y descripción */}
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="mb-4">{description}</p>
  </div>
);

export default FeaturesSection;
