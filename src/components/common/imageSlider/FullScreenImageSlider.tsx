import { useState, useEffect, useRef } from "react";
import "./FullScreenImageSlider.scss";
import TagScanHistoryList from "../../../core/models/TagScanHistoryList";
import { Box, Typography } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TagScanHistory from "../../../core/models/TagScanHistory";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../loader/Loader";
import TextUtils from "../../../core/utils/TextUtils";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

interface IFullScreenImageSliderProps {
  tagScanHistoryImageList: TagScanHistoryList;
  show: boolean;
  index: number;
  onClose(): void;
}

/*const downloadImage = (url: string, targetValue: boolean) => {
  const element = document.createElement("a");
  element.href = url;
  element.target = targetValue ? "_blank" : "";
  element.download = ""
  document.body.appendChild(element);
  element.click();  
}*/

function FullScreenImageSlider(props: IFullScreenImageSliderProps) {
  const fullCarousel = useRef<any>();
  const tagScanHistoryArr = props.tagScanHistoryImageList.tagScanHistories;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {}, []);

  useEffect(() => {
    setIsLoading(true);
    if (fullCarousel && fullCarousel.current) {
      fullCarousel.current.goToSlide(props.index);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [props.index]);

  if (!props.show) return null;

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1281 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1280, min: 769 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const renderFieldInfo = (title: string, value: string) => {
    const displayValue = TextUtils.isEmpty(value) ? "Not available" : value;
    return (
      <Box className="viewImageDetail">
        <Typography>
          <span>{`${title}: `}</span>
          {`${displayValue}`}
        </Typography>
      </Box>
    );
  };
  
  const fullScreenCarousel = () => {
    return (
      <Carousel
        ref={fullCarousel}
        responsive={responsive}
        swipeable={false}
        draggable={false}
      >
        {tagScanHistoryArr.map((item: TagScanHistory) => (
          <Box key={`full_img_${item.id}`} className="image-content-container">
            <Box>
              <Box className="zoomImage">
                <TransformWrapper
                  initialScale={1}
                  initialPositionX={0}
                  initialPositionY={0}
                >
                  {({ zoomIn, zoomOut }: any) => (
                    <Box>
                      <Box>
                        <Box className="zoomAction">
                          <button onClick={() => zoomIn()}>
                            <ZoomInIcon />
                          </button>
                          <button onClick={() => zoomOut()}>
                            <ZoomOutIcon />
                          </button>
                          {/* <button onClick={() => resetTransform()}>x</button> */}
                        </Box>
                        <TransformComponent>
                          <img
                            className="full-image"
                            src={item.attachedImageUrl}
                            alt="Tag Scanned Img"
                          />
                        </TransformComponent>
                      </Box>
                    </Box>
                  )}
                </TransformWrapper>
              </Box>
              <Box className="image-description-container">
                <Box className="viewImageDetailsRow">
                  {renderFieldInfo("Scan Date", item.displayScannedAtDate())}
                  {renderFieldInfo("Scan Time", item.displayScannedAtTime())}
                  {renderFieldInfo("Event", item.getDisplayTagActionType())}
                  {/* {renderFieldInfo(
                    "Location",
                    item.scannedLocation ? item.scannedLocation.name : ""
                  )} */}
                  {renderFieldInfo("User Email", item.scannedBy)}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Carousel>
    );
  };

  return (
    <Box className="fullscreen-image-main-container">
      <Box
        className="fullscreen-image-inner-container"
        sx={{ visibility: isLoading ? "hidden" : "visible" }}
      >
        {fullScreenCarousel()}
        <Box
                className="topActions"
                onClick={() => {
                  props.onClose();
                }}
              >
                {/* <Box onClick={() => {downloadImage(item.attachedImageUrl, false)}}>
                  <CloudDownloadIcon />
                </Box> */}
                
                <CloseIcon />
              </Box>
      </Box>
      {isLoading && <Loader pshow={isLoading} color="#fff" />}
    </Box>
  );
}
export default FullScreenImageSlider;
