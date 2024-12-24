import '../styles/RandomSelectControls.css'

interface Props {
  numAvailableNames: number;
  isRosterDisplayed: boolean;
  isNumbered: boolean;
  isSpinning: boolean;
  handleSpinnercountChange: (count: number) => void;
  handleRosterDisplayed: () => void;
  handleIsNumbered: () => void;
  handleSpinning: () => void;
}

const RandomSelectControls = ({ numAvailableNames, isRosterDisplayed, isNumbered, isSpinning, handleSpinnercountChange, handleRosterDisplayed, handleIsNumbered, handleSpinning }: Props) => {
  return (
    <div className="random-select-controls">

      {/* HIDE/SHOW ROSTER */}
      <button className="btn btn-sm btn-info" onClick={handleRosterDisplayed}>
        {isRosterDisplayed ? "Hide Roster" : "Show Roster"}
      </button>

      {/* ADD NUMBERS TO ROSTER */}
      {isRosterDisplayed && (
        <button className="btn btn-sm btn-info" onClick={handleIsNumbered}>
          {isNumbered ? "Hide roster numbers" : "Roster Numbers"}
        </button>
      )}

      {/* SET NUM OF SPINNERS */}
      <label>
        Select:
        <select
          onChange={(e) => handleSpinnercountChange(Number(e.target.value))}
        >
          {Array.from({ length: numAvailableNames }, (_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>

      {/* START NAME SELECTION */}
      <button
        className="btn btn-sm btn-primary"
        onClick={handleSpinning}
        disabled={isSpinning}
      >
        {isSpinning ? 'Spinning...' : 'Start Spin'}
      </button>

      {/* RESET SELECTED NAMES */}
      <button className="btn btn-sm btn-danger">
        Reset
      </button>
    </div>
  )
}

export default RandomSelectControls
