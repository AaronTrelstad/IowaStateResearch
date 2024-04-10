import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './canvas.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const Canvas = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/standard');
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [color, setColor] = useState<string>("red");
    const [datasetName, setDatasetName] = useState<string>('AirportData');
    const [activeTab, setActiveTab] = useState<string>('styles');
    const [numValues, setNumValues] = useState<number>(100);
    const [borders, setBorders] = useState<boolean>(false);
    const [schema, setSchema] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (mapContainer.current) {
            const newMap = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [-92, 42],
                zoom: 5
            });

            newMap.addControl(new mapboxgl.NavigationControl(), "top-left");

            setMap(newMap);

            return () => {
                newMap.remove();
            };
        }
    }, [mapContainer, mapStyle]);

    const getDataSchema = (data: any): { [key: string]: string } => {
        const schema: { [key: string]: string } = {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const type = typeof data[key].S;

                schema[key] = type;
            }
        }

        return schema;
    };

    const retrieveData = async (datasetName: string) => {
        try {
            const response = await axios.get(`https://krpaslyj9k.execute-api.us-east-2.amazonaws.com/prod/getData?tableName=${datasetName}`);
            const data = response.data;
            addLayers(data);
            
            const schema = getDataSchema(data[0]);
            setSchema(schema);
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    const handleSubmit = () => {
        
    };

    const addLayers = (data: any) => {
        if (map) {
            removeLayers();

            data.forEach((location: any, index: number) => {
                const id = `${index}-circle`;
                const latitude = parseFloat(location.latitude.S);
                const longitude = parseFloat(location.longitude.S);

                map.addLayer({
                    id: id,
                    type: "circle",
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude]
                            },
                            properties: {}
                        }
                    },
                    paint: {
                        'circle-radius': 8,
                        'circle-color': color
                    }
                })
            });
        }
    };

    const removeLayers = () => {
        if (map && map.getStyle()) {
            const mapLayers = map.getStyle().layers;
            if (mapLayers) {
                mapLayers.forEach((layer) => {
                    if (layer.id.includes('-circle') || layer.id.includes('-line') || layer.id.includes('-labels')) {
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
                {activeTab === 'styles' && (
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
                            <select className='dropDown' id="dataColor" onChange={(e) => setColor(e.target.value)}>
                                <option value="red">Red</option>
                                <option value="yellow">Yellow</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </select>
                        </div>
                    </>
                )}
                {activeTab === 'datasets' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Dataset</label>
                            <select className='dropDown' id="dataset" onChange={(e) => setDatasetName(e.target.value)}>
                                <option value={"AirportData"}>Airport Data</option>
                                <option value={"timeSeries"}>Time Series</option>
                            </select>
                        </div>
                        <div className='buttonContainer'>
                            <form>
                                <input type="file" />
                            </form>
                        </div>
                        <div className='buttonContainer'>
                            <button className='saveOptionsButton' onClick={() => retrieveData(datasetName)}>Load Datasets</button>
                        </div>
                        {Object.keys(schema).length > 0 && (
                            <div className="schemaContainer">
                                <h3>Data Schema:</h3>
                                <pre>{JSON.stringify(schema, null, 2)}</pre>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'query' && (
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
                                checked={borders}
                                onChange={(e) => setBorders(e.target.checked)}
                            />
                        </div>
                        <div className='buttonContainer'>
                            <button className='saveOptionsButton' onClick={handleSubmit}>Submit</button>
                        </div>
                    </>
                )}
                {activeTab === 'stats' && (
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

export default Canvas;

