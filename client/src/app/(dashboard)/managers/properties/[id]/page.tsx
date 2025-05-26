"use client";

import React from "react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
  useGetPropertyQuery,
} from "@/state/api";
import { ArrowDownToLine, ArrowLeft, Check, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";

const InquilinosPropiedad = () => {
  // Obtener el parámetro 'id' de la URL y convertirlo a número
  const { id } = useParams();
  const propertyId = Number(id);

  // Consultar información de la propiedad
  const { data: propiedad, isLoading: propiedadCargando } =
    useGetPropertyQuery(propertyId);

  // Consultar contratos de arrendamiento (leases) de la propiedad
  const { data: arrendamientos, isLoading: arrendamientosCargando } =
    useGetPropertyLeasesQuery(propertyId);

  // Consultar pagos asociados a la propiedad
  const { data: pagos, isLoading: pagosCargando } =
    useGetPaymentsQuery(propertyId);

  // Mostrar pantalla de carga mientras alguna consulta está en proceso
  if (propiedadCargando || arrendamientosCargando || pagosCargando)
    return <Loading />;

  // Obtener el estado del pago del mes actual para un contrato de arrendamiento
  const obtenerEstadoPagoMesActual = (leaseId: number) => {
    const fechaActual = new Date();
    const pagoMesActual = pagos?.find(
      (pago) =>
        pago.leaseId === leaseId &&
        new Date(pago.dueDate).getMonth() === fechaActual.getMonth() &&
        new Date(pago.dueDate).getFullYear() === fechaActual.getFullYear()
    );
    // Si no se encuentra pago, devolver "No Pagado"
    return pagoMesActual?.paymentStatus || "No Pagado";
  };

  // Función para generar el contenido de un contrato en el PDF, para reutilizar
  const agregarContratoAPDF = (
    doc: jsPDF,
    arrendamiento: {
      tenant: { name: any; email: any; phoneNumber: any };
      startDate: string | number | Date;
      endDate: string | number | Date;
      rent: number;
      id: number;
    },
    posicionY: number
  ) => {
    doc.setFontSize(18);
    doc.text("Contrato de Arrendamiento", 20, posicionY);

    doc.setFontSize(12);
    doc.text(
      `Inquilino: ${arrendamiento.tenant?.name || "N/A"}`,
      20,
      posicionY + 20
    );
    doc.text(
      `Correo: ${arrendamiento.tenant?.email || "N/A"}`,
      20,
      posicionY + 30
    );
    doc.text(
      `Teléfono: ${arrendamiento.tenant?.phoneNumber || "N/A"}`,
      20,
      posicionY + 40
    );
    doc.text(
      `Periodo de Arrendamiento: ${new Date(
        arrendamiento.startDate
      ).toLocaleDateString()} - ${new Date(arrendamiento.endDate).toLocaleDateString()}`,
      20,
      posicionY + 50
    );
    doc.text(`Renta Mensual: $${arrendamiento.rent.toFixed(2)}`, 20, posicionY + 60);

    const estadoPago = obtenerEstadoPagoMesActual(arrendamiento.id);
    doc.text(`Estado Pago Mes Actual: ${estadoPago}`, 20, posicionY + 70);

    doc.text(
      "Términos del Contrato:\n1. La renta debe pagarse puntualmente.\n2. El inquilino se compromete a mantener la propiedad.\n3. No se permite subarrendar sin autorización.",
      20,
      posicionY + 90
    );
  };

  // Función para descargar todos los contratos en un único PDF
  const descargarTodosContratosPDF = () => {
    if (!arrendamientos || arrendamientos.length === 0) return;

    const doc = new jsPDF();
    let posicionY = 20;

    arrendamientos.forEach((arrendamiento, index) => {
      if (
        !arrendamiento.tenant ||
        !arrendamiento.startDate ||
        !arrendamiento.endDate ||
        arrendamiento.rent === undefined
      ) {
        // Si datos incompletos, saltar este arrendamiento
        return;
      }

      if (index > 0) {
        doc.addPage();
        posicionY = 20;
      }
      agregarContratoAPDF(
        doc,
        {
          id: arrendamiento.id,
          tenant: arrendamiento.tenant,
          startDate: arrendamiento.startDate,
          endDate: arrendamiento.endDate,
          rent: arrendamiento.rent,
        },
        posicionY
      );
    });

    doc.save("Contratos_Arrendamiento_Todos.pdf");
  };

  // Función para descargar el PDF de un solo contrato con validación
  const descargarContratoPDF = (arrendamiento: {
    id: any;
    tenant?: { name: any; email: any; phoneNumber: any };
    startDate?: string | number | Date;
    endDate?: string | number | Date;
    rent?: number;
  }) => {
    if (
      !arrendamiento.tenant ||
      !arrendamiento.startDate ||
      !arrendamiento.endDate ||
      arrendamiento.rent === undefined
    ) {
      alert("Datos incompletos del arrendamiento, no se puede generar el contrato PDF.");
      return;
    }

    const doc = new jsPDF();

    // Preparar objeto completo para que coincida con la firma de la función
    const contratoCompleto = {
      id: arrendamiento.id,
      tenant: arrendamiento.tenant,
      startDate: arrendamiento.startDate,
      endDate: arrendamiento.endDate,
      rent: arrendamiento.rent,
    };

    agregarContratoAPDF(doc, contratoCompleto, 20);
    doc.save(`Contrato_Arrendamiento_${arrendamiento.id}.pdf`);
  };

  return (
    <div className="dashboard-container">
      {/* Enlace para regresar a la lista de propiedades */}
      <Link
        href="/managers/properties"
        className="flex items-center mb-4 hover:text-primary-500"
        scroll={false}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Volver a Propiedades</span>
      </Link>

      {/* Encabezado con el nombre de la propiedad */}
      <Header
        title={propiedad?.name || "Mi Propiedad"}
        subtitle="Gestiona inquilinos y arrendamientos de esta propiedad"
      />

      <div className="w-full space-y-6">
        {/* Sección resumen de inquilinos */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Resumen de Inquilinos</h2>
              <p className="text-sm text-gray-500">
                Gestiona y visualiza todos los inquilinos de esta propiedad.
              </p>
            </div>
            <div>
              {/* Botón para descargar todos los contratos en un PDF */}
             
            </div>
          </div>

          <hr className="mt-4 mb-1" />

          {/* Tabla con la información de los inquilinos */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Periodo de Arrendamiento</TableHead>
                  <TableHead>Renta Mensual</TableHead>
                  <TableHead>Estado Mes Actual</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arrendamientos?.map((arrendamiento) => (
                  <TableRow key={arrendamiento.id} className="h-24">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/landing-i1.png"
                          alt={arrendamiento.tenant?.name || "Sin nombre"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-semibold">
                            {arrendamiento.tenant?.name || "Sin nombre"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {arrendamiento.tenant?.email || "Sin correo"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{new Date(arrendamiento.startDate).toLocaleDateString()} -</div>
                      <div>{new Date(arrendamiento.endDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      ${arrendamiento.rent !== undefined ? arrendamiento.rent.toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          obtenerEstadoPagoMesActual(arrendamiento.id) === "Paid"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}
                      >
                        {obtenerEstadoPagoMesActual(arrendamiento.id) === "Paid" && (
                          <Check className="w-4 h-4 inline-block mr-1" />
                        )}
                        {obtenerEstadoPagoMesActual(arrendamiento.id) === "Paid"
                          ? "Pagado"
                          : "No Pagado"}
                      </span>
                    </TableCell>
                    <TableCell>{arrendamiento.tenant?.phoneNumber || "Sin teléfono"}</TableCell>
                    <TableCell>
                      {/* Botón para descargar el contrato individual */}
                      <button
                        className={`border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex 
                      items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50`}
                        onClick={() => descargarContratoPDF(arrendamiento)}
                      >
                        <ArrowDownToLine className="w-5 h-5 mr-2" />
                        Descargar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquilinosPropiedad;

