import Header from '../header/header';
import './publications.css';
import publicationData from '../../assets/publicInfo/publications';
{/*
import { useEffect, useState } from 'react';
import { getJson } from 'serpapi'; 
*/}

interface PublicationsProps {
    title: string;
    authors: string[];
    content: string;
    links: string;
    year: string;
}

const PublicationContent: React.FC<PublicationsProps> = ({ title, authors, content, links, year }) => {
    {/*
    We could add a citations tracker for each publication but this would have 
    to be on the server side with Node.js

    const [citations, setCitations] = useState<number>(0);

    useEffect(() => {
        const getCitations = async (title: string) => {
            try {
                const json = await getJson({
                    engine: 'google_scholar',
                    q: title,
                    api_key: '9b1c11b45fda2ff61705b8f6abfcea4b90806ae77b59db8c5d7ec90dd4636bcd'
                });
                if (json && json.organic_results && json.organic_results.length > 0) {
                    const firstResult = json.organic_results[0];
                    if (firstResult && firstResult.inline_links && firstResult.inline_links.cited_by) {
                        const totalCitations = firstResult.inline_links.cited_by.total;
                        setCitations(totalCitations);
                    }
                }
            } catch (error) {
                console.log("Error fetching citations: ", error);
            }
        };

        getCitations(title);
    }, [title]); 

    */}

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
            {/* <p>Citations: {citations}</p> */}
        </div>
    );
};

const Publications: React.FC = () => {
    return (
        <>
            <Header />
            <h1 className='publicationsTitle'>Recent Publications</h1>
            <div className='publicationsContainer'>
                {publicationData.map((publication, index) => (
                    <PublicationContent key={index} {...publication} />
                ))}
            </div>
        </>
    );
};

export default Publications;

