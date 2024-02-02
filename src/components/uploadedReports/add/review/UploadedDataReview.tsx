import { Box, Link, Typography } from "@mui/material";
import Navigation from "../../../../navigation/Navigation";
import {
  NavigationProps,
  NavigationState,
} from "../../../../navigation/Navigation.types";
import withRouter from "../../../../withRouter";
import { InverseBtn } from "../../../common/button/InverseBtn";
import { PrimaryBtn } from "../../../common/button/PrimaryBtn";
import PageHeading from "../../../common/pageHeading/PageHeading";
import ReportDetailTable from "./ReportDetailTable";
import Strings from "../../../../core/utils/Strings";
import { IUploadBatch } from "../../../../core/models/UploadBatch";
import UploadDataService from "../../../../services/UploadDataService";
import { useEffect, useState } from "react";
import { ApiError } from "../../../../core/webservice/ApiError";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import "./review.scss";
import UploadBatch from "../../../../core/models/UploadBatch";
import MaterialList from "../../../../core/models/MaterialList";
import MaterialService from "../../../../services/MaterialService";
import Loader from "../../../common/loader/Loader";

interface IProps {
  router: NavigationProps;
  states: NavigationState;
}

function UploadedDataReview(props: IProps) {
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadBatch, setUploadBatch] = useState<IUploadBatch | undefined>(
    undefined
  );

  const [materialList, setMaterialList] = useState<MaterialList>(
    MaterialList.default()
  );

  useEffect(() => {
    const dataObj = props.router.location.state as IUploadBatch;
    if (dataObj) {
      fetchAllMaterialList(dataObj);
    } else {
      Navigation.toHome(props.router);
    }
  }, []);

  const fetchAllMaterialList = (uploadBatch: IUploadBatch) => {
    if (isDataLoading) return;
    setIsDataLoading(true);
    MaterialService.getAllMaterialList()
      .then((mList: MaterialList) => {
        setIsDataLoading(false);
        setMaterialList(mList);
        const result = MaterialList.filterMaterialList(
          uploadBatch.allExcelMaterialList,
          mList
        );
        const finalMaterialList = result.materialList;
        const unknownMaterialList = result.unknownMaterialList;
        let newUploadBatch = { ...uploadBatch };
        newUploadBatch.materialList = finalMaterialList.getUploadMaterialList();
        newUploadBatch.unknownMaterialList = unknownMaterialList;
        setUploadBatch(newUploadBatch);
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false);
        console.log(apiError.message);
      });
  };

  const handleUploadData = (e: any) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    UploadDataService.uploadData(uploadBatch)
      .then((isSuccess: any) => {
        console.log("uploadData =>>SUCCESS");
        setLoading(false);
        Navigation.toUploadedReportComplete(props.router);
      })
      .catch((apiError: ApiError) => {
        setLoading(false);
        console.log(apiError.message);
      });
  };

  const handleCancelClicked = (e: any) => {
    e.preventDefault();
    Navigation.back(props.router);
  };

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />;
  }

  if (!uploadBatch) return null;

  const unknownMaterialNames = UploadBatch.unknowMaterialNames(
    uploadBatch.unknownMaterialList
  );

  return (
    <>
      <Box
        className="BoxHeader"
        marginBottom="45px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <PageHeading
          backArrow={true}
          heading=" Report Details"
          onClick={() => {
            Navigation.back(props.router);
          }}
        />
      </Box>
      <Box margin="0 auto" width="100%" maxWidth="568px">
        <Box
          width="100%"
          sx={{
            background: "#fff",
            padding: "25px 0",
            boxShadow: " 0px 4px 4px rgba(0, 0, 0, 0.04)",
            borderRadius: "20px",
          }}
        >
          <ReportDetailTable data={uploadBatch.materialList} />
        </Box>
        {unknownMaterialNames && (
          <Box className="reviewMaterialPoints">
            <Typography>
              <FiberManualRecordIcon />
              {`New materials <${unknownMaterialNames}> found in the file.`}{" "}
            </Typography>
            {
              <Typography>
                <FiberManualRecordIcon />
                Please{" "}
                <Link
                  color="inherit"
                  onClick={() => {
                    Navigation.toAddNewMaterial({ router: props.router });
                  }}
                >
                  Add
                </Link>{" "}
                these Materials to continue with data upload for these
                materials.
              </Typography>
            }
            <Typography>
              <FiberManualRecordIcon />
              Click on <b>Save</b> to continue only with existing materials.
            </Typography>
          </Box>
        )}
        <Box display="flex" gap="30px" marginTop="49px">
          <PrimaryBtn
            label="Save"
            onClick={(e: any) => {
              handleUploadData(e);
            }}
            loading={loading}
            buttonWidth="243px"
          />
          <InverseBtn
            label={Strings.CANCEL}
            buttonWidth="243px"
            onClick={(e: any) => {
              handleCancelClicked(e);
            }}
          />
        </Box>
      </Box>
    </>
  );
}
export default withRouter(UploadedDataReview);
