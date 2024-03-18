import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '../main/main.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const CSVDataMap: React.FC = () => {
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

            map.on('load', () => {
                map.addLayer({
                    id: 'historical-places',
                    type: 'circle',
                    source: {
                        type: 'vector',
                        url: 'mapbox://aarontrelstad.cltx53cmg32ua1mt15pprk839-5yz1x'
                    },
                    'source-layer': "Airplanes",
                    paint: {
                        'circle-color': 'rgb(255,0,0)'
                    }
                }
                );
            });

            return () => map.remove();
        }
    }, []);

    return <div ref={mapContainer} className='subContainer' />;
};

export default CSVDataMap;
