/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "./style.css";

const findCenterPoint = function (arr) {
  var x = arr.map(({ x }) => x);
  var y = arr.map(({ y }) => y);
  var cx = (Math.min(...x) + Math.max(...x)) / 2;
  var cy = (Math.min(...y) + Math.max(...y)) / 2;
  return [cx, cy];
};

const EditEntity = () => {
  const [viewer, setViewer] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [coords, setCoords] = useState([]);
  const [cropModeDots, setCropModeDots] = useState([]);
  const [shape, setShape] = useState([]);

  const params = useParams();
  const history = useHistory();

  const fetchNewspaper = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/newspaper/${id}`
      );

      if (!result.data.success) throw new Error("Failed");

      const bucketRoot =
        "https://feuerstein-form-website-uploads.s3.eu-central-1.amazonaws.com/misc";

      viewer && viewer.destroy();
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
      );
    } catch (error) {
      console.log(error);
    }
  };

  const drawOverlay = useCallback(() => {
    if (cropMode) {
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const minLeft = Math.min(...coords.map(({ x }) => x));
      const minTop = Math.min(...coords.map(({ y }) => y));
      const maxLeft = Math.max(...coords.map(({ x }) => x));
      const maxTop = Math.max(...coords.map(({ y }) => y));

      viewer.addOverlay(
        overlay,
        new OpenSeadragon.Rect(
          minLeft,
          minTop,
          maxLeft - minLeft,
          maxTop - minTop
        )
      );

      cropModeDots.forEach((element) => viewer.removeOverlay(element));
      setShape((prevCoords) => [...prevCoords, coords]);
      setCropModeDots([]);
      setCoords([]);
    }
  }, [cropMode, coords, viewer, setCropModeDots, cropModeDots]);

  // Setup the viewer and the viewer's options
  useEffect(() => {
    const newspaperId = params.id;
    fetchNewspaper(newspaperId);

    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  // Adds a click event for the viewer to get the coords
  useEffect(() => {
    const canvasClickHandler = function (event) {
      if (cropMode) {
        var { x, y } = viewer.viewport.pointFromPixel(event.position);
        const overlayCorner = document.createElement("div");
        overlayCorner.classList.add("overlayCorner");

        viewer.addOverlay(
          overlayCorner,
          new OpenSeadragon.Rect(x - 8, y - 8, 10, 10)
        );

        // Remove the red dots after adding the overlay
        setCropModeDots((prevCropModeDots) => [
          ...prevCropModeDots,
          overlayCorner,
        ]);

        setCoords((prevCoords) => [...prevCoords, { x, y }]);
      }
    };

    if (viewer) {
      viewer.removeHandler("canvas-click", canvasClickHandler);
      viewer.addHandler("canvas-click", canvasClickHandler);
    }
  }, [viewer, cropMode]);

  useEffect(() => {
    if (coords.length === 4) {
      drawOverlay();
    }

    if (coords.length > 4) {
      setCoords([]);
    }
  }, [coords, drawOverlay]);
  console.log(coords);

  const onSubmit = () => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/newspaper/coords/" + params.id,
        shape
      )
      .then((res) => {
        if (!res.data.success) throw new Error("Failed");
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
    alert("added successfully ya habibi");
    history.push("/");
  };

  return (
    <div>
      <div
        id="openSeaDragon"
        style={{
          border: cropMode ? "6px solid red" : "1px solid black",
          height: "75vh",
          width: "85vw",
          margin: "auto",
        }}
      />

      <button
        onClick={() => setCropMode(!cropMode)}
        style={{ marginTop: "30px" }}
      >
        Crop mode
      </button>
      <button onClick={() => onSubmit(onSubmit)} style={{ marginTop: "30px" }}>
        submit
      </button>
    </div>
  );
};

export default EditEntity;
