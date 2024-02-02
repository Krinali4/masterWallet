import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import arrowDownIcon from "../../../statics/svgs/arrowDownIcon.svg"
import buyer from "../../../statics/svgs/buyer.svg"
import { InverseBtnDropDown } from "../customDropDown/filterDropdown/InverseBtnDropDown"
import FilterDropDownItemList from "../../../core/models/FilterDropDownItemList"
import FilterDropDownItem from "../../../core/models/FilterDropDownItem"
import AccountService from '../../../services/AccountService';
import AccountList from '../../../core/models/AccountList';
import { ApiError } from "../../../core/webservice/ApiError"

interface IAccountsFilterProps {
  selectedIDs?: number[]
  onSelectedItem(accountIds: number[]): void
  onResetClicked(accountIds: number[]): void
  onApplyClicked(accountIds: number[]): void
}

function AccountsFilter(props: IAccountsFilterProps) {
  const { selectedIDs = [] } = props
  const [accountsFilterList, setAccountsFilterList] =
    useState<FilterDropDownItemList>(FilterDropDownItemList.defaultList())
  const [tmpAccountsFilterList, setTmpAccountsFilterList] =
    useState<FilterDropDownItemList>(FilterDropDownItemList.defaultList())

  useEffect(() => {
    fetchAccountList()
  }, [])

  const fetchAccountList = () => {
    AccountService.getAccountFiltersList()
    .then((resultList: AccountList) => {
        const finalList = FilterDropDownItemList.initWithAccountList(resultList,selectedIDs)
        setAccountsFilterList(finalList)
        setTmpAccountsFilterList(finalList)
    })
    .catch((apiError: ApiError) => {
        console.log(JSON.stringify(apiError.message))
    })
  }

  const handleOnAccountFilterItemSelected = (
    selectedItem: FilterDropDownItem
  ) => {
    tmpAccountsFilterList.onDropDownItemSelected(selectedItem)
    const newAccList = Object.assign(
      new FilterDropDownItemList(),
      tmpAccountsFilterList
    )
    const ids = newAccList.selectedIDs()
    setTmpAccountsFilterList(newAccList)
    props.onSelectedItem(ids)
  }

  const handleOnResetClicked = () => {
      const accList = tmpAccountsFilterList.resetAccountList() 
      const newAccList = Object.assign(
        new FilterDropDownItemList(),
        accList
      )
      setAccountsFilterList(newAccList)
      setTmpAccountsFilterList(newAccList)
      props.onResetClicked([])
  }

  const handleOnCloseClicked = () => {
    const newAccList = Object.assign(
      new FilterDropDownItemList(),
      accountsFilterList
    )
    setTmpAccountsFilterList(newAccList) // reset to original
  }

  const handleOnApplyClicked = () => {
    const ids = tmpAccountsFilterList.selectedIDs()
    const newAccList = Object.assign(
      new FilterDropDownItemList(),
      tmpAccountsFilterList
    )
    setAccountsFilterList(newAccList) // temp to original merge
    props.onApplyClicked(ids)
  }

  return (
    <Box>
      <InverseBtnDropDown
        buttonWidth="196px"
        label="Accounts"
        endIcons={arrowDownIcon}
        startIcons={buyer}
        noRecordLabel="No Account Data"
        data={[]}
        filterList={tmpAccountsFilterList}
        itemSelected={[]}
        onFilterItemSelected={handleOnAccountFilterItemSelected}
        onResetClicked={handleOnResetClicked}
        onCloseClicked={handleOnCloseClicked}
        onApplyClicked={handleOnApplyClicked}
      />
    </Box>
  )
}
export default AccountsFilter
