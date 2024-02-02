import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import arrowDownIcon from "../../../statics/svgs/arrowDownIcon.svg"
import LocationIcon from "../../../statics/svgs/LocationIcon.svg"
import FilterDropDownItemList from "../../../core/models/FilterDropDownItemList"
import FilterDropDownItem from "../../../core/models/FilterDropDownItem"
import { InverseBtnDropDown } from "../customDropDown/filterDropdown/InverseBtnDropDown"
import LocationService from "../../../services/LocationService"
import LocationList from "../../../core/models/LocationList"
import { ApiError } from '../../../core/webservice/ApiError';

interface ILocationsFilterProps {
  selectedIDs?: number[]
  onSelectedItem(locationIds: number[]): void
  onResetClicked(locationIds: number[]): void
  onApplyClicked(locationIds: number[]): void
}

function LocationsFilter(props: ILocationsFilterProps) {
  const { selectedIDs = [] } = props
  const [locationFilterList, setLocationsFilterList] =
    useState<FilterDropDownItemList>(
      FilterDropDownItemList.defaultList()
    )
    const [tmpLocationFilterList, setTmpLocationsFilterList] =
    useState<FilterDropDownItemList>(
      FilterDropDownItemList.defaultList()
    )

  useEffect(() => {
    fetchLocationList()
  }, [])

  const fetchLocationList = () => {
    LocationService.getLocationFiltersList()
    .then((resultList: LocationList) => {
        const finalList = FilterDropDownItemList.initWithLocationList(resultList,selectedIDs)
        setLocationsFilterList(finalList)
        setTmpLocationsFilterList(finalList)
    })
    .catch((apiError: ApiError) => {
        console.log(JSON.stringify(apiError.message))
    })
  }

  const handleOnLocationFilterItemSelected = (
    selectedItem: FilterDropDownItem
  ) => {
    tmpLocationFilterList.onDropDownItemSelected(selectedItem)
    const newPartnerList = Object.assign(
      new FilterDropDownItemList(),
      tmpLocationFilterList
    )
    const ids = newPartnerList.selectedIDs()
    setTmpLocationsFilterList(newPartnerList)
    props.onSelectedItem(ids)
  }

  const handleOnResetClicked = () => {
      const locList = tmpLocationFilterList.resetLocationList() 
      const newLocList = Object.assign(
        new FilterDropDownItemList(),
        locList
      )
      setLocationsFilterList(newLocList)
      setTmpLocationsFilterList(newLocList)
      props.onResetClicked([])
  }

  const handleOnCloseClicked = () => {
    const newLocList = Object.assign(
      new FilterDropDownItemList(),
      locationFilterList
    )
    setTmpLocationsFilterList(newLocList) // reset to original
  }

  const handleOnApplyClicked = () => {
    const ids = tmpLocationFilterList.selectedIDs()
    const newLocList = Object.assign(
      new FilterDropDownItemList(),
      tmpLocationFilterList
    )
    setLocationsFilterList(newLocList) // temp to original merge
    props.onApplyClicked(ids)
  }

  return (<Box>
    <InverseBtnDropDown
        buttonWidth="196px"
        endIcons={arrowDownIcon}
        label="Locations"
        startIcons={LocationIcon}
        noRecordLabel="No Location Data"
        data={[]}
        filterList={locationFilterList}
        itemSelected={[]}
        onFilterItemSelected={handleOnLocationFilterItemSelected}
        onResetClicked={handleOnResetClicked}
        onCloseClicked={handleOnCloseClicked}
        onApplyClicked={handleOnApplyClicked}
      /> 
  </Box>)
}
export default LocationsFilter
