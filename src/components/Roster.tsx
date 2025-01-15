import "../styles/Roster.css";

interface Props {
  isNumbered: boolean;
  roster: string[];
}

const Roster = ({ isNumbered, roster }: Props) => {
  return (
    <div className="roster-container">
      <h3 className="roster-title text-white bg-dark">Roster</h3>
      <div className="table-container">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              {isNumbered && <th scope="col">#</th>}
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((name, index) => {
              return (
                <tr key={index} className='roster-rows'>
                  {isNumbered && <td>{index + 1}</td>}
                  <td>{name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roster;
