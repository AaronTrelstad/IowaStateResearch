import Header from '../header/header'
import DefaultMap from '../map/defaultMap'
import DataMap from '../map/mapData'

export default function Main() {
    return (
        <>
            <Header/>
            <h1 className='mainPageHeader'>Current Projects</h1>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <DefaultMap />
                </div>
                <div className='subContainer'>
                    Basic Map.
                </div>
            </div>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <DataMap />
                </div>
                <div className='subContainer'>
                    Connecting loaction markers with lines and changing color based on loaction properties.
                </div>
            </div>
        </>
    )
}
