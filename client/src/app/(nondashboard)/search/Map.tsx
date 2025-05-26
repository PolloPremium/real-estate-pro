"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

// Helper to validate coordinates
function isValidLngLat(lng: any, lat: any) {
  return (
    typeof lng === "number" &&
    typeof lat === "number" &&
    lng >= -180 && lng <= 180 &&
    lat >= -90 && lat <= 90
  );
}

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    // Find a valid center
    let center = filters.coordinates;
    if (
      !center ||
      !Array.isArray(center) ||
      !isValidLngLat(center[0], center[1])
    ) {
      // Try to use the first valid property as center
      const firstValid = properties.find(
        (p) =>
          p.location &&
          p.location.coordinates &&
          isValidLngLat(
            p.location.coordinates.longitude,
            p.location.coordinates.latitude
          )
      );
      center = firstValid
        ? [
            firstValid.location.coordinates.longitude,
            firstValid.location.coordinates.latitude,
          ]
        : [-74.5, 40]; // fallback default
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/gabriel324235542/cmapru5sf01dg01sp49gg6zu6",
      center,
      zoom: 9,
    });

    map.on("load", () => {
      properties.forEach((property) => {
        const coords = property.location?.coordinates;
        if (
          coords &&
          isValidLngLat(coords.longitude, coords.latitude)
        ) {
          const marker = createPropertyMarker(property, map);
          if (marker) {
            const markerElement = marker.getElement();
            const path = markerElement.querySelector("path[fill='#3FB1CE']");
            if (path) path.setAttribute("fill", "#000000");
          }
        }
      });

      setTimeout(() => {
        map.resize();
      }, 700);
    });

    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const coords = property.location?.coordinates;
  if (!coords || !isValidLngLat(coords.longitude, coords.latitude)) return null;

  const marker = new mapboxgl.Marker()
    .setLngLat([coords.longitude, coords.latitude])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};

export default Map;