interface PublicationsProps {
    title: string;
    authors: string[];
    content: string;
    links: string;
    year: string;
}

const publicationData: PublicationsProps[] = [
    {
        title:'Simplifying Temporal Heterogeneous Network for Continuous-Time Link Prediction',
        authors: ['Ce Li', 'Rongpei Hong', 'Xovee Xu', 'Goce Trajcevski', 'Fan Zhou'],
        content: "CIKM '23: Proceedings of the 32nd ACM International Conference on Information and Knowledge Management",
        links: "https://dl.acm.org/doi/abs/10.1145/3583780.3615059",
        year: "2023"
    },
    {
        title:'Querying and mining of time series data: experimental comparison of representations and distance measures',
        authors: ['Hui Ding', 'Goce Trajcevski', 'Peter Scheuermann', 'Xiaoyue Wang', 'Eamonn Keogh'],
        content: "Proceedings of the VLDB Endowment",
        links: "https://www.cs.ucr.edu/~eamonn/vldb_08_Experimental_comparison_time_series.pdf",
        year: "2008"
    },
    {
        title:'Simplifying Temporal Heterogeneous Network for Continuous-Time Link Prediction',
        authors: ['Ce Li', 'Rongpei Hong', 'Xovee Xu', 'Goce Trajcevski', 'Fan Zhou'],
        content: "CIKM '23: Proceedings of the 32nd ACM International Conference on Information and Knowledge Management",
        links: "https://dl.acm.org/doi/abs/10.1145/3583780.3615059",
        year: "2023"
    },
    {
        title:'Simplifying Temporal Heterogeneous Network for Continuous-Time Link Prediction',
        authors: ['Ce Li', 'Rongpei Hong', 'Xovee Xu', 'Goce Trajcevski', 'Fan Zhou'],
        content: "CIKM '23: Proceedings of the 32nd ACM International Conference on Information and Knowledge Management",
        links: "https://dl.acm.org/doi/abs/10.1145/3583780.3615059",
        year: "2023"
    }
]

export default publicationData
