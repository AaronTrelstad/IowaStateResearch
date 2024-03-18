import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import '../main/main.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const DefaultMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-92, 42],
        zoom: 5,
        maxZoom: 15,
      });

      map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
      return () => map.remove();
    }
  }, []);

  return (
    <div ref={mapContainer} className='subContainer'/>
  );
};

export default DefaultMap;

