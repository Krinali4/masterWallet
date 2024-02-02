import "./ViewTag.scss";
import React, { useState, useEffect } from "react";
import {
  NavigationProps,
  NavigationState,
} from "../../../navigation/Navigation.types";
import withRouter from "../../../withRouter";
import { Typography, Box, Link, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import LoaderWithRecords from "../../common/loader/LoaderWithRecords";
import "../../common/CommonTable.scss";
import TagScanHistory from "../../../core/models/TagScanHistory";
import TagScanHistoryList from "../../../core/models/TagScanHistoryList";
import Strings from "../../../core/utils/Strings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PaginationBox from "../../common/pagination/PaginationBox";
import { ApiError } from "../../../core/webservice/ApiError";
import { useParams } from "react-router-dom";
import TagService from "../../../services/TagService";
import Tag from "../../../core/models/Tag";
import Loader from "../../common/loader/Loader";
import BatchService from "../../../services/BatchService";
import Batch from "../../../core/models/Batch";
import { TagAllocationType } from "../../../core/models/Tag";
import TextUtils from "../../../core/utils/TextUtils";
import Navigation from "../../../navigation/Navigation";
import PageHeading from "../../common/pageHeading/PageHeading";
import BatchMaterialList from "../../../core/models/BatchMaterialList";
import Map from "../../common/map/Map";
import PlaceService from "../../../services/PlaceService";
import ImageSlider from "../../common/imageSlider/ImageSlider";
import AlertController from "../../common/alertController/AlertController";
import sortedIcon from "../../../statics/svgs/sortedIcon.svg";
import processedIcon from "../../../statics/svgs/processedIcon.jpg";
import { PrimaryBtn } from "../../common/button/PrimaryBtn";
import {
  showApiErrorMessage,
} from "../../common/customeToast/MessageNotifier";
import { GeoLocation } from "../../../core/models/GeoLocation";
import GeoLocationUtil from "../../../core/utils/GeoLocationUtil";
import FullScreenLoader from "../../common/fullScreenLoader/FullScreenLoader";

interface IViewTagProps {
  router: NavigationProps;
  states: NavigationState;
}

function ViewTag(props: IViewTagProps) {
  const { tagId } = useParams();
  const [activeKey, setActiveKey] = React.useState(-1);
  const [activeArrowButton, setActiveArrowButton] = React.useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const [isTagScanHistoryImagesLoading, setIsTagScanHistoryImagesLoading] =
    useState(false);
  const [tagScanHistoryImageList, setTagScanHistoryImageList] =
    useState<TagScanHistoryList>(TagScanHistoryList.default());

  const [tagScanHistoryList, setTagScanHistoryList] =
    useState<TagScanHistoryList>(TagScanHistoryList.default());
  const [isLoading, setIsLoading] = useState(false);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [tag, setTag] = useState<Tag | undefined>(undefined);
  const [batch, setBatch] = useState<Batch | undefined>(undefined);
  const [isSortedModelShow, setIsSortedModelShow] = useState(false);
  const [isProcessedModelShow, setIsProcessedModelShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentGeoLocation, setCurrentGeoLocation] =
    useState<GeoLocation>(undefined);
  const [isLocationFetching, setIsLocationFetching] = useState(false);

  const [batchMaterialList, setBatchMaterialList] = useState<
    BatchMaterialList | undefined
  >(undefined);

  const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    //getInitialData()
  }, []);

  useEffect(() => {
    console.log("batch :" + JSON.stringify(batch));
    console.log("batchMaterial :" + JSON.stringify(batchMaterialList));
  }, [batch, batchMaterialList]);

  useEffect(() => {
    getInitialData();
    fetchTagScanHistoryImagesList();
  }, [tagId]);

  useEffect(() => {
    console.log(tag);
    if (tag) {
      console.log("fetchTagScanHistoryList");
      fetchTagScanHistoryList(page);
    } else {
      console.log("tag not available");
    }
  }, [tag, page]);

  const getInitialData = () => {
    setBatch(undefined);
    setBatchMaterialList(undefined);
    setTagScanHistoryList(TagScanHistoryList.default());
    setIsLoading(true);
    let tID: number = undefined;
    if (!isNaN(Number(tagId))) {
      tID = Number(tagId);
    }
    Promise.all([tID ? TagService.getTagDetails(tID) : Promise.resolve()])
      .then((_results: any[]) => {
        setIsLoading(false);
        if (_results[0]) {
          const rTag: Tag = _results[0];
          setTag(rTag);
          if (rTag.tagAllocationType === TagAllocationType.BATCH) {
            fetchBatchDetails();
          } else if (rTag.tagAllocationType === TagAllocationType.MATERIAL) {
            fetchBatchMaterialDetails();
          }
        }
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false);
        console.log(apiError.message);
      });
  };

  const fetchBatchDetails = () => {
    if (isLoading) return;
    setIsLoading(true);
    BatchService.getBatchDetailsByTagID(Number(tagId))
      .then((result: Batch) => {
        setIsLoading(false);
        setBatch(result);
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false);
        console.log(apiError.message);
      });
  };

  const fetchBatchMaterialDetails = () => {
    setIsLoading(true);
    BatchService.getBatchMaterialDetailsByTagID(Number(tagId))
      .then((result: BatchMaterialList) => {
        setIsLoading(false);
        setBatchMaterialList(result);
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false);
        console.log(apiError.message);
      });
  };

  /* fetch image list for tag scan history. */
  const fetchTagScanHistoryImagesList = () => {
    if (isTagScanHistoryImagesLoading) return;
    setIsTagScanHistoryImagesLoading(true);
    TagService.getTagScanHistoryWithImageList(Number(tagId))
      .then((result: TagScanHistoryList) => {
        setIsTagScanHistoryImagesLoading(false);
        setTagScanHistoryImageList(result);
      })
      .catch((apiError: ApiError) => {
        console.log(apiError.message);
        setIsTagScanHistoryImagesLoading(false);
      });
  };

  const fetchTagScanHistoryList = (page: number) => {
    setIsTableDataLoading(true);
    TagService.getTagScanHistoryList(page, Number(tagId))
      .then((result: TagScanHistoryList) => {
        setIsTableDataLoading(false);
        setTagScanHistoryList(result);
        // to find the address using reverse geocoding
        // PAR-253
        /*PlaceService.findAddressesOfTagScanHistoryList(result).then(
          (newTagScanHistoryList: TagScanHistoryList) => {
            setTagScanHistoryList(newTagScanHistoryList);
          }
        );*/
      })
      .catch((apiError: ApiError) => {
        setIsTableDataLoading(false);
        console.log(apiError.message);
      });
  };

  const handleOnPageSelected = (page: number) => {
    setPage(page);
  };

  if (isLoading) {
    return <Loader pshow={isLoading} />;
  }

  if (!tag) return null;
  if (tag && tag.tagAllocationType === TagAllocationType.BATCH && !batch)
    return null;
  if (
    tag &&
    tag.tagAllocationType === TagAllocationType.MATERIAL &&
    !batchMaterialList
  )
    return null;

  const viewMaterialsList = () => {
    const arrOfNames = batch.associatedBatchMaterialNames();
    if (arrOfNames.length === 0) return null;
    return (
      <Box sx={{ p: 1 }}>
        {arrOfNames.map((mName, i) => (
          <Typography>{mName}</Typography>
        ))}
      </Box>
    );
  };

  const onMarkSortedTapped = async () => {
    setIsLocationFetching(true);
    let myGeoLocation = currentGeoLocation;
    if (!myGeoLocation) {
      GeoLocationUtil.getCurrentLocation()
        .then((geoLocation: GeoLocation) => {
          setIsLocationFetching(false);
          setCurrentGeoLocation(geoLocation);
          if (geoLocation) {
            setIsSortedModelShow(true);
          }
        })
        .catch((apiError: ApiError) => {
          setIsLocationFetching(false);
          showApiErrorMessage(apiError);
        });
    } else {
      setIsLocationFetching(false);
      if (myGeoLocation) {
        setIsSortedModelShow(true);
      }
    }
  };

  const onMarkProcessedTapped = async () => {
    setIsLocationFetching(true);
    let myGeoLocation = currentGeoLocation;
    if (!myGeoLocation) {
      GeoLocationUtil.getCurrentLocation()
        .then((geoLocation: GeoLocation) => {
          setIsLocationFetching(false);
          setCurrentGeoLocation(geoLocation);
          if (geoLocation) {
            setIsProcessedModelShow(true);
          }
        })
        .catch((apiError: ApiError) => {
          setIsLocationFetching(false);
          showApiErrorMessage(apiError);
        });
    } else {
      setIsLocationFetching(false);
      if (myGeoLocation) {
        setIsProcessedModelShow(true);
      }
    }
  };

  const onSortedConfirmClick = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    TagService.batchMarkAsSorted(tag, currentGeoLocation)
      .then((tsHistory: TagScanHistory) => {
        setIsSortedModelShow(false);
        setIsUpdating(false);
        Navigation.refreshPage(props.router);
      })
      .catch((apiError: ApiError) => {
        setIsUpdating(false);
        showApiErrorMessage(apiError);
      });
  };

  const onSortedCancelClick = () => {
    setIsSortedModelShow(false);
  };

  const onProcessedConfirmClick = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    TagService.materialBinMarkAsProcessed(tag, currentGeoLocation)
      .then((tsHistory: TagScanHistory) => {
        setIsProcessedModelShow(false);
        setIsUpdating(false);
        Navigation.refreshPage(props.router);
      })
      .catch((apiError: ApiError) => {
        setIsUpdating(false);
        showApiErrorMessage(apiError);
      });
  };

  const onProcessedCancelClick = () => {
    setIsProcessedModelShow(false);
  };

  const renderTagActionButton = () => {
    if (!tag) return null;
    if (tag.tagAllocationType === TagAllocationType.BATCH && tag.tagLastAction === "SORTED") {
      return (
        <Box className="statusBox">
          <Typography>Status:</Typography>
          <Typography variant="h2">Sorted</Typography>
        </Box>
      );
    }
    if(tag.tagAllocationType === TagAllocationType.MATERIAL && tag.tagLastAction === "RECYCLED") {
      return (
        <Box className="statusBox">
          <Typography>Status:</Typography>
          <Typography variant="h2">Processed</Typography>
        </Box>
      );
    }
    if (tag.tagAllocationType === TagAllocationType.BATCH && tag.tagLastAction !== "SORTED") {
      return (
        <>
          <PrimaryBtn
            label="Mark as sorted"
            buttonWidth="190px"
            onClick={() => {
              onMarkSortedTapped();
            }}
          />
          {isLocationFetching && (
            <FullScreenLoader
              show={isLocationFetching}
              loaderText="Fetching your location..."
            />
          )}
        </>
      );
    } else if(tag.tagAllocationType === TagAllocationType.MATERIAL && tag.tagLastAction !== "RECYCLED") {
      return (
        <>
          <PrimaryBtn
            label="Mark as Processed"
            buttonWidth="220px"
            onClick={() => {
              onMarkProcessedTapped();
            }}
          />
          {isLocationFetching && (
            <FullScreenLoader
              show={isLocationFetching}
              loaderText="Fetching your location..."
            />
          )}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Box className="viewTagsHeader">
        <Box className="viewTagsTitle">
          <PageHeading
            heading={Strings.VIEW_HEADER_TITLE}
            backArrow={true}
            onClick={() => {
              Navigation.back(props.router);
            }}
          />
          <Box display="flex" gap="10px">
            {renderTagActionButton()}
          </Box>
        </Box>
        <Box className="viewTagsDetails">
          <Box className="detailBox">
            <Typography>
              <span>{Strings.VIEW_TAG_ID}</span>
              {tag.tagCode}
            </Typography>
          </Box>
          <Box className="detailBox">
            <Typography>
              <span>{Strings.VIEW_TAG_TYPE}</span>
              {tag.tagAllocationType}
            </Typography>
          </Box>
          <Box className="detailBox">
            <Typography>
              <span>{Strings.VIEW_TAG_TOTAL_WEIGHT}</span>
              {batch
                ? `${TextUtils.displayWeight(batch.estimatedTotalWeight)} KG`
                : `${TextUtils.displayWeight(
                  batchMaterialList.getMaterialBinTotalWeight()
                )} KG`}
            </Typography>
          </Box>
          {tag.tagAllocationType === TagAllocationType.BATCH && (
            <Box className="detailBox">
              <Typography>
                <span>{Strings.VIEW_TAG_ACCOUNT}</span>
                {batch ? batch.account.name : ""}
              </Typography>
            </Box>
          )}
          <Box className="detailBox">
            {!batch ? (
              <Typography>
                <span>Material Name:</span>
                {batchMaterialList ? batchMaterialList.getMaterialName() : ""}
              </Typography>
            ) : (
              <Typography
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={
                  batch.associatedBatchMaterialNames().length !== 0 &&
                  handleClick
                }
                onMouseLeave={
                  batch.associatedBatchMaterialNames().length !== 0 &&
                  handleClose
                }
              >
                {/* <span>{Strings.VIEW_TAG_MATERIAL_NAME}</span> */}
                <Link
                  style={{ cursor: "pointer" }}
                  color="inherit"
                  aria-describedby={id}
                  onClick={
                    batch.associatedBatchMaterialNames().length !== 0 &&
                    handleClick
                  }
                >
                  {`Associated Materials`}
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
        <ImageSlider
          tagScanHistoryImageList={tagScanHistoryImageList}
          isLoading={isTagScanHistoryImagesLoading}
        />
      </Box>
      <Box className="assignedBox" marginTop="41px" marginBottom="44px">
        <Box
          className="assignedBatches"
          display="flex"
          gap="17px"
          alignItems="center"
        >
          <Typography className="blockTitle">
            {batch ? `Associated Material Bins: ` : `Assigned Batches: `}
          </Typography>
          <Box className="blockData" display="flex" gap="15px" flexWrap="wrap">
            {batch
              ? batch.associatedBatchMaterialTags().map((mbTag, index) => (
                  <Link
                    color="inherit"
                    onClick={() => {
                      Navigation.toViewTag(props.router, mbTag.id);
                    }}
                  >
                    {mbTag.tagCode}
                  </Link>
                ))
              : batchMaterialList.associatedBatchTags().map((mbTag, index) => (
                  <Link
                    id="mouse-over-popover"
                    sx={{
                      pointerEvents: "auto",
                    }}
                    color="inherit"
                    onClick={() => {
                      Navigation.toViewTag(props.router, mbTag.id);
                    }}
                  >
                    {mbTag.tagCode}
                  </Link>
                ))}
          </Box>
        </Box>
      </Box>
      <Box className="listingTable">
        <Box
          className="BoxHeader"
          paddingTop="38px"
          marginBottom="15px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#171B1E",
              padding: "0 32px",
            }}
          >
            {Strings.TAG_HISTORY_HEADER_TITLE}
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{Strings.TBL_HEADER_SCAN_DATE_AND_TIME}</TableCell>
                <TableCell>{Strings.TBL_HEADER_EVENT}</TableCell>
                <TableCell>{Strings.TBL_HEADER_GEOLOCATION}</TableCell>
                <TableCell width="200">
                  {Strings.TBL_HEADER_USER_EMAIL}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tagScanHistoryList.tagScanHistories.length > 0 ? (
                tagScanHistoryList.tagScanHistories.map(
                  (tagScanHistory, index) => (
                    <>
                      <TableRow key={index + 1}>
                        <TableCell>
                          {tagScanHistory.displayScannedAt()}
                        </TableCell>
                        <TableCell>
                          {tagScanHistory.getDisplayTagActionType()}
                        </TableCell>
                        <TableCell>
                          {`${tagScanHistory.displayLocationTitle()}`}{" "}
                          {index == activeKey && activeArrowButton ? (
                            <KeyboardArrowUpIcon
                              className="geoLocationToggle"
                              onClick={() => {
                                setActiveKey(-1);
                                setActiveArrowButton(false);
                                setCoordinates(null);
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          ) : (
                            <KeyboardArrowDownIcon
                              className="geoLocationToggle"
                              onClick={() => {
                                setActiveKey(index);
                                setActiveArrowButton(true);
                                setCoordinates({
                                  lat: tagScanHistory.scannedLat,
                                  lng: tagScanHistory.scannedLong,
                                });
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{tagScanHistory.scannedBy}</TableCell>
                      </TableRow>

                      {activeKey == index && (
                        <TableRow className="tagHistoryRow">
                          <TableCell
                            colSpan={4}
                            sx={{
                              textAlign: "left !important",
                            }}
                          >
                            <Box className="locationMap">
                              <Map coOrdinates={coordinates} />
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                )
              ) : (
                <LoaderWithRecords
                  colSpanValue={3}
                  loaderValue={isTableDataLoading}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <PaginationBox
        perPageRecords={tagScanHistoryList.perPageItems}
        currentPage={page}
        currentPageItems={tagScanHistoryList.currentPageItems}
        totalRecordsCount={tagScanHistoryList.totalItems}
        totalPagesCount={tagScanHistoryList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
      {batch && (
        <Popover
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          disableRestoreFocus
        >
          {batch.associatedBatchMaterialNames().length !== 0 &&
            viewMaterialsList()}
        </Popover>
      )}
      <AlertController
        pTitle="Mark As Sorted"
        subHeading="Do you want to mark this batch as sorted ?"
        pShow={isSortedModelShow}
        pCancelButtonTitle="Cancel"
        pYesButtonTitle="Confirm"
        onYesClick={onSortedConfirmClick}
        pLoading={isUpdating}
        onCancelClick={onSortedCancelClick}
        icon={sortedIcon}
      />
      <AlertController
        pTitle="Mark As Processed"
        subHeading="Do you want to mark this material as processed ?"
        pShow={isProcessedModelShow}
        pCancelButtonTitle="Cancel"
        pYesButtonTitle="Confirm"
        onYesClick={onProcessedConfirmClick}
        pLoading={isUpdating}
        onCancelClick={onProcessedCancelClick}
        icon={processedIcon}
      />
    </>
  );
}
export default withRouter(ViewTag);
