import { useParams } from "react-router-dom"
import { IImage, PatchDataForPost } from "../utils/interfaces/Interfaces"
import { useEffect, useState } from "react"
import { usePost } from "../hooks/usePosts"
import { ThumbnailImagePreviewViewPath } from "./UploadedImagePreview"
import { FaEdit } from "react-icons/fa";
import { Skeleton } from "./Skeleton"
import { CustomInput, CustomTextArea, CustomTimeInput } from "./CustomTimeInput"
import { ChooseThumbnail } from "./ChooseThumbnail"
import { ReadyImages } from "./ReadyImages"
import apiClient from "../utils/services/dataServices"

export const EditPost = () => {
  const { id: postId } = useParams()
  const [requestData, setRequestData] = useState<PatchDataForPost>({})
  const [editingThumbnail, setIsEditingThumbnail] = useState(false)
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const [choosingImage, setChoosingImage] = useState(false)
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

  useEffect(() => {
    if (postData) {
      apiClient.get(`/images?gameId=${postData.gameId}`)
      .then(res => setGameImages([...res.data]))
      .catch(() => console.log("An Error occured"))
    }
  }, [postData, isLoading])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files)
      return false
    const file = event.target.files[0]
    if (!file)
      return false
    setRequestData({...requestData, thumbnailUploaded: file, thumbnailSelected: undefined})
    return true
  }

  const handleImageSelectInReadyImages = (gameImage: IImage) =>
    setRequestData(
      {...requestData, thumbnailUploaded: undefined, 
      thumbnailSelected: !requestData ? gameImage.imagePath : 
                        requestData.thumbnailSelected == gameImage.imagePath ? 
                        undefined :  gameImage.imagePath})
  
  console.log(requestData)
  return (
    <div className="create-container--wrapper edit-container">
      {choosingImage && 
      <ReadyImages 
        gameId={requestData.gameId} gameImages={gameImages} 
        thumbnailSelected={requestData.thumbnailSelected}
        handleCloseIcon={() => setChoosingImage(false)}
        handleImageClick={handleImageSelectInReadyImages}/>}
      {requestData.title && 
      <CustomInput 
        label="Current Title" 
        placeholder={requestData.title}
        handleChange={(event) => setRequestData({...requestData, title: event.target.value})}/>}
      {requestData.description && <CustomTextArea 
        label="Current Description"
        placeholder={requestData.description}
        handleChange={(event) => setRequestData({...requestData, description: event.target.value})}
        />}
      <div className="current-thumbnail">
        {
          !editingThumbnail && 
          <div className="current-thumbnail__header">
              <h3 className="current-thumbnail__heading">Current Thumbnail</h3>
              <FaEdit className="current-thumbnail__icon" onClick={() => setIsEditingThumbnail(true)}/>
          </div>}
        {
        editingThumbnail ?
        <div className="current-thumbnail__selecting">
          <ChooseThumbnail 
            thumbnailSelected={requestData.thumbnailSelected} 
            thumbnailUploaded={requestData.thumbnailUploaded} 
            handleFileUpload={handleFileUpload}
            handleChoosingImage={() => setChoosingImage(true)}
            handleUploadedImagePreviewClick={() => setRequestData({...requestData, thumbnailUploaded: undefined})}/>
            <button className="btn btn--danger btn--md" onClick={() => setIsEditingThumbnail(false)}>Cancel</button>
        </div> :
        requestData.thumbnailPath && requestData.thumbnailType != undefined ?
        <ThumbnailImagePreviewViewPath 
          thumbnailPath={requestData.thumbnailPath} 
          thumbnailType={requestData.thumbnailType}/> :
        <Skeleton/>
        }
      </div>
      {
        <div className="current-startime">
        <CustomTimeInput 
          label="Current starting time of session"
          startTime={requestData.startTime?.slice(0, 16)} 
          handleChange={(event) => setRequestData({...requestData, startTime: event.target.value})}/>
      </div>
      }
      <div className="edit-options">
        <button className="btn btn--md btn--success">Update</button>
        <button className="btn btn--md btn--secondary">Cancel</button>
      </div>
    </div>)
}
