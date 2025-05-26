"use client";

import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import React from "react";
import { jsPDF } from "jspdf";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery({
    userId: authUser?.cognitoInfo?.userId,
    userType: "tenant",
  });

  // PDF generation handler
  const handleDownloadAgreement = (application: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Acuerdo de Alquiler", 10, 20);
    doc.setFontSize(12);
    doc.text(`Propiedad: ${application.propertyName || "N/A"}`, 10, 35);
    doc.text(`Inquilino: ${application.tenantName || "N/A"}`, 10, 45);
    doc.text(
      `Fecha de inicio: ${
        application.lease?.startDate
          ? new Date(application.lease.startDate).toLocaleDateString()
          : "N/A"
      }`,
      10,
      55
    );
    doc.text(
      `Fecha de fin: ${
        application.lease?.endDate
          ? new Date(application.lease.endDate).toLocaleDateString()
          : "N/A"
      }`,
      10,
      65
    );
    doc.text(
      "Este es un acuerdo de ejemplo. Personalízalo según tus necesidades.",
      10,
      80
    );
    doc.save("acuerdo.pdf");
  };

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error al obtener las aplicaciones</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Solicitudes"
        subtitle="Rastrea y gestiona tus solicitudes de alquiler de propiedades"
      />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            userType="renter"
          >
            <div className="flex justify-between gap-5 w-full pb-4 px-4">
              {application.status === "Approved" ? (
                <div className="bg-green-100 p-4 text-green-700 grow flex items-center">
                  <CircleCheckBig className="w-5 h-5 mr-2" />
                  La propiedad está siendo rentada por ti hasta{" "}
                  {new Date(application.lease?.endDate).toLocaleDateString()}
                </div>
              ) : application.status === "Pending" ? (
                <div className="bg-yellow-100 p-4 text-yellow-700 grow flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Tu solicitud está pendiente de aprobación
                </div>
              ) : (
                <div className="bg-red-100 p-4 text-red-700 grow flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Tu solicitud ha sido rechazada
                </div>
              )}

              <button
                className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                          rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
                onClick={() => handleDownloadAgreement(application)}
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar Acuerdo
              </button>
            </div>
          </ApplicationCard>
        ))}
      </div>
    </div>
  );
};

export default Applications;
