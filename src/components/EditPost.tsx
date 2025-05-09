import { useParams } from "react-router-dom"
import { IImage, PatchDataForPost } from "../utils/interfaces/Interfaces"
import { useEffect, useState } from "react"
import { usePost } from "../hooks/usePosts"
import { ThumbnailImagePreviewViewPath } from "./UploadedImagePreview"
import { FaEdit } from "react-icons/fa";
import { Skeleton } from "./Skeleton"
import { CustomInput, CustomTextArea } from "./CustomInputs"
import { ChooseThumbnail } from "./ChooseThumbnail"
import { ReadyImages } from "./ReadyImages"
import apiClient, { updatePost } from "../utils/services/dataServices"
import { ChooseGame } from "./ChooseGame"
import { ChoosePlatform } from "./ChoosePlatform"
import { ToastContainer, toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"

export const EditPost = () => {
  const { id: postId } = useParams()
  const [requestData, setRequestData] = useState<PatchDataForPost>({})
  const [editingThumbnail, setIsEditingThumbnail] = useState(false)
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const [choosingImage, setChoosingImage] = useState(false)
  const {data: postData, isLoading } = usePost(parseInt(postId as string))
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoading && postData) {
      const {title, description, gameId, platformId, thumbnailPath, thumbnailType} = postData
      setRequestData({
        title,
        description,
        gameId,
        platformId,
        thumbnailPath,
        thumbnailType
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
  
  const handleUpdate = () => {
    // Find out which fields updated
    const {title, description, gameId, platformId, thumbnailSelected, thumbnailUploaded} = requestData
    const gameChanged = gameId != postData?.gameId
    const platformChanged = platformId != postData?.platformId
    const titleChanged = title != postData?.title
    const descriptionChanged = description != postData?.description
    // Determine if the thumbnail changed
    const thumbnailChanged = requestData.thumbnailType || requestData.thumbnailUploaded || requestData.thumbnailSelected
    const formData = new FormData()
    if (gameChanged)
      formData.append("gameId", `${gameId}` as string)
    if (platformChanged)
      formData.append("platformId", `${platformId}` as string)
    if (titleChanged)
      formData.append("title", title as string)
    if (descriptionChanged)
      formData.append("description", description as string)
    
    if (thumbnailChanged) {
      if (thumbnailUploaded)
        formData.append("thumbnailFile", thumbnailUploaded as Blob)
      else
      formData.append("thumbnailPath", thumbnailSelected as string)
    }

    if (postData && postData.id)
      toast.promise(
        updatePost(postData?.id, formData)
                  .then(() => {
                    toast.dismiss()
                    setIsEditingThumbnail(false)
                    queryClient.invalidateQueries({queryKey: ["posts", postData.id]})
                  }),
        {
          pending: "Updating Post...",
          success: "Post Updated Successfully!",
          error: "Error updating post"
        }
      )
  }

  return (
    <div className="create-container--wrapper edit-container">
      <ToastContainer position="top-center"/>
      {choosingImage && 
      <ReadyImages 
        gameId={requestData.gameId} gameImages={gameImages} 
        thumbnailSelected={requestData.thumbnailSelected}
        handleCloseIcon={() => setChoosingImage(false)}
        handleImageClick={handleImageSelectInReadyImages}/>}
       <div className="create-type">
        <ChooseGame 
          value={requestData.gameId} 
          handleChange={(event: React.ChangeEvent<HTMLSelectElement>) => {setRequestData({...requestData, gameId: parseInt(event.target.value)})}}/>
        <ChoosePlatform 
          value={requestData.platformId}
          handleChange={(event) => setRequestData({...requestData, platformId: parseInt(event.target.value)})}/>
      </div>
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
      <div className="edit-options">
        <button className="btn btn--md btn--success" onClick={handleUpdate}>Update</button>
        <button className="btn btn--md btn--secondary">Cancel</button>
      </div>
    </div>)
}
