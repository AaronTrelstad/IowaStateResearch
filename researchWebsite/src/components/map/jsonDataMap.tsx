import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import plantLocations from '../../assets/mapData/plantLocations.json';
import '../main/main.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const JSONDataMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-92, 42],
        zoom: 5,
      });

      map.on('load', () => {
        plantLocations.forEach((plant) => {
          const [lng, lat] = plant.location;
          const markerColor = plant.outage ? 'red' : 'green';
          new mapboxgl.Marker({ color: markerColor })
            .setLngLat([lng, lat])
            .addTo(map)
            .setPopup(new mapboxgl.Popup().setHTML(
              `<h3>${plant.name}</h3>
                <h4>Location: ${plant.location}</h4>
                <h4>Power Level: ${plant.powerLevel}</h4>
                <h4>Outage Status: ${plant.outage}</h4>`
            ));
        });

        plantLocations.forEach((plant) => {
          plant.connections.forEach((connectedPlantName) => {
            const connectedPlant = plantLocations.find((p) => p.name === connectedPlantName);
            if (connectedPlant) {
              const coordinates = [plant.location, connectedPlant.location];
              const lineColor = plant.outage || connectedPlant.outage ? 'red' : 'green';
              map.addLayer({
                id: `${plant.name}-${connectedPlantName}-line`,
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: coordinates,
                    },
                    properties: {}
                  },
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': lineColor,
                  'line-width': 2,
                },
              });
            }
          });
        });
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      return () => map.remove();
    }
  }, []);

  return (
    <div className='mainContainer'>
      
       <div ref={mapContainer} className='subContainer' />
      <div className='subContainer'>
        <table className="displayContainer">
          <thead>
            <tr>
              <th>Name</th>
              <th>Outage</th>
              <th>Power Level</th>
              <th>Connections</th>
            </tr>
          </thead>
          <tbody>
            {plantLocations && plantLocations.map((dataItem: any, index: number) => (
              <tr key={index}>
                <td>{dataItem.name}</td>
                <td>{dataItem.outage ? 'Yes' : 'No'}</td>
                <td>{dataItem.powerLevel}</td>
                <td>{dataItem.connections.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JSONDataMap;


