/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./style.css"
import ShowContent from "./ShowContent"

const ViewNewsPaper = () => {
  const [viewer, setViewer] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const params = useParams()

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/newspaper/${id}`
      )

      if (!result.data.success) throw new Error("Failed")

      const bucketRoot =
        "https://feuerstein-form-website-uploads.s3.eu-central-1.amazonaws.com/misc"

      viewer && viewer.destroy()
      setViewer(
        OpenSeadragon({
          id: "openSeaDragon",
          tileSources: result.data.pages.map(
            ({ name, pagename }) =>
              `${bucketRoot}/${
                pagename.split("_")[0]
              }/${pagename}/${pagename}.dzi`
          ),
          animationTime: 0.5,
          immediateRender: true,
          wrapHorizontal: false,
          collectionMode: true,
          collectionRows: 1,
          collectionTileMargin: -150,
          collectionLayout: "horizontal",
          showNavigator: false,
          gestureSettingsMouse: { clickToZoom: false },
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    return () => {
      viewer && viewer.destroy()
    }
  }, [])

  const fetchCoords = useCallback(
    async (id) => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/newspaper/coords/${id}`
        )
        if (!result.data.success) throw new Error("Failed")

        const coordsArr = result.data.pages
        coordsArr.forEach(({ coords, id }) => {
          coords.forEach(({ overlay }) => {
            const overlayElement = document.createElement("div")
            overlayElement.style.cursor = "pointer"
            overlayElement.setAttribute("class", `overlay ${id}`)

            overlayElement.addEventListener("mouseenter", () => {
              const elements = document.getElementsByClassName(id)
              for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = "rgba(0,0,255,0.3)"
              }
            })

            overlayElement.addEventListener("mouseout", () => {
              const elements = document.getElementsByClassName(id)

              for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = "rgba(0,0,255,0.0)"
              }
            })

            overlayElement.addEventListener("click", () => {
              setSelectedId(id)
            })

            viewer.addOverlay(
              overlayElement,
              new OpenSeadragon.Rect(
                overlay.x,
                overlay.y,
                overlay.width,
                overlay.height
              )
            )
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    [viewer]
  )

  useEffect(() => {
    const newspaperId = params.id
    if (viewer) {
      fetchCoords(newspaperId)
    }
  }, [viewer, params.id, fetchCoords])

  return (
    <div className="main-container">
      <div
        id="openSeaDragon"
        style={{
          border: selectedId ? "2px solid blue" : "1px solid black",
          height: "75vh",
          width: "85vw",
          margin: "auto",
        }}
      />

      {selectedId && (
        <ShowContent articleId={selectedId} close={setSelectedId} />
      )}
    </div>
  )
}

export default ViewNewsPaper
