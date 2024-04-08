import Header from "../header/header"
import Canvas from "./canvas"
import './queries.css'

const Queries = () => {
    return (
        <>
            <Header />
            <h1 className="queriesTitle">Interactive Visualizer</h1>
            <div>
                <Canvas />

            </div>
            <p>Allow users to select map types/features and upload datasets they can load datasets that are already being stored</p>
            <p>Users can download files from the PostgreSQL database in the datasets tab</p>
            <p>Also add in features to see areas that need to most help</p>
        </>
    )
}

export default Queries
