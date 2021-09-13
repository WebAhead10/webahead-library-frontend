/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";

const ViewNewsPaper = () => {
  const [viewer, setViewer] = useState(null);
  const [viewText, setViewText] = useState(false);
  const params = useParams();

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

  useEffect(() => {
    const newspaperId = params.id;
    fetchNewspaper(newspaperId);

    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  const fetchCoords = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/newspaper/coords/${id}`
      );
      if (!result.data.success) throw new Error("Failed");
      const coordsArr = result.data.pages;
      coordsArr.forEach((element) => {
        const coords = element.coords;
        coords.forEach((crd) => {
          var overlayElement = document.createElement("div");
          overlayElement.style.border = "thin solid rgba(255,0,0,0.3)";
          overlayElement.setAttribute("class", `overlay ${element.id}`);
          overlayElement.style.cursor = 'pointer';
          overlayElement.addEventListener("mouseenter", () => {
            var elements = document.getElementsByClassName(element.id);
            for (var i = 0; i < elements.length; i++) {
              elements[i].style.backgroundColor = "rgba(0,0,255,0.3)";
            }
          });
          overlayElement.addEventListener("mouseout", () => {
            var elements = document.getElementsByClassName(element.id);
            for (var i = 0; i < elements.length; i++) {
              elements[i].style.backgroundColor = "";
            }
          });
          overlayElement.addEventListener("click", () => {
            // TODO: add a div to show the text that is connected to the article

            try {
            } catch (err) {
              console.log(err);
            }
          });

          viewer.addOverlay(
            overlayElement,
            new OpenSeadragon.Rect(crd.x, crd.y, crd.width, crd.height)
          );
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const newspaperId = params.id;
    fetchCoords(newspaperId);

    return () => {
      viewer && viewer.destroy();
    };
  }, [viewer]);

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
    </div>
  );
};

export default ViewNewsPaper;
