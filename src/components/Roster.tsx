import React, { useEffect, useState } from "react";
import '../styles/Roster.css'

interface Props {
  isNumbered: boolean;
  roster: string[];
}

const Roster = ({ isNumbered, roster }: Props) => {
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('rosterPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: 150, y: 95 };
  });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem('rosterPosition', JSON.stringify(position));
  }, [position]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition((prev: {x: number, y: number}) => ({ x: prev.x + event.movementX, y: prev.y + event.movementY })); }; return (
    <div className="roster-container"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <h3 className="roster-title text-white bg-dark"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        Roster
      </h3>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            {isNumbered && <th scope="col">#</th>}
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((name, index) => (
            <tr key={index} className="roster-rows">
              {isNumbered && <td>{index + 1}</td>}
              <td>{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Roster
