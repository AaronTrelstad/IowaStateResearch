import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '../main/main.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const ColorDataMap: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [-80, 40.45],
                zoom: 11,
                maxZoom: 15,
            })

            map.on('load', () => {
                map.addLayer({
                    id: 'heatMapData',
                    type: 'heatmap',
                })

                const places = {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': "Ford's Theater",
                                'icon': 'theatre'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.038659, 38.931567]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': 'The Gaslight',
                                'icon': 'theatre'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.003168, 38.894651]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': "Horrible Harry's",
                                'icon': 'bar'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.090372, 38.881189]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': 'Bike Party',
                                'icon': 'bicycle'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.052477, 38.943951]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': 'Rockabilly Rockstars',
                                'icon': 'music'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.031706, 38.914581]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': 'District Drum Tribe',
                                'icon': 'music'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.020945, 38.878241]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'description': 'Motown Memories',
                                'icon': 'music'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-77.007481, 38.876516]
                            }
                        }
                    ]
                };
        
                //map.rotateTo(180, { duration: 10000 });
            
            })

            map.addControl(new mapboxgl.NavigationControl(), "top-left");

            return () => map.remove();
        }
    }, []);
    return (
        <div className='mainContainer'>
            <div className='subContainer'>
                <div ref={mapContainer} className='subContainer' />
            </div>
            <div className='subContainer'>
                Map showing heatmap using Mapbox Studio Custom Styles.
            </div>
        </div>
    );
}

export default ColorDataMap;
