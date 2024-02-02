import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { InverseBtnDropDown } from "../customDropDown/filterDropdown/InverseBtnDropDown"
import arrowDownIcon from "../../../statics/svgs/arrowDownIcon.svg"
import Customer from "../../../statics/svgs/Customer.svg"
import FilterDropDownItemList from "../../../core/models/FilterDropDownItemList"
import FilterDropDownItem from "../../../core/models/FilterDropDownItem"
import PartnerService from '../../../services/PartnerService';
import PartnerList from '../../../core/models/PartnerList';
import { ApiError } from '../../../core/webservice/ApiError';

interface IClientsFilterProps {
  selectedIDs?: number[]
  onSelectedItem(clientIds: number[]): void
  onResetClicked(clientIds: number[]): void
  onApplyClicked(clientIds: number[]): void
}

function ClientsFilter(props: IClientsFilterProps) {
  const { selectedIDs = [] } = props
  const [partnerFilterList, setPartnersFilterList] = useState<FilterDropDownItemList>(FilterDropDownItemList.defaultList())
  const [tmpPartnerFilterList, setTmpPartnersFilterList] = useState<FilterDropDownItemList>(FilterDropDownItemList.defaultList())
  
  useEffect(() => {
    fetchPartnerList()
  }, [])

  const fetchPartnerList = () => {
    PartnerService.getClientsFiltersList()
    .then((resultList: PartnerList) => {
        const finalList = FilterDropDownItemList.initWithClientList(resultList,selectedIDs)
        setPartnersFilterList(finalList)
        setTmpPartnersFilterList(finalList)
    })
    .catch((apiError: ApiError) => {
        console.log(JSON.stringify(apiError.message))
    })
  }

  const handleOnPartnerFilterItemSelected = (
    selectedItem: FilterDropDownItem
  ) => {
    tmpPartnerFilterList.onDropDownItemSelected(selectedItem)
    const newPartnerList = Object.assign(
      new FilterDropDownItemList(),
      tmpPartnerFilterList
    )
    const ids = newPartnerList.selectedIDs()
    setTmpPartnersFilterList(newPartnerList)
    props.onSelectedItem(ids)
  }

  const handleOnResetClicked = () => {
      const partnerList = tmpPartnerFilterList.resetClientList() 
      const newAccList = Object.assign(
        new FilterDropDownItemList(),
        partnerList
      )
      setPartnersFilterList(newAccList)
      setTmpPartnersFilterList(newAccList)
      props.onResetClicked([])
  }

  const handleOnCloseClicked = () => {
    const newPartnerList = Object.assign(
      new FilterDropDownItemList(),
      partnerFilterList
    )
    setTmpPartnersFilterList(newPartnerList) // reset to original
  }

  const handleOnApplyClicked = () => {
    const ids = tmpPartnerFilterList.selectedIDs()
    const newAccList = Object.assign(
      new FilterDropDownItemList(),
      tmpPartnerFilterList
    )
    setPartnersFilterList(newAccList) // temp to original merge
    props.onApplyClicked(ids)
  }

  return (
    <Box>
      <InverseBtnDropDown
        buttonWidth="196px"
        label="Clients"
        endIcons={arrowDownIcon}
        startIcons={Customer}
        data={[]}
        filterList={partnerFilterList}
        itemSelected={[]}
        noRecordLabel="No Client Data"
        onFilterItemSelected={handleOnPartnerFilterItemSelected}
        onResetClicked={handleOnResetClicked}
        onCloseClicked={handleOnCloseClicked}
        onApplyClicked={handleOnApplyClicked}
      />
    </Box>
  )
}
export default ClientsFilter
