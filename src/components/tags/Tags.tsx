import { useState, useEffect } from "react";
import "./Tags.scss";
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types";
import Navigation from "../../navigation/Navigation";
import withRouter from "../../withRouter";
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TagList from "../../core/models/TagList";
import { Link } from "@mui/material";
import LoaderWithRecords from "../common/loader/LoaderWithRecords";
import PaginationBox from "../common/pagination/PaginationBox";
import Strings from "../../core/utils/Strings";
import "../common/CommonTable.scss";
import TagService from "../../services/TagService";
import { ApiError } from "../../core/webservice/ApiError";
import SearchTextField from "../common/searchTextField/SearchTextField";
import TagTypeFilter from "../common/filters/TagTypeFilter";
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils";
import TextUtils from "../../core/utils/TextUtils";
import TagStatus from "../common/tagStatus/TagStatus";
import Tag from "../../core/models/Tag";

interface ITagsProps {
  router: NavigationProps;
  states: NavigationState;
}

function Tags(props: ITagsProps) {

  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)

  const [tagList, setTagList] = useState<TagList>(TagList.default());
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<IQueryParams>(qParams)
  
  const [onSelectSearchResult, setOnSelectSearchResult] = useState({id:"", name:""}); 
 
  useEffect(() => {
    fetchTagList(filter.page);
  }, []);

  useEffect(() => {
    fetchTagList(filter.page);
  }, [filter])

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  const fetchTagList = (page: number) => {
    setIsLoading(true);
    TagService.getTagList(filter)
      .then((newMaterialList: TagList) => {
        setIsLoading(false);
        setTagList(newMaterialList);
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false);
        console.log(apiError.message);
      });
  };

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toTags({router:props.router,toBeReplaced:false,queryParams:newFilter})
  };

  const upFilter = (field: string, value: any) => {
    const newFilter = {...filter, [field]: value}
    console.log('upFilter :'+newFilter)
    Navigation.toTags({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const renderTagStatus = (tag: Tag) => {
    return (
      <TagStatus status={tag.getDisplayLastTagActionType()} />
    )
  }

  return (
    <>
      <Box marginBottom="49px" marginTop="15px">
        <SearchTextField
          placeholder="Search Tag ID.."
          value={filter.searchQuery}
          searchFieldWidth="617px" 
          onTextChange={(text) => {
            const newFilter = {...filter, searchQuery: text, page:0}
            Navigation.toTags({router:props.router,toBeReplaced:false,queryParams:newFilter})
          }} 
          onSelectSearchResult={setOnSelectSearchResult} 
        />
      </Box>
      <Box
        className="tagsListing"
        sx={{
          background: "#fff",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
          borderRadius: "20px",
          padding: "38px 0 10px",
        }}
      >
        <Box
          className="BoxHeader"
          marginBottom="15px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "600",
              fontSize: "36px",
              color: "#171B1E",
              padding: "0 32px",
            }}
          >
            {Strings.TAGS_LIST_HEADER_TITLE}
          </Typography>
          <Box
            className="pageAction"
            marginRight="32px"
            display="flex"
            gap="25px"
          >
            <TagTypeFilter
                selectedNames={filter.tagTypes} 
                onSelectedItem={(tagTypes) => {
                  console.log('selected tagTypes :'+tagTypes)
                }} 
                onApplyClicked={((tagTypes) => {
                  upFilter("tagTypes",tagTypes)
                })}
                onResetClicked={((tagTypes) => {
                  upFilter("tagTypes",tagTypes)
                })}
              />
          </Box>
        </Box>
        <Box className="listingTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Strings.TBL_HEADER_TAG_ID}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_TAG_TYPE}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_TOTAL_WEIGHT}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_LAST_SCANNED_ON}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_LAST_SCANNED_AT}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_STATUS}</TableCell>
                  <TableCell width="200">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tagList.tags.length > 0 ? (
                  tagList.tags.map((tag, index) => (
                    <TableRow key={tag.id.toString()}>
                      <TableCell>{tag.tagCode}</TableCell>
                      <TableCell>{tag.tagAllocationType}</TableCell>
                      <TableCell>{`${TextUtils.displayWeight(tag.totalWeight)}`}</TableCell>
                      <TableCell>{tag.lastTrackingItem ? tag.lastTrackingItem.displayScannedAtDate() : ''}</TableCell>
                      <TableCell>{tag.lastTrackingItem ? tag.lastTrackingItem.displayLocationTitle() : ''}</TableCell>
                      <TableCell>{renderTagStatus(tag)}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewTag(props.router, tag.id);
                            }}
                            color="inherit"
                            sx={{ cursor: "pointer" }}
                          >
                            {Strings.TBL_VIEW_LINK_TITLE}
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <LoaderWithRecords colSpanValue={7} loaderValue={isLoading} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <PaginationBox
        perPageRecords={tagList.perPageItems}
        currentPage={filter.page}
        currentPageItems={tagList.currentPageItems}
        totalRecordsCount={tagList.totalItems}
        totalPagesCount={tagList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </>
  );
}
export default withRouter(Tags);
