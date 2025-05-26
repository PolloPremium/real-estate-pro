import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";

// Componente principal de la página de aterrizaje (Landing Page)
// Aquí se ensamblan las secciones que forman la página principal

const Landing = () => {
  return (
    <div>
      {/* Sección Hero con búsqueda y bienvenida */}
      <HeroSection />
      {/* Sección con características principales del servicio */}
      <FeaturesSection />
      {/* Sección para descubrir propiedades o funcionalidades */}
      <DiscoverSection />
      {/* Sección con llamada a la acción */}
      <CallToActionSection />
      {/* Pie de página con enlaces y redes sociales */}
      <FooterSection />
    </div>
  );
};

export default Landing;