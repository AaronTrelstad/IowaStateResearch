import Header from '../header/header';
import './publications.css';
import publications from '../../assets/publicInfo/publications.json';

const PublicationContent: React.FC<any> = ({ title, authors, content, links, year }: any) => {
    const handleClick = () => {
        window.open(links, '_blank');
    }
    
    return (
        <div className='publicationsText'>
            <h3>{title}</h3>
            <p>Authors: {authors.join(', ')}</p>
            <p>Content: {content}</p>
            <p className='publicationsLinks' onClick={handleClick}>Click Here to View</p>
            <p>Year: {year}</p>
        </div>
    );
};

const Publications: React.FC = () => {
    return (
        <>
            <Header />
            <h1 className='publicationsTitle'>Recent Publications</h1>
            <div className='publicationsContainer'>
                {publications.map((publication: any, index: number) => (
                    <PublicationContent key={index} {...publication} />
                ))}
            </div>
        </>
    );
};

export default Publications;


