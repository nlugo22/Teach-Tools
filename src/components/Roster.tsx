import "../styles/Roster.css";

interface Props {
  isNumbered: boolean;
  roster: string[];
  absent: string[];
  setAbsent: (absentList: string[]) => void;
}

const Roster = ({ isNumbered, roster, absent, setAbsent }: Props) => {
  const handleClick = (name: string) => {
    const updatedAbsent = absent.includes(name)
      ? absent.filter((n) => n !== name)
      : [...absent, name];

    setAbsent(updatedAbsent);
  };

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
          <tbody style={{ cursor: "pointer" }}>
            {roster.map((name, index) => {
              return (
                <tr key={index} className="roster-rows">
                  {isNumbered && <td>{index + 1}</td>}
                  <td
                    onClick={() => handleClick(name)}
                    className={absent.includes(name) ? "bg-danger" : ""}
                  >
                    {name}
                  </td>
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
