/* eslint-disable no-undef */
import React ,{ useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./style.css"

const findCenterPoint = function (arr) {
  var x = arr.map(({ x }) => x)
  var y = arr.map(({ y }) => y)
  var cx = (Math.min(...x) + Math.max(...x)) / 2
  var cy = (Math.min(...y) + Math.max(...y)) / 2
  return [cx, cy]
}

const viewNewsPaper = () => {
  const [viewer, setViewer] = useState(null)
  const [viewText, setViewText] = useState(false)

  const params = useParams()

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/viewnewspaper/${id}`
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

  // Setup the viewer and the viewer's options
  useEffect(() => {
    const newspaperId = params.id
    fetchNewspaper(newspaperId)

    return () => {
      viewer && viewer.destroy()
    }
  }, [])

  return (
    <div>
      <div
        id="openSeaDragon"
        style={{
          border: viewText ? "2px solid blue" : "1px solid black",
          height: "75vh",
          width: "85vw",
          margin: "auto",
        }}
      />

      <button
        onClick={() => setViewText(!viewText)}
        style={{ marginTop: "30px" }}
      >
        Show text
      </button>
    </div>
  )
}

export default viewNewsPaper
