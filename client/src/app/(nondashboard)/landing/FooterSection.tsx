import Link from "next/link"; 
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Logo en fila completa */}
        <div className="w-full mb-8">
          <Link href="/landing" className="text-2xl font-bold tracking-wide block" scroll={false}>
            AMITYVILLE RENTER
          </Link>
        </div>

        {/* Navegación e iconos en flex row con espacio */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Navegación principal del footer */}
          <nav className="mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-8 text-lg leading-relaxed">
              <li>
                <Link href="/landing/about" className="hover:underline">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/landing/contact" className="hover:underline">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link href="/landing/faq" className="hover:underline">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/landing/terms" className="hover:underline">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/landing/privacy" className="hover:underline">
                  Privacidad
                </Link>
              </li>
            </ul>
          </nav>

          {/* Iconos de redes sociales */}
          <div className="flex space-x-6">
            <a href="#" aria-label="Facebook" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faFacebook} className="h-7 w-7" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faInstagram} className="h-7 w-7" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faTwitter} className="h-7 w-7" />
            </a>
            <a href="#" aria-label="Linkedin" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faLinkedin} className="h-7 w-7" />
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faYoutube} className="h-7 w-7" />
            </a>
          </div>
        </div>

        {/* Texto derechos reservados */}
        <div className="mt-12 text-center text-sm text-gray-500 flex flex-wrap justify-center gap-6 leading-relaxed">
          <span>© AmityVille Renter. Todos los derechos reservados.</span>
          <Link href="/landing/privacy" className="hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/landing/terms" className="hover:underline">
            Términos de Servicio
          </Link>
          <Link href="/landing/Cookies" className="hover:underline">
            Política de Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
