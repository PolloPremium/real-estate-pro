import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ApplicationFormData, applicationSchema } from "@/lib/schemas";
import { useCreateApplicationMutation, useGetAuthUserQuery } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const ApplicationModal = ({
  isOpen,
  onClose,
  propertyId,
}: ApplicationModalProps) => {
  const [createApplication] = useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    // Validar que el usuario está autenticado y es inquilino
    if (!authUser || authUser.userRole !== "tenant") {
      console.error(
        "Debes iniciar sesión como inquilino para enviar una solicitud"
      );
      return;
    }

    // Crear la solicitud de aplicación
    await createApplication({
      ...data,
      applicationDate: new Date().toISOString(),
      status: "Pending",
      propertyId: propertyId,
      tenantCognitoId: authUser.cognitoInfo.userId,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle>Enviar solicitud para esta propiedad</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CustomFormField
              name="name"
              label="Nombre completo"
              type="text"
              placeholder="Ingresa tu nombre completo"
            />
            <CustomFormField
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="Ingresa tu correo electrónico"
            />
            <CustomFormField
              name="phoneNumber"
              label="Número de teléfono"
              type="text"
              placeholder="Ingresa tu número de teléfono"
            />
            <CustomFormField
              name="message"
              label="Mensaje (Opcional)"
              type="textarea"
              placeholder="Ingresa información adicional"
            />
            <Button type="submit" className="bg-primary-700 text-white w-full">
              Enviar solicitud
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
