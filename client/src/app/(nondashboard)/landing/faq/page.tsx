export default function FAQPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">¿Cómo puedo buscar una propiedad para alquilar?</h2>
        <p className="text-lg leading-relaxed">
          Puedes utilizar nuestro buscador avanzado para filtrar propiedades según ubicación, precio, tipo de vivienda y más. Así podrás encontrar opciones que se adapten a tus necesidades.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">¿Qué documentos necesito para aplicar como inquilino?</h2>
        <p className="text-lg leading-relaxed">
          Normalmente solicitamos identificación oficial, comprobante de ingresos y referencias personales. Cada propiedad puede tener requisitos adicionales, los cuales estarán indicados en el anuncio correspondiente.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">¿Cómo funciona el proceso de solicitud?</h2>
        <p className="text-lg leading-relaxed">
          Una vez que encuentres la propiedad de tu interés, puedes enviar una solicitud a través de nuestra plataforma. El propietario revisará tu aplicación y se pondrá en contacto contigo para los siguientes pasos.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">¿Qué pasa si necesito ayuda durante el proceso?</h2>
        <p className="text-lg leading-relaxed">
          Nuestro equipo de soporte está disponible para asistirte en cada etapa. Puedes contactarnos vía correo o teléfono y te brindaremos la ayuda que necesites.
        </p>
      </section>
    </main>
  );
}
