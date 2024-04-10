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
            <p>Datasets stored using AWS DynamoDB and AWS S3. Uses AWS Lambdas functions for tasks.</p>
        </>
    )
}

export default Queries
