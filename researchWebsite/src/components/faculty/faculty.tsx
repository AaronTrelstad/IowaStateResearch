import Header from '../header/header'
import './faculty.css'
import facultyMembers from '../../assets/publicInfo/facultyMembers'

const FacultyMember: React.FC<any> = ({ picture, name, title, researchAreas, email }) => {
  return (
    <div className="facultyMember">
      <img src={picture} alt={name} />
      <div className="info">
        <h3>{name}</h3>
        <p>Title: {title}</p>
        <p>Research Areas: {researchAreas}</p>
        <p onClick={() => window.location.href = `mailto:${email}`}>
          Email: <span className="facultyLink">{email}</span>
        </p>
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
          {facultyMembers.map((member, index) => (
            <FacultyMember key={index} {...member} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Faculty
