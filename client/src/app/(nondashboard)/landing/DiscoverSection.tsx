"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Variantes para animar el contenedor con efecto de aparición gradual
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Variantes para animar cada elemento individualmente con movimiento vertical
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-white mb-16"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
   
        {/* Título y descripción */}
       
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Descubre
          </h2>
         
          <p className="mt-4 text-lg text-gray-600">
            ¡Encuentra hoy la propiedad de alquiler de tus sueños!
          </p>
         
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
            Buscar tu propiedad ideal en alquiler nunca ha sido tan fácil. Con nuestra función de búsqueda fácil de usar, puedes encontrar rápidamente el hogar perfecto que cumpla con todos tus requisitos. ¡Comienza tu búsqueda hoy y encuentra tu hogar soñado!
         
          </p>
        </motion.div>

        {/* Tarjetas de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
          {[
            {
            
              imageSrc: "/landing-icon-wand.png",
              title: "Buscar Propiedades",
              description:
                "Explora nuestra amplia colección de propiedades en alquiler en la ubicación que deseas.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Reserva tu Alquiler",
              description:
                "Una vez que encuentres la propiedad perfecta, resérvala fácilmente en línea con solo unos clics.",
            },
            {
             
              imageSrc: "/landing-icon-heart.png",
              title: "Disfruta tu Nuevo Hogar",
              description:
                "Múdate a tu nueva propiedad en alquiler y comienza a disfrutar de tu hogar soñado.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Componente individual para cada tarjeta de descubrimiento

        const DiscoverCard = ({
          imageSrc,
          title,
          description,
        }: {
          imageSrc: string;
          title: string;
          description: string;
        }) => (
          <div className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72">
          
            {/* Ícono de la tarjeta */}

            <div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
              <Image
                src={imageSrc}
                width={30}
                height={30}
                className="w-full h-full"
                alt={title} 
              />
            </div>

          
            {/* Título y descripción */}
          
            <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
          
            <p className="mt-2 text-base text-gray-500">{description}</p>
  
  </div>
);

export default DiscoverSection;