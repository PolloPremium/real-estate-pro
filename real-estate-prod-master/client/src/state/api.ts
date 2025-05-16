import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import {
  Property,
  Tenant,
  Manager,
  Lease,
  Payment,
  Application,
} from "@/types/prismaTypes";
import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import { FiltersState } from ".";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3002"
        : process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Managers",
    "Tenants",
    "Properties",
    "PropertyDetails",
    "Leases",
    "Payments",
    "Applications",
  ],
  endpoints: (build) => ({
    // 🔐 Authenticated user
    getAuthUser: build.query<any, void>({
      queryFn: async (_, __, ___, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint =
            userRole === "manager"
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;

          let response = await fetchWithBQ(endpoint);

          if (response.error?.status === 404) {
            response = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            );
          }

          return {
            data: {
              cognitoInfo: user,
              userInfo: response.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    // 🏘️ Property
    getProperties: build.query<Property[], Partial<FiltersState> & { favoriteIds?: number[] }>({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Properties" as const, id })).concat({ type: "Properties", id: "LIST" })
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch properties." });
      },
    }),

    getProperty: build.query<Property, number>({
      query: (id) => `properties/${id}`,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load property details." });
      },
    }),

    // 👤 Tenant
    getTenant: build.query<Tenant, string>({
      query: (id) => `tenants/${id}`,
      providesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load tenant profile." });
      },
    }),

    getCurrentResidences: build.query<Property[], string>({
      query: (id) => `tenants/${id}/current-residences`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Properties" as const, id })).concat({ type: "Properties", id: "LIST" })
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch current residences." });
      },
    }),

    updateTenantSettings: build.mutation<Tenant, { cognitoId: string } & Partial<Tenant>>({
      query: ({ cognitoId, ...data }) => ({
        url: `tenants/${cognitoId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    addFavoriteProperty: build.mutation<Tenant, { cognitoId: string; propertyId: number }>({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Added to favorites!",
          error: "Failed to add to favorites",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<Tenant, { cognitoId: string; propertyId: number }>({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Removed from favorites!",
          error: "Failed to remove from favorites",
        });
      },
    }),

    // 👨‍💼 Manager
    getManagerProperties: build.query<Property[], string>({
      query: (id) => `managers/${id}/properties`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Properties" as const, id })).concat({ type: "Properties", id: "LIST" })
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load manager profile." });
      },
    }),

    updateManagerSettings: build.mutation<Manager, { cognitoId: string } & Partial<Manager>>({
      query: ({ cognitoId, ...data }) => ({
        url: `managers/${cognitoId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    createProperty: build.mutation<Property, FormData>({
      query: (data) => ({
        url: `properties`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property created successfully!",
          error: "Failed to create property.",
        });
      },
    }),

    // 📜 Leases
    getLeases: build.query<Lease[], void>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch leases." });
      },
    }),

    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch property leases." });
      },
    }),

    // 💸 Payments
    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch payment info." });
      },
    }),

    // 📝 Applications
    getApplications: build.query<Application[], { userId?: string; userType?: string }>({
      query: ({ userId, userType }) => {
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        if (userType) params.append("userType", userType);
        return `applications?${params.toString()}`;
      },
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch applications." });
      },
    }),

    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({
        url: `applications`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application created successfully!",
          error: "Failed to create application.",
        });
      },
    }),

    updateApplicationStatus: build.mutation<
      Application & { lease?: Lease },
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Applications", "Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application status updated successfully!",
          error: "Failed to update status.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = api;
