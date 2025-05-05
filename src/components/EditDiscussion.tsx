import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { IImage, PatchDataForDiscussion } from "../utils/interfaces/Interfaces"
import { useDiscussion } from "../hooks/useDiscussions"
import apiClient from "../utils/services/dataServices"
import { CustomInput, CustomTextArea } from "./CustomTimeInput"
import { ReadyImages } from "./ReadyImages"
import { FaEdit } from "react-icons/fa"
import { ChooseThumbnail } from "./ChooseThumbnail"
import { ThumbnailImagePreviewViewPath } from "./UploadedImagePreview"
import { Skeleton } from "./Skeleton"
import { MultipleFileUpload } from "./CustomFileUploads/MultipleFileUpload"
import { EditOtherImagePreviewPath } from "./MultipleMediaPreview"

export const EditDiscussion = () => {
  const { id: discussionId } = useParams()
  const [requestData, setRequestData] = useState<PatchDataForDiscussion>({})
  const [editingThumbnail, setIsEditingThumbnail] = useState(false)
  const [editingOtherMedia, setEditingOtherMedia] = useState(false)
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const [choosingImage, setChoosingImage] = useState(false)
  const {data: discussionData, isLoading } = useDiscussion(parseInt(discussionId as string))

  useEffect(() => {
    if (!isLoading && discussionData) {
      const {title, content, gameId, thumbnailPath, thumbnailType} = discussionData
      setRequestData({
        title,
        content,
        gameId,
        thumbnailPath,
        thumbnailType,
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
      {...discussionData, 
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
          <h3 className="current-thumbnail__heading">Other Media</h3>
          <FaEdit className="current-thumbnail__icon" onClick={() => setEditingOtherMedia(true)}/>
        </div>
        {discussionData && <EditOtherImagePreviewPath discussion={discussionData} isEditing={editingOtherMedia}/>}
        {editingOtherMedia &&
        <div className="edit-options--x">
          <button className="btn btn--md btn--danger" onClick={() => setEditingOtherMedia(false)}>Cancel</button>
          <MultipleFileUpload label="Upload new media" handleMultipleFileUpload={handleMultipleFileUpload}/>
        </div>}
      </div>
      <div className="edit-options--y">
        <button className="btn btn--md btn--success">Update</button>
        <button className="btn btn--md btn--danger">Back</button>
      </div>
    </div>)
}
