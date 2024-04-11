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
            <div className="queriesContainer">
                <h1>To-Do List</h1>
                <p>1. Add ability to add multiple datasets onto the same graph</p>
                <p>2. Show time series data</p>
            </div>
        </>
    )
}

export default Queries
