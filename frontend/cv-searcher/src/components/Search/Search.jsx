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

  function splitFilename(filename) {
    const reversed = filename?.split(".").reverse()
    const name = reversed.slice(1).reverse().join(".")
    return name
  }

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
      const inputValue = SearchInput.current?.value?.trim()
      const keywordsSeparatedByComma = inputValue.split(/\s+/).join(",")
      const response = await search(keywordsSeparatedByComma)
      const matchingFiles = response.data?.matching_files
      //   ?.map(
      //   (file) => file.split(".")[0]
      // )
      // console.log("before: " + response.data?.matching_files?.map((file) => file.split(".")[0])[0])
      // console.log("after : " + response.data?.matching_files?.map((file) => splitFilename(file))[0])
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
          placeholder="write keywords separated by space"
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
              title={splitFilename(file)}
              onClick={() => openPdfFile(splitFilename(file) + ".pdf")}
            >
              {splitFilename(file) ?? "null"}
              <img src={PdfIcon} alt="Pdf Icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
