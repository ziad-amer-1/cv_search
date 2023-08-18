import { useEffect, useRef, useState } from "react"
import "./Search.css"
import { getPdfFiles, previewPdf, search } from "../../api"
import { toast } from "react-toastify"
import Loading from "../Loading/Loading"
import PdfIcon from "../../assets/PdfIcon.svg"

function Search({ setNumberOfFiles }) {
  const SearchInput = useRef(null)

  const [pdfFiles, setPdfFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function handleSearchSubmit(e) {
    e.preventDefault()
    if (SearchInput.current?.value?.trim() === "") {
      if (localStorage.getItem("files")) {
        setPdfFiles(JSON.parse(localStorage.getItem("files")))
        setNumberOfFiles(JSON.parse(localStorage.getItem("files")).length)
        return
      }
      _getPdfFiles()
      return
    }
    try {
      const response = await search(SearchInput.current?.value?.trim())
      const matchingFiles = response.data?.matching_files?.map(
        (file) => file.split(".")[0]
      )
      setPdfFiles(matchingFiles)
      setNumberOfFiles(matchingFiles.length)
    } catch (err) {
      console.log(err)
    }
  }

  async function openPdfFile(filename) {
    await previewPdf(filename)
  }

  async function _getPdfFiles() {
    setIsLoading(true)
    try {
      const res = await getPdfFiles()
      if (res?.data) {
        setPdfFiles(res.data)
        window.localStorage.setItem("files", JSON.stringify(res.data))
        setNumberOfFiles(res.data.length)
        toast.success("PDF files fetched Successfully", { autoClose: 1500 })
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      toast.error("Can't get PDF files", { autoClose: 1500 })
    }
  }
  useEffect(() => {
    _getPdfFiles()
  }, [])

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="write keyword"
          className="search-input"
          ref={SearchInput}
        />
        <button className="search-button">Search</button>
      </form>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="cv-container">
          {pdfFiles?.map((file, i) => (
            <div
              className="cv"
              key={i}
              onClick={() => openPdfFile(file.split(".")[0] + ".pdf")}
            >
              {file.split(".")[0]}
              <img src={PdfIcon} alt="Pdf Icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
