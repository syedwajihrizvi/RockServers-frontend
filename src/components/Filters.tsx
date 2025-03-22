export const Filters = () => {
  return (
    <div className="filters filter--games">
        <select>
            <option>All Games</option>
            <option>RDR 1</option>
            <option>RDR 2</option>
            <option>GTA 4</option>
            <option>GTA 5</option>
            <option>GTA 6</option>
        </select>
        <button className="btn btn--secondary btn--sm">
            Active
        </button>
    </div>
  )
}
