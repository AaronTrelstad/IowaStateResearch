import React, { useRef, useEffect, useState } from 'react';
import { Feature, Geometry, GeoJsonProperties, Position } from 'geojson';
import mapboxgl from 'mapbox-gl';
import heatMapData from '../../assets/mapData/heatmap.json'
import Chart from 'chart.js/auto';
import '../main/main.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

interface OutageData {
    plantName: string;
    numOutages: number;
}

const ColorDataMap: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    var results: OutageData[] = [];

    useEffect(() => {
        if (map && heatMapData) {
            map.on('load', () => {
                addLayers();
            });
            if (map && map.loaded()) {
                addLayers();
            }
        }
    }, [map]);

    useEffect(() => {
        if (mapContainer.current && !map) {
            const newMap = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [-92, 42],
                zoom: 5
            });

            newMap.addControl(new mapboxgl.NavigationControl(), "top-left");

            setMap(newMap);

            return () => {
                newMap.remove();
            };
        }
    }, [mapContainer]);

    const addLayers = () => {
        if (map) {
            const plants = heatMapData.plants;
            const homes = heatMapData.homes;

            const geoJsonFeatures: Feature<Geometry, GeoJsonProperties>[] = homes.features.map((home) => ({
                type: "Feature",
                properties: {
                    name: home.properties.name,
                    powerProvider: home.properties.powerProvider
                },
                geometry: {
                    type: "Point",
                    coordinates: home.geometry.coordinates
                }
            }));

            map.addSource('heatMapData', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: geoJsonFeatures
                }
            });

            plants.forEach((plant) => {
                const plantLayerId = `${plant.name}-circle`;
                const labelLayerId = `${plant.name}-labels`;
                const plantColor = plant.outage ? 'red' : 'green';
                let borders: Position[] = [];
                let numHouses = 0;

                let maxX = plant.location[0];
                let minX = plant.location[0];
                let maxY = plant.location[1];
                let minY = plant.location[1];

                homes.features.forEach((home) => {
                    if (home.properties.powerProvider == plant.name) {
                        const homeCoordinates = home.geometry.coordinates;

                        if (homeCoordinates[0] > maxX) {
                            maxX = homeCoordinates[0];
                        } else if (homeCoordinates[0] < minX) {
                            minX = homeCoordinates[0]
                        }

                        if (homeCoordinates[1] > maxY) {
                            maxY = homeCoordinates[1];
                        } else if (homeCoordinates[1] < minY) {
                            minY = homeCoordinates[1]
                        }

                        numHouses++;
                    }
                })

                const extendPercentage = 0.005
                
                borders.push([maxX - (maxX * extendPercentage), maxY + (maxY * extendPercentage)]);
                borders.push([maxX - (maxX * extendPercentage), minY - (minY * extendPercentage)]);
                borders.push([minX + (minX * extendPercentage), minY - (minY * extendPercentage)]);
                borders.push([minX + (minX * extendPercentage), maxY + (maxY * extendPercentage)]);
                borders.push([maxX - (maxX * extendPercentage), maxY + (maxY * extendPercentage)]);
                

                if (plant.outage) {
                    const outages = geoJsonFeatures.length;
                    results.push({ plantName: plant.name, numOutages: outages })
                } else {
                    results.push({ plantName: plant.name, numOutages: 0 })
                }

                

                map.addLayer({
                    id: plantLayerId,
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
                                outage: plant.outage
                            }
                        }
                    },
                    paint: {
                        'circle-radius': 8,
                        'circle-color': plantColor
                    }
                });

                map.addLayer({
                    id: `plantBorders-${plant.name}`,
                    type: "line",
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: plant.outage ? borders as Position[] : [[0, 0]]
                            },
                            properties: {}
                        }
                    },
                    paint: {
                        "line-color": plantColor
                    }
                })
                // Querying 
                map.addLayer({
                    id: labelLayerId,
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: plant.outage ? borders[1] as Position : plant.location
                            },
                            properties: {},
                        },
                    },
                    layout: {
                        'text-field': plant.name,
                        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                        'text-radial-offset': 0.5,
                        'text-justify': 'auto',
                        'text-allow-overlap': true
                    },
                    paint: {
                        "text-opacity": 1
                    },
                });
            });

            map.addLayer({
                id: `${homes.type}`,
                type: 'heatmap',
                source: "heatMapData",
                paint: {
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3
                    ],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)'

                    ],
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20
                    ],
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        9,
                        0
                    ]
                },
            })
        }
    }

    const OutageBarChart = () => {
        const chartRef = useRef<HTMLCanvasElement>(null);
        const chartInstance = useRef<Chart | null>(null);

        var data: OutageData[] = [];
        heatMapData.plants.forEach((plant) => {
            if (plant.outage) {
                const outages = heatMapData.homes.features.length;
                data.push({ plantName: plant.name, numOutages: outages })
            } else {
                data.push({ plantName: plant.name, numOutages: 0 })
            }
        })

        useEffect(() => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            if (chartRef.current && data.length > 0) {
                const ctx = chartRef.current.getContext('2d');
                if (ctx) {
                    chartInstance.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.map((plant) => `${plant.plantName}`),
                            datasets: [{
                                label: 'Outages',
                                data: data.map((plant) => plant.numOutages),
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 1
                            }]
                        }
                    });
                }
            }

            return () => {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
            };
        }, [data]);

        return <canvas ref={chartRef} />;
    };

    return (
        <div className='mainContainer'>
            
            <div ref={mapContainer} className='subContainer' />
            
            <div className='subContainer'>
                <OutageBarChart />
            </div>
        </div>
    );
};

export default ColorDataMap;
