import useQueryStore from "../stores/useQueryStore"

export const Sorters = () => {
  const { mostRecent, handleSetMostRecent, orderBy, handleSetOrderBy } = useQueryStore()
  console.log(`Ordering by: ${orderBy}`)
  return (
    <div className="sorters">
        <button className={`btn btn--secondary${mostRecent ? '--active':''} btn--sm`} onClick={() => handleSetMostRecent()}>
          Most Recent
        </button>
        <select onChange={(event) => handleSetOrderBy(event.target.value == 'default' ? undefined : event.target.value)}>
            <option value='default'>Order By</option>
            <option value='likes'>Most Likes</option>
            <option value='comments'>Most Comments</option>
            <option value='rating'>Rating</option>
        </select>
    </div>
  )
}
