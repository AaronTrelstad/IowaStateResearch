import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import dynamicMapData from '../../assets/mapData/dynamicMap.json';
import '../main/main.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const DynamicDataMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const currentIndexRef = useRef<number>(currentIndex)

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const pause = useCallback(() => {
        setPlaying(false);
    }, []);

    const backward = useCallback(() => {
        pause();
        setCurrentIndex(index => {
            const nextIndex = index - 1;
            if (nextIndex < 0) {
                return dynamicMapData.length - 1;
            } else {
                return nextIndex;
            }
        });

    }, []);

    const forward = useCallback(() => {
        pause();
        setCurrentIndex(index => {
            const nextIndex = index + 1;
            if (nextIndex >= dynamicMapData.length - 1) {
                return 0;
            } else {
                return nextIndex;
            }
        });

    }, []);



    const play = useCallback(() => {
        setPlaying(true);
        const intervalId = setInterval(() => {
            setPlaying(playing => {
                if (playing) {
                    setCurrentIndex(index => {
                        const nextIndex = index + 1;
                        if (nextIndex >= dynamicMapData.length) {
                            return 0;
                        } else {
                            return nextIndex;
                        }
                    });
                } else {
                    clearInterval(intervalId);
                }
                return playing;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);



    useEffect(() => {
        if (map && dynamicMapData[currentIndex]) {
            map.on('load', () => {
                addLayers();
            });
            if (map && map.loaded()) {
                addLayers();
            }
        }
    }, [map, currentIndex]);

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

    useEffect(() => {
        const indexDisplay = document.createElement('div');
        indexDisplay.className = 'index-display';
        indexDisplay.style.position = 'absolute';
        indexDisplay.style.top = '10px';
        indexDisplay.style.right = '10px';
        indexDisplay.style.fontSize = '18px';
        indexDisplay.style.backgroundColor = 'white';
        indexDisplay.style.padding = '5px';
        indexDisplay.style.borderRadius = '5px'

        indexDisplay.innerText = `Timestamp: ${currentIndex + 1}/${dynamicMapData.length} `;

        if (mapContainer.current) {
            mapContainer.current.appendChild(indexDisplay);
        }

        return () => {
            if (mapContainer.current && indexDisplay.parentNode === mapContainer.current) {
                mapContainer.current.removeChild(indexDisplay);
            }
        };
    }, [currentIndex, mapContainer]);

    const addLayers = () => {
        if (map) {
            removeLayers();

            const timeData = dynamicMapData[currentIndex];
            timeData.forEach((plant) => {
                const plantLayerId = `${plant.name}-circle-${currentIndex}`;
                const plantColor = plant.outage ? 'red' : 'green';
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
                                connections: plant.connections,
                                outage: plant.outage
                            }
                        }
                    },
                    paint: {
                        'circle-radius': 8,
                        'circle-color': plantColor
                    }
                });

                plant.connections.forEach((connectedPlantName: string) => {
                    const connectedPlant = timeData.find((p: any) => p.name === connectedPlantName);
                    if (connectedPlant) {
                        const lineLayerId = `${plant.name}-${connectedPlantName}-line-${currentIndex}`;
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
                                'line-width': 4,
                            },
                        });
                    }
                });
            });
        }
    };

    const removeLayers = () => {
        if (map && map.getStyle()) {
            const mapLayers = map.getStyle().layers;
            if (mapLayers) {
                mapLayers.forEach((layer) => {
                    if (layer.id.includes('-circle-') || layer.id.includes('-line-')) {
                        if (map.getLayer(layer.id)) {
                            map.removeLayer(layer.id);
                        }

                        if (map.getSource(layer.id)) {
                            map.removeSource(layer.id);
                        }
                    }
                });
            }
        }
    };

    return (
        <>
            <div ref={mapContainer} className='subContainer' />
            <div className='controlContainer'>
                <button className='controlButton' onClick={backward}>Backward</button>
                {isPlaying ? (<button className='controlButton' onClick={pause}>Pause</button>) : (<button className='controlButton' onClick={play}>Play</button>)}
                <button className='controlButton' onClick={forward}>Forward</button>
            </div>
        </>
    );
};

export default DynamicDataMap;
