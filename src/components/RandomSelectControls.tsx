import '../styles/RandomSelectControls.css'

interface Props {
  numAvailableNames: number;
  spinnerCount: number;
  isRosterDisplayed: boolean;
  isNumbered: boolean;
  isSorted: boolean;
  isSpinning: boolean;
  handleSpinnerCountChange: (count: number) => void;
  handleRosterDisplayed: () => void;
  handleIsNumbered: () => void;
  handleSort: () => void;
  handleSpinning: () => void;
  handleReset: () => void;
  handleClearAbsent: () => void;
  handleGoBack: () => void;
}

const RandomSelectControls = ({ numAvailableNames, spinnerCount, isRosterDisplayed, isNumbered, isSorted, isSpinning, handleSpinnerCountChange, handleRosterDisplayed, handleIsNumbered, handleSort, handleSpinning, handleReset, handleClearAbsent, handleGoBack }: Props) => {
  return (
    <div className="random-select-controls">

      {/* GO BACK TO UPLOAD PAGE */}
      <button className="btn btn-sm btn-danger" onClick={handleGoBack}>
        Back
      </button>

      {/* CLEAR ABSENT NAMES */}
      <button className="btn btn-sm btn-danger" onClick={handleClearAbsent}>
        Clear Absent
      </button>

      {/* Hide Roster */}
      <div className="p-1 small"> 
        <label style={{ color: "white", }}>
        <input
          type="checkbox"
          checked={isRosterDisplayed}
          onChange={handleRosterDisplayed}
        />
        Roster
        </label>
      </div>

      {/* Number the roster */}
      <div className="p-1 small"> 
        <label style={{ color: "white" }}>
        <input
          type="checkbox"
          checked={isNumbered}
          onChange={handleIsNumbered}
        />
        Enumerate
        </label>
      </div>

      {/* Sort the names */}
      <div className="p-1 small"> 
        <label style={{ color: "white", }}>
        <input
          type="checkbox"
          checked={isSorted}
          onChange={handleSort}
        />
        Sort
        </label>
      </div>


      {/* SET NUM OF SPINNERS */}
      <div className="p-1 small"> 
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
      </div>

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
