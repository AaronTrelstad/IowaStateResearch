import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './canvas.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const Canvas = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/standard');
    const [color, setColor] = useState<string>('red');
    const [dataset, setDataset] = useState<string>();
    const [activeTab, setActiveTab] = useState<string>('styles');
    const [numValues, setNumValues] = useState<number>(100);
    const [borders, setBorders] = useState<boolean>(false);

    useEffect(() => {
        if (mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [-92, 42],
                zoom: 5,
                maxZoom: 15,
            });

            map.addControl(new mapboxgl.NavigationControl(), "top-left");

            return () => map.remove();
        }
    }, [mapStyle]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className='mainContainer'>
            <div ref={mapContainer} className='mapContainer' />
            <div className="optionsContainer">
                <div className="tabs">
                    <button className={activeTab === 'styles' ? 'active' : ''} onClick={() => handleTabChange('styles')}>Styles</button>
                    <button className={activeTab === 'datasets' ? 'active' : ''} onClick={() => handleTabChange('datasets')}>Dataset</button>
                    <button className={activeTab === 'query' ? 'active' : ''} onClick={() => handleTabChange('query')}>Query</button>
                    <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => handleTabChange('stats')}>Stats</button>
                </div>
                {activeTab == 'styles' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Map Style</label>
                            <select className='dropDown' id="mapStyle" onChange={(e) => setMapStyle(e.target.value)}>
                                <option value="mapbox://styles/mapbox/standard">Standard</option>
                                <option value="mapbox://styles/mapbox/streets-v12">Streets</option>
                                <option value="mapbox://styles/mapbox/outdoors-v12">Outdoors</option>
                                <option value="mapbox://styles/mapbox/light-v11">Light</option>
                                <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
                                <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
                                <option value="mapbox://styles/mapbox/satellite-streets-v12">Satellite Streets</option>
                                <option value="mapbox://styles/mapbox/navigation-day-v1">Navigation Day</option>
                                <option value="mapbox://styles/mapbox/navigation-night-v1">Navigation Night</option>
                            </select>
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Color</label>
                            <select className='dropDown' id="dataColor">
                                <option value="red">Red</option>
                                <option value="yellow">Yellow</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </select>
                        </div>
                    </>
                )}
                {activeTab == 'datasets' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Dataset</label>
                            <select className='dropDown' id="dataset" onChange={(e) => setDataset(e.target.value)}>
                                <option value={"locations"}>Locations CSV</option>
                                <option value={"weather"}>Weather</option>
                            </select>
                        </div>
                        <div className='buttonContainer'>
                            <form>
                                <input type="file"/>
                            </form>
                        </div>
                        <div className='buttonContainer'>
                            <button className='saveOptionsButton'>Load Datasets</button>
                        </div>
                    </>
                )}
                {activeTab == 'query' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Num Values</label>
                            <input 
                                type='number'
                                className='dropDown'
                                value={numValues} 
                                onChange={(e) => setNumValues(Number(e.target.value))}
                                placeholder="Num Values"
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Borders</label>
                            <input 
                                type='checkbox'
                                className='dropDown' 
                                onChange={(e) => setBorders(Boolean(e.target.value))}
                            />
                        </div>
                        <div className='buttonContainer'>
                            <button className='saveOptionsButton'>Submit</button>
                        </div>
                    </>
                )}
                {activeTab == 'stats' && (
                    <>
                        <div>
                            Display Stats
                        </div>                    
                    </>
                )}
            </div>
        </div>
    )
}

export default Canvas
