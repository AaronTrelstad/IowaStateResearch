import React from 'react';
import Header from '../header/header';
import './datasets.css';
import datasets from '../../assets/datasets/datasets.json';

const downloadFile = (name: string, id: number, format: string) => {
    const filename = `${name.replace(/\s+/g, '')}.${format}`;
    console.log('Downloading file:', filename);
    const link = document.createElement('a');
    link.href = `../../assets/rawDatasets/${id}.${format}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const DatasetContent: React.FC<any> = ({ name, id, description, format }) => {
    return (
        <div className='dataset'>
            <h3>{name}</h3>
            <p>{description}</p>
            <h4 className='downloadButton' onClick={() => downloadFile(name, id, format)}>Click Here to Download ({format})</h4>
        </div>
    );
};

const Datasets: React.FC = () => {
    return (
        <>
            <Header />
            <div className='datasetContainer'>
                <h1 className='datasetTitle'>Datasets</h1>
                <div className='datasetGrid'>
                    {datasets.map((dataset: any, index: number) => (
                        <DatasetContent key={index} {...dataset} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Datasets;

