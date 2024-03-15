import Header from '../header/header'
import './faculty.css'
import facultyData from '../../assets/publicInfo/facultyMembers'

interface FacultyMemberProps {
    picture: string;
    name: string;
    title: string;
    researchAreas: string;
    email: string;
}
  
const FacultyMember: React.FC<FacultyMemberProps> = ({ picture, name, title, researchAreas, email }) => {
    return (
      <div className="facultyMember">
        <img src={picture} alt={name} />
        <div className="info">
          <h3>{name}</h3>
          <p>Title: {title}</p>
          <p>Research Areas: {researchAreas}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    );
};

const Faculty: React.FC = () => {  
    return (
      <>
        <Header />
        <div className='facultyContainer'>
          <h1 className='facultyHeader'>Faculty Members</h1>
          <div className="facultyGrid">
            {facultyData.map((member, index) => (
              <FacultyMember key={index} {...member} />
            ))}
          </div>
        </div>
      </>
    );
  };

export default Faculty
