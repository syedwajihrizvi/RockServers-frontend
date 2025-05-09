import { generateReadyImageUrl } from "../utils/helpers/helpers"
import { SingleFileUpload } from "./CustomFileUploads/SingleFileUpload"
import { UploadedImagePreview } from "./UploadedImagePreview"

export const ChooseThumbnail = (
    {thumbnailSelected, thumbnailUploaded, handleFileUpload, handleChoosingImage, handleUploadedImagePreviewClick}:
    {
        thumbnailSelected: string | undefined,
        thumbnailUploaded: Blob | MediaSource | undefined, 
        handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => boolean,
        handleChoosingImage: () => void,
        handleUploadedImagePreviewClick: () => void
        
    }) => {
  return (
   <>
    <h3 className="create-post-thumbnail-heading">Choose video or image thumbnail</h3>
    <div className="create-upload-type">
        <SingleFileUpload label="Upload thumbnail" handleFileUpload={handleFileUpload}/>
        <button className="btn btn--success btn--sm" 
                onClick={handleChoosingImage}>Choose Ready Image</button>
    </div>
    <div className="create-post__img--selected">
        {thumbnailSelected && 
        <div className="create-post__img--selected__wrapper">
        <img src={generateReadyImageUrl(thumbnailSelected)} 
            onClick={handleChoosingImage}/>
        </div>}
        {thumbnailUploaded && 
        <UploadedImagePreview 
            thumbnail={thumbnailUploaded} 
            handleClick={handleUploadedImagePreviewClick}/>}
    </div>
   </>
  )
}
