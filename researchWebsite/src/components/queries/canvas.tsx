import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Position } from 'geojson';
import axios from 'axios';
import './canvas.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb250cmVsc3RhZCIsImEiOiJjbHRyaW16YnkwN3dmMmxwaWwyODljZnFmIn0.nzXluM3BCOrEu5_Xx-2deA';

const Canvas = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/standard');
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [color, setColor] = useState<string>("red");
    const [datasetName, setDatasetName] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('datasets');
    const [maxValues, setMaxValues] = useState<number>();
    const [addBorder, setAddBorder] = useState<boolean>(false);
    const [schema, setSchema] = useState<{ [key: string]: string }>({});
    const [numValues, setNumValues] = useState<number>(0);
    const [dataRadius, setDataRadius] = useState<number>();
    const [lineColor, setLineColor] = useState<string>("black")
    const [addDensityBorder, setAddDensityBorder] = useState<boolean>(false);
    const [startingLat, setStartingLat] = useState<number>(42);
    const [startingLong, setStartingLong] = useState<number>(-92);
    const [startingZoom, setStartingZoom] = useState<number>(5);

    let densityExtension: number;

    useEffect(() => {
        if (mapContainer.current) {
            const newMap = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [startingLong, startingLat],
                zoom: startingZoom
            });

            newMap.addControl(new mapboxgl.NavigationControl(), "top-left");

            setMap(newMap);

            return () => {
                newMap.remove();
            };
        }
    }, [mapContainer, mapStyle, startingLat, startingLong]);

    useEffect(() => {
        if (datasetName != '') {
            retrieveData(datasetName);
        }
    }, [color, lineColor, addBorder, addDensityBorder, map])

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

    const addLayers = (data: any) => {
        if (map) {
            removeLayers();

            let count = 0

            let maxLat = -200;
            let maxLong = -200;
            let minLat = 200;
            let minLong = 200;
            let borders: Position[] = [];
            let denseBorders: Position[] = [];
            const extendPercentage = 0.005;

            // In radius bounds
            

            data.forEach((location: any, index: number) => {
                const id = `${index}-circle`;
                const latitude = parseFloat(location.latitude.S);
                const longitude = parseFloat(location.longitude.S);

                if (latitude > maxLat) {
                    maxLat = latitude;
                } else if (latitude < minLat) {
                    minLat = latitude;
                }

                if (longitude > maxLong) {
                    maxLong = longitude;
                } else if (longitude < minLong) {
                    minLong = longitude;
                }

                if (-180 < longitude && 180 > longitude && -180 < latitude && 180 > latitude) {
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
                }

                count++;
            });

            densityExtension = (maxLat - minLat) * 0.003;

            borders.push([maxLong - (maxLong * extendPercentage), maxLat + (maxLat * extendPercentage)]);
            borders.push([maxLong - (maxLong * extendPercentage), minLat - (minLat * extendPercentage)]);
            borders.push([minLong + (minLong * extendPercentage), minLat - (minLat * extendPercentage)]);
            borders.push([minLong + (minLong * extendPercentage), maxLat + (maxLat * extendPercentage)]);
            borders.push([maxLong - (maxLong * extendPercentage), maxLat + (maxLat * extendPercentage)]);

            if (addBorder) {
                map.addLayer({
                    id: `Borders-${count}-lines`,
                    type: "line",
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: borders
                            },
                            properties: {}
                        }
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': lineColor,
                        'line-width': 2,
                    },
                })
            }

            if (addDensityBorder) {
                denseBorders = calculateDenseArea(data);

                map.addLayer({
                    id: `Density-${count}-lines`,
                    type: "line",
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: denseBorders
                            },
                            properties: {}
                        }
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': lineColor,
                        'line-width': 2,
                    },
                })
            }

            setNumValues(count);
        }
    };

    const calculateDenseArea = (data: any) => {
        let dense: Position = [];
        let dataRectangles: Position[] = [];
        let result: Position[] = [];

        data.forEach((location: any) => {
            const latitude = parseFloat(location.latitude.S);
            const longitude = parseFloat(location.longitude.S);

            dataRectangles.push([
                longitude + (longitude * densityExtension),
                longitude - (longitude * densityExtension),
                latitude + (latitude * densityExtension),
                latitude - (latitude * densityExtension)
            ])
        });

        let maxMatches = 0;
        dataRectangles.forEach((box) => {
            let matches = 0;
            dataRectangles.forEach((compareBox) => {
                if (
                    (compareBox[0] > box[0] && compareBox[0] < box[1]) ||
                    (compareBox[1] > box[0] && compareBox[1] < box[1]) ||
                    (compareBox[2] < box[3] && compareBox[2] > box[2]) ||
                    (compareBox[3] < box[2] && compareBox[0] > box[3])
                ) {
                    matches++;
                }
            })

            if(matches > maxMatches) {
                maxMatches = matches;
                dense = box
            }
        })

        result.push([dense[0], dense[2]]);
        result.push([dense[0], dense[3]]);
        result.push([dense[1], dense[3]]);
        result.push([dense[1], dense[2]]);
        result.push([dense[0], dense[2]]);

        return result;
    }

    const removeLayers = () => {
        if (map && map.getStyle()) {
            const mapLayers = map.getStyle().layers;
            if (mapLayers) {
                mapLayers.forEach((layer) => {
                    if (layer.id.includes('-circle') || layer.id.includes('-lines') || layer.id.includes('-labels')) {
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
                    <button className={activeTab === 'datasets' ? 'active' : ''} onClick={() => handleTabChange('datasets')}>Dataset</button>
                    <button className={activeTab === 'styles' ? 'active' : ''} onClick={() => handleTabChange('styles')}>Styles</button>
                    <button className={activeTab === 'query' ? 'active' : ''} onClick={() => handleTabChange('query')}>Query</button>
                    <button className={activeTab === 'info' ? 'active' : ''} onClick={() => handleTabChange('info')}>Info</button>
                </div>
                {activeTab === 'datasets' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Dataset</label>
                            <select className='dropDown' id="dataset" onChange={(e) => setDatasetName(e.target.value)}>
                                <option>---Datasets---</option>
                                <option value={"AirportData"}>Airport Data</option>
                                <option value={"timeSeries"}>Time Series</option>
                                <option value={"QueryPoints"}>Query Points</option>
                            </select>
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
                {activeTab === 'styles' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Map Style</label>
                            <select className='dropDown' id="mapStyle" onChange={(e) => setMapStyle(e.target.value)}>
                                <option>-------Styles-------</option>
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
                                <option>--Colors--</option>
                                <option value="red">Red</option>
                                <option value="yellow">Yellow</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                            </select>
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Line Color</label>
                            <select className='dropDown' id="dataColor" onChange={(e) => setLineColor(e.target.value)}>
                                <option>--Colors--</option>
                                <option value="black">Black</option>
                                <option value="white">White</option>
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="yellow">Yellow</option>
                            </select>
                        </div>
                    </>
                )}
                {activeTab === 'query' && (
                    <>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Borders</label>
                            <input
                                type='checkbox'
                                className='dropDown'
                                checked={addBorder}
                                onChange={(e) => setAddBorder(e.target.checked)}
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Mark Dense Areas</label>
                            <input
                                type='checkbox'
                                className='dropDown'
                                checked={addDensityBorder}
                                onChange={(e) => setAddDensityBorder(e.target.checked)}
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Set Starting Longitude</label>
                            <input
                                type='number'
                                className='dropDown'
                                value={startingLong}
                                onChange={(e) => setStartingLong(Number(e.target.value))}
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Set Starting Latitude</label>
                            <input
                                type='number'
                                className='dropDown'
                                value={startingLat}
                                onChange={(e) => setStartingLat(Number(e.target.value))}
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Zoom</label>
                            <input
                                type='number'
                                className='dropDown'
                                value={startingZoom}
                                onChange={(e) => setStartingZoom(Number(e.target.value))}
                                placeholder='5'
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Set Data Radius (mi)</label>
                            <input
                                type='number'
                                className='dropDown'
                                value={dataRadius}
                                onChange={(e) => setDataRadius(Number(e.target.value))}
                                placeholder='Data Radius'
                            />
                        </div>
                        <div className='dropDownContainer'>
                            <label className='dropDownTitle'>Max Values Displayed</label>
                            <input
                                type='number'
                                className='dropDown'
                                value={maxValues}
                                onChange={(e) => setMaxValues(Number(e.target.value))}
                                placeholder="Num Values"
                            />
                        </div>
                    </>
                )}
                {activeTab === 'info' && (
                    <>
                        <div className='infoContainer'>
                            <h3>Total Values: {numValues}</h3>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Canvas;

