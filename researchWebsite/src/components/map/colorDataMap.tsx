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
                style: 'mapbox://styles/aarontrelstad/cltxc1nph01bq01pb00366xwt',
                center: [-80, 40.45],
                zoom: 11,
                maxZoom: 15,
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
