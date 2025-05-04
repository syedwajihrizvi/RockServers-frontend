import { useParams } from "react-router-dom"
import { PatchDataForPost } from "../utils/interfaces/Interfaces"
import { useEffect, useState } from "react"
import { usePost } from "../hooks/usePosts"
import { ThumbnailImagePreviewViewPath } from "./UploadedImagePreview"
import { FaEdit } from "react-icons/fa";
import { Skeleton } from "./Skeleton"
import { CustomTimeInput } from "./CustomTimeInput"

export const EditPost = () => {
  const { id: postId } = useParams()
  const [requestData, setRequestData] = useState<PatchDataForPost>({})
  const {data: postData, isLoading } = usePost(parseInt(postId as string))

  useEffect(() => {
    if (!isLoading && postData) {
      const {title, description, gameId, startTime, thumbnailPath, thumbnailType} = postData
      setRequestData({
        title,
        description,
        gameId,
        thumbnailPath,
        thumbnailType,
        startTime
      })
    }
  }, [isLoading, postData])

  return (
    <div className="create-container--wrapper">
      <input className="create-input" placeholder="Title" value={requestData?.title}/>
      <textarea placeholder="Description" className="create-textarea" value={requestData?.description}/>
      <div className="current-thumbnail">
        <h3 className="current-thumbnail__heading">Current Thumbnail</h3>
        <FaEdit className="current-thumbnail__icon"/>
      </div>
      {
        requestData.thumbnailPath && requestData.thumbnailType != undefined ?
        <ThumbnailImagePreviewViewPath thumbnailPath={requestData.thumbnailPath} thumbnailType={requestData.thumbnailType}/> :
        <Skeleton/>
      }
      {<div className="current-startime">
        <CustomTimeInput 
          label="Current starting time of session"
          startTime={requestData.startTime?.slice(0, 16)} 
          handleChange={(event) => console.log(event.target.value)}/>
      </div>}
    </div>)
}
