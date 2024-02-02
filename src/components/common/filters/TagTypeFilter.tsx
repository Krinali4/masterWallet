import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import arrowDownIcon from "../../../statics/svgs/arrowDownIcon.svg"
import LocationIcon from "../../../statics/svgs/LocationIcon.svg"
import FilterDropDownItemList from "../../../core/models/FilterDropDownItemList"
import FilterDropDownItem from "../../../core/models/FilterDropDownItem"
import { InverseBtnDropDown } from "../customDropDown/filterDropdown/InverseBtnDropDown"
interface ITagTypeFilterProps {
  selectedNames?: string[]
  onSelectedItem(tagTypes: string[]): void
  onResetClicked(tagTypes: string[]): void
  onApplyClicked(tagTypes: string[]): void
}

function TagTypeFilter(props: ITagTypeFilterProps) {
  const { selectedNames = [] } = props
  const [tagTypesFilterList, setTagTypesFilterList] =
    useState<FilterDropDownItemList>(
      FilterDropDownItemList.defaultList()
    )
    const [tmpTagTypesFilterList, setTmpTagTypesFilterList] =
    useState<FilterDropDownItemList>(
      FilterDropDownItemList.defaultList()
    )

  useEffect(() => {
    fetchLocationList()
  }, [])

  const fetchLocationList = () => {
    setTimeout(() => {
        const finalList = FilterDropDownItemList.initWithTagTypes(selectedNames)
        setTagTypesFilterList(finalList)
        setTmpTagTypesFilterList(finalList)
    },500)
  }

  const handleOnTagTypeFilterItemSelected = (
    selectedItem: FilterDropDownItem
  ) => {
    tmpTagTypesFilterList.onDropDownItemSelected(selectedItem)
    const newTagTypeList = Object.assign(
      new FilterDropDownItemList(),
      tmpTagTypesFilterList
    )
    const names = newTagTypeList.selectedNames()
    setTmpTagTypesFilterList(newTagTypeList)
    props.onSelectedItem(names)
  }

  const handleOnResetClicked = () => {
      const tagTypeList = tmpTagTypesFilterList.resetTagTypeList() 
      const newTagTypeList = Object.assign(
        new FilterDropDownItemList(),
        tagTypeList
      )
      setTagTypesFilterList(newTagTypeList)
      setTmpTagTypesFilterList(newTagTypeList)
      props.onResetClicked([])
  }

  const handleOnCloseClicked = () => {
    const newTagTypeList = Object.assign(
      new FilterDropDownItemList(),
      tagTypesFilterList
    )
    setTmpTagTypesFilterList(newTagTypeList) // reset to original
  }

  const handleOnApplyClicked = () => {
    const names = tmpTagTypesFilterList.selectedNames()
    const newTagTypeList = Object.assign(
      new FilterDropDownItemList(),
      tmpTagTypesFilterList
    )
    setTagTypesFilterList(newTagTypeList) // temp to original merge
    props.onApplyClicked(names)
  }

  return (<Box>
    <InverseBtnDropDown
        buttonWidth="196px"
        endIcons={arrowDownIcon}
        label="Tag Type"
        startIcons={LocationIcon}
        noRecordLabel=""
        data={[]}
        filterList={tagTypesFilterList}
        itemSelected={[]}
        onFilterItemSelected={handleOnTagTypeFilterItemSelected}
        onResetClicked={handleOnResetClicked}
        onCloseClicked={handleOnCloseClicked}
        onApplyClicked={handleOnApplyClicked}
      /> 
  </Box>)
}
export default TagTypeFilter
