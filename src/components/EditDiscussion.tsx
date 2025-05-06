import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { IImage, PatchDataForDiscussion, ThumbnailType } from "../utils/interfaces/Interfaces"
import { useDiscussion } from "../hooks/useDiscussions"
import apiClient, { updateDiscussion } from "../utils/services/dataServices"
import { CustomInput, CustomTextArea } from "./CustomInputs"
import { ReadyImages } from "./ReadyImages"
import { FaEdit } from "react-icons/fa"
import { ChooseThumbnail } from "./ChooseThumbnail"
import { ThumbnailImagePreviewViewPath } from "./UploadedImagePreview"
import { Skeleton } from "./Skeleton"
import { MultipleFileUpload } from "./CustomFileUploads/MultipleFileUpload"
import { EditOtherMediaPreviewPath, MultipleMediaPreview } from "./MultipleMediaPreview"
import { MdEditOff } from "react-icons/md"
import { fileIsVideo, stringArraysEqual } from "../utils/helpers/helpers"
import { useQueryClient } from "@tanstack/react-query"
import { ToastContainer, toast } from "react-toastify"

export const EditDiscussion = () => {
  const { id: discussionId } = useParams()
  const [requestData, setRequestData] = useState<PatchDataForDiscussion>({})
  const [editingThumbnail, setIsEditingThumbnail] = useState(false)
  const [editingOtherMedia, setEditingOtherMedia] = useState(false)
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const [choosingImage, setChoosingImage] = useState(false)
  const {data: discussionData, isLoading } = useDiscussion(parseInt(discussionId as string))
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoading && discussionData) {
      const {title, content, gameId, thumbnailPath, thumbnailType, otherImages, videoPaths} = discussionData
      setRequestData({
        title,
        content,
        gameId,
        thumbnailPath,
        thumbnailType,
        otherImages,
        videoPaths
      })
    }
  }, [isLoading, discussionData])

  useEffect(() => {
    if (discussionData) {
      apiClient.get(`/images?gameId=${discussionData.gameId}`)
      .then(res => setGameImages([...res.data]))
      .catch(() => console.log("An Error occured"))
    }
  }, [discussionData, isLoading])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files)
      return false
    const file = event.target.files[0]
    if (!file)
      return false
    setRequestData({...requestData, thumbnailUploaded: file, thumbnailSelected: undefined})
    return true
  }

  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files)
      return false

    setRequestData(
      {...requestData, 
       otherMedia: [...requestData.otherMedia ? requestData.otherMedia : [], ...files]})
    // Reset the file input value so selecting the same file again will trigger onChange
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
    const {title, content, gameId, thumbnailSelected, thumbnailUploaded} = requestData
    const gameChanged = gameId != discussionData?.gameId
    const titleChanged = title != discussionData?.title
    const contentChanged = content != discussionData?.content

    // Determine if the thumbnail changed
    const thumbnailChanged = requestData.thumbnailType || requestData.thumbnailUploaded || requestData.thumbnailSelected
    const formData = new FormData()
    if (gameChanged)
      formData.append("gameId", `${gameId}` as string)
    if (titleChanged)
      formData.append("title", title as string)
    if (contentChanged)
      formData.append("content", content as string)
    
    if (thumbnailChanged) {
      if (thumbnailUploaded)
        formData.append("thumbnailFile", thumbnailUploaded as Blob)
      else
      formData.append("thumbnailPath", thumbnailSelected as string)
    }

    // OtherImages changed
    const otherImagesChanged = !stringArraysEqual(requestData.otherImages, discussionData?.otherImages)
    const videoPathsChanged = !stringArraysEqual(requestData.videoPaths, discussionData?.videoPaths)
    console.log(videoPathsChanged)
    console.log(requestData.videoPaths)
    console.log(otherImagesChanged)
    console.log(requestData.otherImages)
    if (otherImagesChanged) {
        if (requestData.otherImages && requestData.otherImages.length > 0)
          requestData.otherImages?.forEach((img) => formData.append("existingImages", img))
        else
          formData.append("existingImages", "")
    }
    if (videoPathsChanged) {
      if (requestData.videoPaths && requestData.videoPaths.length > 0)
        requestData.videoPaths?.forEach((vid) => formData.append("existingVideos", vid))
      else
      formData.append("existingVideos", "")
    }

    if (requestData.otherMedia) {
         requestData.otherMedia.forEach((media) => {
           if (fileIsVideo(media))
             formData.append("newVideos", media)
           else
             formData.append("newImages", media)
         })     
    }

    if (discussionData && discussionData.id)
      toast.promise(
        updateDiscussion(discussionData.id, formData)
                  .then(() => {
                    toast.dismiss()
                    setIsEditingThumbnail(false)
                    setEditingOtherMedia(false)
                    queryClient.invalidateQueries({queryKey: ["discussions", discussionData.id]})
                  }),
        {
          pending: "Updating Discussion...",
          success: "Discussion Updated Successfully!",
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
      {requestData.title && 
      <CustomInput 
        label="Current Title" 
        placeholder={requestData.title}
        handleChange={(event) => setRequestData({...requestData, title: event.target.value})}/>}
      {requestData.content && 
      <CustomTextArea 
        label="Current Description"
        placeholder={requestData.content}
        handleChange={(event) => setRequestData({...requestData, content: event.target.value})}
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
        <div className="current-thumbnail__header">
          <h3 className="current-thumbnail__heading">
            {!editingOtherMedia ? "Edit other images and videos related to the discussion." : "Stop editing."}
          </h3>
          {!editingOtherMedia && <FaEdit className="current-thumbnail__icon" onClick={() => setEditingOtherMedia(true)}/>}
          {editingOtherMedia && <MdEditOff className="current-thumbnail__icon" style={{color: 'red'}} onClick={() => setEditingOtherMedia(false)}/>}
        </div>
        {discussionData && 
        <EditOtherMediaPreviewPath 
          imagePaths={requestData.otherImages} videoPaths={requestData.videoPaths} 
          isEditing={editingOtherMedia}
          handleClick={(media: string, mediaType: ThumbnailType) => {
            if (mediaType == ThumbnailType.Image)
              setRequestData(
                {...requestData, 
                 otherImages: requestData.otherImages ? requestData.otherImages?.filter(img => img != media) : []})
            else
              setRequestData(
                {...requestData, 
                videoPaths: requestData.videoPaths ? requestData.videoPaths?.filter(vid => vid != media) : []})
                  
          }}/>}
        {editingOtherMedia &&
        <MultipleFileUpload label="Upload new media" handleMultipleFileUpload={handleMultipleFileUpload}/>}
        {editingOtherMedia && requestData.otherMedia &&
        <MultipleMediaPreview 
          medias={requestData.otherMedia}
          handleClick={(media: File) => 
            setRequestData(
              {
                ...requestData, 
                otherMedia: requestData.otherMedia?.filter((img) => img != media)})}/>}
      </div>
      <div className="edit-options--y">
        <button className="btn btn--md btn--success" onClick={handleUpdate}>Update</button>
        <button className="btn btn--md btn--danger">Back</button>
      </div>
    </div>)
}
