import { useEffect, useState } from "react"
import { IImage, PostData } from "../utils/interfaces/Interfaces";
import apiClient, { createDiscussion, createPost } from "../utils/services/dataServices"
import { fileIsVideo } from "../utils/helpers/helpers";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MultipleFileUpload } from "./CustomFileUploads/MultipleFileUpload";
import { ChooseGame } from "./ChooseGame";
import { ChoosePlatform } from "./ChoosePlatform";
import { ReadyImages } from "./ReadyImages";
import { MultipleMediaPreview } from "./MultipleMediaPreview";
import { CustomTimeInput } from "./CustomInputs";
import { ChooseThumbnail } from "./ChooseThumbnail";

export const Create = () => {
  const [creatingPost, setCreatingPost] = useState(false)
  const [choosingImage, setChoosingImage] = useState(false)
  const [postData, setPostData] = useState<PostData>({startTime: new Date().toISOString().slice(0, 16)})
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    if (postData.gameId) {
      apiClient.get(`/images?gameId=${postData.gameId}`)
      .then(res => setGameImages([...res.data]))
      .catch(() => console.log("An Error occured"))
    }
  }, [postData.gameId])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files)
      return false
    const file = event.target.files[0]
    if (!file)
      return false
    setPostData({...postData, thumbnailUploaded: file, thumbnailSelected: undefined})
    return true
  }

  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files)
      return false

    setPostData({...postData, otherMedia: [...postData.otherMedia ? postData.otherMedia : [], ...files]})
    // Reset the file input value so selecting the same file again will trigger onChange
    return true
  }

  const handleSubmitWrapper = () => {
    if (creatingPost)
      handlePostCreationSubmit()
    else
      handleDiscussionCreationSubmit()
  }

  const handleDiscussionCreationSubmit = () => {
    const { title, description:content, gameId, thumbnailSelected, thumbnailUploaded, otherMedia } = postData
    if (!title || !content || !gameId || (!thumbnailSelected && !thumbnailUploaded))
       toast("Please fill in all information")
    else {
      const formData = new FormData()
      formData.append("title", title as string)
      formData.append("content", content as string)
      formData.append("gameId", `${gameId}` as string)
      if (thumbnailUploaded)
        formData.append("thumbnailFile", thumbnailUploaded as Blob)
      else
        formData.append("thumbnailPath", thumbnailSelected as string)
      if (otherMedia) {
        otherMedia.forEach((media) => {
          if (fileIsVideo(media))
            formData.append("otherVideos", media)
          else
            formData.append("otherImages", media)
        })
      }
      toast.promise(
        createDiscussion(formData),
        {
          pending: "Creating discussion",
          success: "Discussion created successfully!",
          error: "An unexpected error occured."
        }
      ).then(res => navigate(`/discussions/${res.data.id}`))
    }
    
  }

  const handlePostCreationSubmit = () => {
    // Some basic front end validation and Toast Container with message
    const { title, description, startTime, gameId, platformId, thumbnailSelected: imageSelected, thumbnailUploaded: imageUploaded} = postData  
    if (!title || !description || !startTime || !gameId || !platformId || (!imageSelected && !imageUploaded))
      toast.error("Please fill in all information")
    else {
      // Depends what type of request we are making
        const {thumbnailUploaded, thumbnailSelected} = postData 
        const formData = new FormData()
        formData.append("title", title as string)
        formData.append("description", description as string)
        formData.append("gameId", `${gameId}` as string)
        formData.append("platformId", `${platformId}` as string)
        formData.append("startTime", startTime as string)
        if (thumbnailUploaded)
          formData.append("thumbnailFile", thumbnailUploaded as Blob)
        else
          formData.append("thumbnailPath", thumbnailSelected as string)
        toast.promise(
          createPost(formData),
          {
            pending: "Uploading Post",
            success: "Post created successfully!",
            error: "An unexpected error occured"
          }
        ).then(res => navigate(`/posts/${res.data.id}`))
    }
  }

  const handleImageSelectInReadyImages = (gameImage: IImage) =>
    setPostData(
      {...postData, thumbnailUploaded: undefined, 
      thumbnailSelected: !postData ? gameImage.imagePath : 
                        postData.thumbnailSelected == gameImage.imagePath ? 
                        undefined :  gameImage.imagePath})

  return (
    <div className="create-container--wrapper">
      <ToastContainer position="top-center"/>
      {choosingImage && 
      <ReadyImages gameId={postData.gameId} gameImages={gameImages} 
                   thumbnailSelected={postData.thumbnailSelected}
                   handleCloseIcon={() => setChoosingImage(false)}
                   handleImageClick={handleImageSelectInReadyImages}/>}
      <div className="create-container" style={{opacity: choosingImage ? 0.6 : 1}}>
          <div className="create-type">
              <button className="btn btn--success btn--md" 
                      style={{opacity: creatingPost ? 1 : 0.6}} 
                      onClick={() => setCreatingPost(true)}>Post a session</button>
              <button className="btn btn--success btn--md" 
                      style={{opacity: creatingPost ? 0.6 : 1}} 
                      onClick={() => setCreatingPost(false)}>Discuss Something</button>
          </div>
          <div className="create-post">
            <div className="create-type">
              {<ChooseGame 
                value={postData.gameId} 
                handleChange={(event: React.ChangeEvent<HTMLSelectElement>) => {setPostData({...postData, gameId: parseInt(event.target.value)})}}/>}
              {creatingPost && 
              <ChoosePlatform 
                value={postData.platformId}
                handleChange={(event) => setPostData({...postData, platformId: parseInt(event.target.value)})}/>}
            </div>
            <input placeholder="Enter a Title" 
                   className="create-input" 
                   onChange={(event) => setPostData({...postData, title: event.target.value})}/>
            <textarea placeholder="Enter a description" className="create-textarea" 
                      onChange={(event) => setPostData({...postData, description: event.target.value})}/>
            <ChooseThumbnail thumbnailSelected={postData.thumbnailSelected} 
                             thumbnailUploaded={postData.thumbnailUploaded} 
                             handleFileUpload={handleFileUpload}
                             handleChoosingImage={() => setChoosingImage(true)}
                             handleUploadedImagePreviewClick={() => setPostData({...postData, thumbnailUploaded: undefined})}/>
            {!creatingPost && <MultipleFileUpload label="Choose more media" handleMultipleFileUpload={handleMultipleFileUpload}/>}
            {!creatingPost && 
            <>
                {postData && postData.otherMedia && <MultipleMediaPreview medias={postData.otherMedia} handleClick={(media: File) => setPostData({...postData, otherMedia: postData.otherMedia?.filter((img) => img != media)})}/>}
            </>}
            {creatingPost && 
              <CustomTimeInput label="Choose a start time to let people know." startTime={postData.startTime} 
                               handleChange={(event) => setPostData({...postData, startTime: event.target.value})}/>
            }
            <div className="create-options">
              <button className="btn btn--md btn--success" onClick={handleSubmitWrapper}>Post</button>
              <button className="btn btn--md btn--secondary">Cancel</button>
            </div>
          </div>
    </div>
    </div>
  )
}
