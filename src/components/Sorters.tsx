import useQueryStore from "../stores/useQueryStore"

export const Sorters = () => {
  const { mostRecent, handleSetMostRecent, handleSetOrderBy } = useQueryStore()
  return (
    <div className="sorters">
        <button className={`btn btn--secondary${mostRecent ? '--active':''} btn--sm`} onClick={() => handleSetMostRecent()}>
          Most Recent
        </button>
        <select onChange={(event) => handleSetOrderBy(event.target.value == 'default' ? undefined : event.target.value)}>
            <option value='default'>Order By</option>
            <option value='likes'>Most Likes</option>
            <option value='views'>Most Views</option>
            <option value='comments'>Most Comments</option>
        </select>
    </div>
  )
}
