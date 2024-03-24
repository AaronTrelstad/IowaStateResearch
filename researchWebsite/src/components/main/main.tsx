import Header from '../header/header'
import Footer from '../footer/footer'
import DefaultMap from '../map/defaultMap'
import JSONDataMap from '../map/jsonDataMap'
import CSVDataMap from '../map/csvDataMap'
import ColorDataMap from '../map/colorDataMap'
import DynamicDataMap from '../map/dynamicDataMap'

export default function Main() {
    return (
        <>
            <Header/>
            <h1 className='mainPageHeader'>Current Projects</h1>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <DynamicDataMap />
                </div>
                <div className='subContainer'>
                    Dynamic Map.
                </div>
            </div>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <JSONDataMap />
                </div>
                <div className='subContainer'>
                    Connecting loaction markers with lines and changing color based on loaction properties. 
                    This uses data from a JSON format file.
                </div>
            </div>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <CSVDataMap />
                </div>
                <div className='subContainer'>
                    Map of Airports using CSV data, displayed with Mapbox Studio Tileset.
                </div>
            </div>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <ColorDataMap />
                </div>
                <div className='subContainer'>
                    Map showing heatmap using Mapbox Studio Custom Styles.
                </div>
            </div>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <DefaultMap />
                </div>
                <div className='subContainer'>
                    Basic Map.
                </div>
            </div>
            <div className='mainContainer' />
            <Footer />
        </>
    )
}
