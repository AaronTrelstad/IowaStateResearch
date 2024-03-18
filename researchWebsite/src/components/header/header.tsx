import './header.css'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <>
            <div className='header'>
                <Link to='/' className='mainHeaderButton'>
                    <h1 className='mainHeaderText'>Iowa State Research</h1>
                </Link>
                <div className='button-container'>
                    <Link to="/publications" className="button">
                        <h2 className='buttonHeaderText'>Publications</h2>
                    </Link>
                    <Link to="/datasests" className="button">
                        <h2 className='buttonHeaderText'>Datasets</h2>
                    </Link>
                    <Link to="/faculty" className="button">
                        <h2 className='buttonHeaderText'>Faculty</h2>
                    </Link>
                </div>
            </div>
        </>
    )
}
