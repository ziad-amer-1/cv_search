import "./AddCV.css"

import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import GoBackIcon from "../../assets/go-back-arrow.svg"
import { Link } from "react-router-dom"
import { useRef, useState } from "react"
import { uploadFiles } from "../../api"
import { toast } from "react-toastify"

function AddCV() {
  registerPlugin(FilePondPluginImagePreview)

  const [files, setFiles] = useState([])
  const [numberOfFiles, setNumberOfFiles] = useState(0)
  const FilePondRef = useRef(null)

  const handleFileUpdate = (files) => {
    setFiles(files)
    setNumberOfFiles(files.length)
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warn("there are no files", { autoClose: 2000 })
      return
    }
    const toastId = toast.info("Loading...", { autoClose: false })
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file.file)
      })

      await uploadFiles(formData)
      toast.update(toastId, {
        render: "Files uploaded Successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      })
      setFiles([])
      FilePondRef.current?.removeFiles()
    } catch (err) {
      toast.update(toastId, {
        render: "Something went wrong",
        type: toast.TYPE.ERROR,
        autoClose: 3000,
      })
    }
  }

  return (
    <div className="file-upload-container">
      <Link to="/" className="go-back">
        <img src={GoBackIcon} alt="go back icon" />
      </Link>
      <FilePond
        ref={FilePondRef}
        onupdatefiles={handleFileUpdate}
        allowMultiple={true}
        labelIdle="Drag & Drop files"
      />
      <button onClick={handleUpload} className="upload-button">
        Upload Files
      </button>
      <div className="number-of-uploaded-files">
        Uploaded files: {numberOfFiles}
      </div>
    </div>
  )
}

export default AddCV
