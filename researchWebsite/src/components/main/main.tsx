import Header from '../header/header'
import Map from '../map/map'

export default function Main() {
    return (
        <>
            <Header/>
            <h1 className='mainPageHeader'>Current Projects</h1>
            <div className='mainContainer'>
                <div className='subContainer'>
                    <Map />
                </div>
                <div className='subContainer'>
                    Information on the map and the data that it shows 
                </div>
            </div>
        </>
    )
}
