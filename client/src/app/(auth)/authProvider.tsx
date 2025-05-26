"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";

// Configuración de Amplify con datos desde variables de entorno
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

// Componentes personalizados para el Authenticator
const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className="!text-2xl !font-bold">
         AMITYVILLE RENTER
          <span className="text-secondary-500 font-light hover:!text-primary-300">
            IFUL
          </span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">¡Bienvenido!</span> Por favor, inicia sesión para continuar
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button
              onClick={toSignUp}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Regístrate aquí
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Rol"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value="tenant">Inquilino</Radio>
            <Radio value="manager">Administrador</Radio>
          </RadioGroupField>
        </>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Inicia sesión
            </button>
          </p>
        </View>
      );
    },
  },
};

// Campos del formulario personalizados con placeholders y etiquetas en español
const formFields = {
  signIn: {
    username: {
      placeholder: "Ingresa tu correo electrónico",
      label: "Correo electrónico",
      isRequired: true,
    },
    password: {
      placeholder: "Ingresa tu contraseña",
      label: "Contraseña",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Elige un nombre de usuario",
      label: "Nombre de usuario",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Ingresa tu correo electrónico",
      label: "Correo electrónico",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Crea una contraseña",
      label: "Contraseña",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirma tu contraseña",
      label: "Confirmar contraseña",
      isRequired: true,
    },
  },
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  // Definir si la ruta actual es una página de autenticación
  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  // Definir si la ruta actual es dashboard para manager o tenant
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  // Redireccionar usuarios autenticados fuera de las páginas de login/signup
  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  // Permitir acceso a páginas públicas sin autenticación
  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={formFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
