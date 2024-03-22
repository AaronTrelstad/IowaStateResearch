import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import dynamicMapData from '../../assets/mapData/dynamicMap.json';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const DynamicDataMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-92, 42],
                zoom: 5
            });

            map.on('load', () => {
                let index = 0;

                const iteratePlantData = () => {
                    const timeData = dynamicMapData[index];

                    timeData.forEach((plant) => {
                        const plantLayer = `${plant.name}-circle-${index}`;
                        if (!map.getLayer(plantLayer)) {
                            const plantColor = plant.outage ? 'red' : 'green';
                            map.addLayer({
                                id: plantLayer,
                                type: 'circle',
                                source: {
                                    type: 'geojson',
                                    data: {
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: plant.location
                                        },
                                        properties: {
                                            name: plant.name,
                                            connections: plant.connections,
                                            outage: plant.outage
                                        }
                                    }
                                },
                                paint: {
                                    'circle-radius': 6,
                                    'circle-color': plantColor
                                }
                            });
                        }

                        plant.connections.forEach((connectedPlantName) => {
                            const connectedPlant = timeData.find((p) => p.name === connectedPlantName);
                            if (connectedPlant) {
                                const lineLayerId = `${plant.name}-${connectedPlantName}-line-${index}`;
                                if (!map.getLayer(lineLayerId)) {
                                    const lineColor = plant.outage || connectedPlant.outage ? 'yellow' : 'green';
                                    const coordinates = [plant.location, connectedPlant.location];
                                    map.addLayer({
                                        id: lineLayerId,
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
                            }
                        });
                    });

                    index++;

                    if (index == dynamicMapData.length) {
                        index = 0;
                    }

                    if (index < dynamicMapData.length) {
                        setTimeout(iteratePlantData, 1000);
                    }
                };

                iteratePlantData();
            });

            return () => map.remove();
        }
    }, []);

    return <div ref={mapContainer} className='subContainer' />;
};

export default DynamicDataMap;
