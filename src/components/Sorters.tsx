import useQueryStore from "../stores/useQueryStore"

export const Sorters = () => {
  const { handleSetOrderBy } = useQueryStore()
  return (
    <div className="filters">
      <select onChange={(event) => handleSetOrderBy(event.target.value)}>
          <option value="recent">Most Recent</option>
          <option value='likes'>Most Likes</option>
          <option value='views'>Most Views</option>
          <option value='comments'>Most Comments</option>
      </select>
    </div>
  )
}
