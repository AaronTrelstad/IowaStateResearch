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
            <DynamicDataMap />
            <JSONDataMap />
            <CSVDataMap />
            <ColorDataMap />
            <DefaultMap />
            <div className='mainContainer' />
            <Footer />
        </>
    )
}
