"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: "",
      highlights: "",
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("No manager ID found");
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    formData.append("managerCognitoId", authUser.cognitoInfo.userId);

    await createProperty(formData);
  };

  return (
    <div className="dashboard-container">
      <Header
        // Título de la página
        title="Agregar Nueva Propiedad"
        // Subtítulo explicativo
        subtitle="Crea una nueva propiedad con información detallada"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Información básica */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Nombre de la Propiedad" />
                <CustomFormField
                  name="description"
                  label="Descripción"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Tarifas */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Tarifas</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Precio por Mes"
                type="number"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="securityDeposit"
                  label="Depósito de Seguridad"
                  type="number"
                />
                <CustomFormField
                  name="applicationFee"
                  label="Cuota de Aplicación"
                  type="number"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Detalles de la propiedad */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Detalles de la Propiedad</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="beds"
                  label="Número de Habitaciones"
                  type="number"
                />
                <CustomFormField
                  name="baths"
                  label="Número de Baños"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Metros Cuadrados"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="isPetsAllowed"
                  label="Se Permiten Mascotas"
                  type="switch"
                />
                <CustomFormField
                  name="isParkingIncluded"
                  label="Estacionamiento Incluido"
                  type="switch"
                />
              </div>
              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Tipo de Propiedad"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Comodidades y destacados */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Comodidades y Destacados
              </h2>
              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Comodidades"
                  type="select"
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity,
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Destacados"
                  type="select"
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fotos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Fotos</h2>
              <CustomFormField
                name="photoUrls"
                label="Fotos de la Propiedad"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Información adicional */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Información Adicional
              </h2>
              <CustomFormField name="address" label="Dirección" />
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="Ciudad" className="w-full" />
                <CustomFormField
                  name="state"
                  label="Estado/Provincia"
                  className="w-full"
                />
                <CustomFormField
                  name="postalCode"
                  label="Código Postal"
                  className="w-full"
                />
              </div>
              <CustomFormField name="country" label="País" />
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
            >
              Crear Propiedad
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
