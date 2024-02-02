import { Typography, Box } from "@mui/material"
import { useState, useRef } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import "./ImageSlider.scss"
import TagScanHistoryList from "../../../core/models/TagScanHistoryList"
import TagScanHistory from "../../../core/models/TagScanHistory"
import Loader from "../loader/Loader"
import FullScreenImageSlider from "./FullScreenImageSlider"
import ScannedImageView from "./ScannedImageView"

interface IImageSliderProps {
  tagScanHistoryImageList: TagScanHistoryList
  isLoading: boolean
}

function ImageSlider(props: IImageSliderProps) {

  const normalCarousel = useRef<any>();

  const [isFullScreenMode, setFullScreenMode] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const tagScanHistoryArr = props.tagScanHistoryImageList.tagScanHistories

  if(tagScanHistoryArr.length == 0) {
    return (
      null
    )
  }
  
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1281 },
      items: 6,
      slidesToSlide: 6, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1280, min: 769 },
      items: 4,
      slidesToSlide: 4, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
  }

  const normalScreenCarousel = () => {
    return (
      <Carousel
        ref={normalCarousel}
        focusOnSelect={false}
        responsive={responsive}
        swipeable={false}
        draggable={false}
      >
        {tagScanHistoryArr.map((item: TagScanHistory) => (
          <Box
            key={`normal_img_${item.id}`}
            className="normalImageView"
            onClick={() => {
              setSelectedIndex(tagScanHistoryArr.indexOf(item))
              setFullScreenMode(true)
            }}
          >
            <ScannedImageView
              variant='small' 
              src={item.attachedImageUrl} 
            /> 
          </Box>
        ))}
      </Carousel>
    )
  }

  return (
    <>
    <Box className={"imgSliderBox"}>
      <Typography variant="h2" className="images-title">{`Images(${props.tagScanHistoryImageList.totalItems})`}</Typography>
      <Box className="imgSliderCarousel">
        {normalScreenCarousel()}
        <Loader pshow={props.isLoading}/>
      </Box>
    </Box>
    <FullScreenImageSlider 
      tagScanHistoryImageList={props.tagScanHistoryImageList} 
      show={isFullScreenMode} 
      index={selectedIndex}
      onClose={() => {
        setSelectedIndex(-1)
        setFullScreenMode(false)
      }} 
      />
    </>
  )
}

export default ImageSlider
