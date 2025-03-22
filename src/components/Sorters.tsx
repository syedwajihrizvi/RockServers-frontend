export const Sorters = () => {
  return (
    <div className="sorters">
        <button className="btn btn--secondary btn--sm">Most Recent</button>
        <select>
            <option>Order By</option>
            <option>Most Likes</option>
            <option>Most Comments</option>
            <option>Rating</option>
        </select>
    </div>
  )
}
