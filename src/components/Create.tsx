import { FaUpload } from "react-icons/fa6"
import { IoMdCloseCircle, IoMdCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useEffect, useRef, useState } from "react"
import { useGames } from "../hooks/useGames";
import { IImage } from "../utils/interfaces/Interfaces";
import apiClient, { createDiscussion, createPostWithSelectedImage, createPostWithUploadedImage } from "../utils/services/dataServices"
import { generateImageUrl, generateReadyImageUrl } from "../utils/helpers/helpers";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface PostData {
  title?: string,
  description?: string,
  gameId?: number,
  platformId?: number,
  startTime?: string,
  thumbnailSelected?: string,
  thumbnailUploaded?: Blob | MediaSource,
  otherMedia?: File[]
}

export const Create = () => {
  const [creatingPost, setCreatingPost] = useState(true)
  const [choosingImage, setChoosingImage] = useState(false)
  const [postData, setPostData] = useState<PostData>({startTime: new Date().toISOString().slice(0, 16)})
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate()
  const { data: games, isLoading: isLoadingGames } = useGames()
  
  useEffect(() => {
    if (postData.gameId) {
      apiClient.get(`/images?gameId=${postData.gameId}`)
      .then(res => setGameImages([...res.data]))
      .catch(() => console.log("An Error occured"))
    }
  }, [postData.gameId])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files)
      return
    const file = event.target.files[0]
    if (!file)
      return
    setPostData({...postData, thumbnailUploaded: file, thumbnailSelected: undefined})
    // Reset the file input value so selecting the same file again will trigger a change
    if (fileInputRef.current)
      fileInputRef.current.value = ''
  }

  const getGameTitle = (gameId: number) => {
    if (games) {
      const game = games.find((g) => g.id == gameId)
      return game ? game.title : ""
    }
    return ""
  }

  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files)
      return

    setPostData({...postData, otherMedia: [...postData.otherMedia ? postData.otherMedia : [], ...files]})
    // Reset the file input value so selecting the same file again will trigger onChange
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.value = '';
    }
  }

  const handleSubmitWrapper = () => {
    if (creatingPost)
      handlePostCreationSubmit()
    else
      handleDiscussionCreationSubmit()
  }

  const fileIsVideo = (file: File) => 
    file && file.type.includes("video")

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
    // Some basic front end validatin and Toat Container with message
    const { title, description, startTime, gameId, platformId, thumbnailSelected: imageSelected, thumbnailUploaded: imageUploaded} = postData  
    if (!title || !description || !startTime || !gameId || !platformId || (!imageSelected && !imageUploaded))
      toast.error("Please fill in all information")
    else {
      // Depends what type of request we are making
      if (imageUploaded) {
        const formData = new FormData()
        formData.append("title", title as string)
        formData.append("description", description as string)
        formData.append("gameId", `${gameId}` as string)
        formData.append("platformId", `${platformId}` as string)
        formData.append("imageFile", imageUploaded as Blob)
        toast.promise(
          createPostWithUploadedImage(formData),
          {
            pending: "Uploading Post",
            success: "Post created successfully!",
            error: "An unexpected error occured"
          }
        ).then(res => navigate(`/posts/${res.data.id}`))
      } else {
        const imagePath = imageSelected as string
        toast.promise(
          createPostWithSelectedImage({title, description, gameId, platformId, imagePath}),
          {
            pending: "Uploading Post",
            success: "Post created successfully!",
            error: "An unexpected error occured"
          }
        ).then(res => navigate(`/posts/${res.data.id}`))
      }
    }
  }

  const renderUploadedImagePreview = () => {
    if (postData && postData.thumbnailUploaded) {
      const imageUrl = URL.createObjectURL(postData.thumbnailUploaded)
      return (
      <div className="create-post__img--selected__wrapper">
        <MdCancel className="icon" onClick={() => setPostData({...postData, thumbnailUploaded: undefined})}/>
        {fileIsVideo(postData.thumbnailUploaded as File) ? 
        <video autoPlay={true} muted={true} controls={true}>
          <source src={imageUrl} type="video/mp4"/>
        </video> : <img src={imageUrl}/>}
      </div>
      )
    }
  }

  const ChooseGame = () => {
    return games && 
            <select className="create-option" 
                    value = {postData.gameId || ""}
                    onChange={(event) => setPostData({...postData, gameId: parseInt(event.target.value)})}>
              <option>Choose a Game</option>
                {games.map(game => 
              <option key={game.id} value={game.id}>{game.title}</option>)}
            </select>
  }

  const OtherImages = () => {
  
    return (
      <div className="create-discussion__other-images">
        {postData && postData.otherMedia && postData.otherMedia.map(media => {
          return (
            <div className="create-discussion-other_images__wrapper">
              <MdCancel className="icon" onClick={() => setPostData({...postData, otherMedia: postData.otherMedia?.filter((img) => img != media)})}/>
              {fileIsVideo(media) ? 
              <video autoPlay={true} loop={true} muted={true} controls={false}>
                  <source src={URL.createObjectURL(media)} type="video/mp4"/>
              </video>: 
              <img src={URL.createObjectURL(media)} />}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="create-container--wrapper">
      <ToastContainer position="top-center"/>
      {choosingImage && <div className="create-choose-image">
        <IoMdCloseCircle className="close-icon" onClick={() => setChoosingImage(false)}/>
        {postData.gameId ? <h1>Showing images for {getGameTitle(postData.gameId)}.</h1> : <h1>Please choose a game first to view its images.</h1>}
        <div className="create-choose-image__img">
          {gameImages.map(gameImage => 
            <div className="create-img__container">
              {postData && postData.thumbnailSelected && 
              postData.thumbnailSelected == gameImage.imagePath && <IoMdCheckmarkCircle className="icon"/>}
              <img onClick={() => 
                    setPostData({...postData, thumbnailUploaded: undefined, 
                                 thumbnailSelected: !postData ? gameImage.imagePath : postData.thumbnailSelected == gameImage.imagePath ? undefined :  gameImage.imagePath})} 
                   src={generateReadyImageUrl(gameImage.imagePath)}/>
            </div>)}
        </div>
      </div>}
      <div className="create-container" style={{opacity: choosingImage ? 0.6 : 1}}>
          <div className="create-type">
              <button className="btn btn--success btn--md" onClick={() => setCreatingPost(true)}>Post a session</button>
              <button className="btn btn--success btn--md" onClick={() => setCreatingPost(false)}>Discuss Something</button>
          </div>
          {!isLoadingGames && games && <div className="create-post">
            <div className="create-type">
              <ChooseGame/>
              {creatingPost && 
              <select className="create-option" 
                      onChange={(event) => setPostData({...postData, platformId: parseInt(event.target.value)})}>
                <option>What Platform</option>
                <option value="2">Playstation</option>
                <option value="0">XBox</option>
                <option value="1">PC</option>
              </select>}
            </div>
            <input placeholder="Enter a Title" className="create-input" onChange={(event) => setPostData({...postData, title: event.target.value})}/>
            <textarea placeholder="Enter a description" className="create-textarea" onChange={(event) => setPostData({...postData, description: event.target.value})}/>
            <h3 className="create-post-thumbnail-heading">Choose a Thumbnail</h3>
            <div className="create-upload-type">
              <label className="file-upload-wrapper btn btn--success btn--md">
                Upload Thumbnail <FaUpload className="icon"/>
                <input ref={fileInputRef} type="file" onChange={handleFileUpload}/>
              </label>
              <button className="btn btn--success btn--sm" onClick={() => setChoosingImage(true)}>Choose Ready Image</button>
            </div>
            <div className="create-post__img--selected">
              {postData && postData.thumbnailSelected && 
              <div className="create-post__img--selected__wrapper">
                <img src={generateImageUrl(postData.thumbnailSelected)} onClick={() => setChoosingImage(true)}/>
              </div>}
              {postData && postData.thumbnailUploaded && renderUploadedImagePreview()}
            </div>
            {!creatingPost &&
              <label className="file-upload-wrapper btn btn--success btn--md">
                Choose more media <FaUpload className="icon"/>
                <input ref={multipleFileInputRef} type="file" multiple onChange={handleMultipleFileUpload}/>
              </label>}
            {!creatingPost && <OtherImages/>}
            {creatingPost && 
            <>
              <label className="post-starting-time--label" htmlFor="post-starting-time">Choose a start time to let people know.</label>
              <input id="posts-starting-time" type="datetime-local" value={postData.startTime} 
                    className="create-input"
                    onChange={(event) => setPostData({...postData, startTime: event.target.value})}/>
            </>}
            <div className="create-options">
              <button className="btn btn--md btn--success" onClick={handleSubmitWrapper}>Post</button>
              <button className="btn btn--md btn--secondary">Cancel</button>
            </div>
          </div>}
    </div>
    </div>
  )
}
