"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ApplicationCard from "@/components/ApplicationCard";
import Loading from "@/components/Loading";
import { File, CircleCheckBig, Hospital, Download } from "lucide-react";
import { jsPDF } from "jspdf";

const Applications = () => {
  // Obtener datos del usuario autenticado
  const { data: authUser } = useGetAuthUserQuery();

  // Hook para actualizar el estado de una aplicación (mutación)
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  // Estado para manejar la pestaña activa (todas, pendiente, aprobada, denegada)
  const [activeTab, setActiveTab] = useState("all");

  // Obtener todas las aplicaciones del usuario autenticado
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo?.userId,
      userType: "manager",
    },
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );

  // Filtrar las aplicaciones según la pestaña activa
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    return activeTab === "all"
      ? applications
      : applications.filter(
          (app) => app.status.toLowerCase() === activeTab
        );
  }, [applications, activeTab]);

  // Función para cambiar el estado de una aplicación
  const handleStatusChange = async (id: number, status: string) => {
    await updateApplicationStatus({ id, status });
  };

  // Función para descargar el acuerdo en PDF
  const handleDownloadAgreement = (application: { user: { fullName: any }; property: { name: any }; status: any; id: any }) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Acuerdo de Alquiler de Propiedad", 20, 20);

    doc.setFontSize(12);
    doc.text(`Solicitante: ${application.user?.fullName || "N/D"}`, 20, 40);
    doc.text(`Propiedad: ${application.property?.name || "N/D"}`, 20, 50);
    doc.text(`Estado: ${application.status}`, 20, 60);
    doc.text("Contenido del acuerdo aquí...", 20, 80);

    doc.save(`Acuerdo_${application.id}.pdf`);
  };

  if (isLoading) return <Loading />;

  if (isError || !applications)
    return <div className="text-red-600">Error al obtener las solicitudes</div>;

  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <Header
        title="Solicitudes"
        subtitle="Consulta y gestiona las solicitudes de tus propiedades"
      />

      {/* Pestañas de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="my-5 w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="denied">Denegadas</TabsTrigger>
        </TabsList>

        {/* Contenido por pestaña */}
        {["all", "pending", "approved", "denied"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-5 w-full">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                userType="manager"
              >
                <div className="flex justify-between gap-5 w-full pb-4 px-4">
                  {/* Información de estado */}
                  <div
                    className={`p-4 grow text-green-700 ${
                      application.status === "Approved"
                        ? "bg-green-100"
                        : application.status === "Denied"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center">
                      <File className="w-5 h-5 mr-2" />
                      <span className="mr-2">
                        Solicitud enviada el{" "}
                        {new Date(application.applicationDate).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        .
                      </span>
                      <CircleCheckBig className="w-5 h-5 mr-2" />
                      <span
                        className={`font-semibold ${
                          application.status === "Approved"
                            ? "text-green-800"
                            : application.status === "Denied"
                            ? "text-red-800"
                            : "text-yellow-800"
                        }`}
                      >
                        {application.status === "Approved" &&
                          "Esta solicitud ha sido aprobada."}
                        {application.status === "Denied" &&
                          "Esta solicitud ha sido denegada."}
                        {application.status === "Pending" &&
                          "Esta solicitud está pendiente de revisión."}
                      </span>
                    </div>
                  </div>

                  {/* Acciones de la solicitud */}
                  <div className="flex gap-2 items-center">
                    <Link
                      href={`/managers/properties/${application.property.id}`}
                      className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center hover:bg-primary-700 hover:text-primary-50"
                      scroll={false}
                    >
                      <Hospital className="w-5 h-5 mr-2" />
                      Ver Propiedad
                    </Link>

                    {application.status === "Approved" && (
                      <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center hover:bg-primary-700 hover:text-primary-50"
                        onClick={() => handleDownloadAgreement(application)}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Descargar Acuerdo
                      </button>
                    )}

                    {application.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(application.id, "Approved")}
                          className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-500"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleStatusChange(application.id, "Denied")}
                          className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                        >
                          Rechazar
                        </button>
                      </>
                    )}

                    {application.status === "Denied" && (
                      <button className="bg-gray-800 text-white py-2 px-4 rounded-md flex items-center hover:bg-secondary-500 hover:text-primary-50">
                        Contactar Usuario
                      </button>
                    )}
                  </div>
                </div>
              </ApplicationCard>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Applications;
