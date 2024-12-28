import '../styles/RandomSelectControls.css'

interface Props {
  numAvailableNames: number;
  spinnerCount: number;
  isRosterDisplayed: boolean;
  isNumbered: boolean;
  isSpinning: boolean;
  handleSpinnerCountChange: (count: number) => void;
  handleRosterDisplayed: () => void;
  handleIsNumbered: () => void;
  handleSpinning: () => void;
  handleReset: () => void;
}

const RandomSelectControls = ({ numAvailableNames, spinnerCount, isRosterDisplayed, isNumbered, isSpinning, handleSpinnerCountChange, handleRosterDisplayed, handleIsNumbered, handleSpinning, handleReset }: Props) => {
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
          value={spinnerCount}
          onChange={(e) => handleSpinnerCountChange(Number(e.target.value))}
        >
          <option value={0}>
          </option>
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
        disabled={isSpinning || spinnerCount < 1}
      >
        {isSpinning ? 'Spinning...' : 'Start Spin'}
      </button>

      {/* RESET SELECTED NAMES */}
      <button className="btn btn-sm btn-danger" onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}

export default RandomSelectControls
