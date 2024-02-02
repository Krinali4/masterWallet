import "./FilterDropdown.scss";
import { Box, Button } from "@mui/material";
import DropDownData from "./DropDownData";
import FilterDropDownItemList from '../../../../core/models/FilterDropDownItemList';
import FilterDropDownItem from '../../../../core/models/FilterDropDownItem';
import TextUtils from "../../../../core/utils/TextUtils";
interface Iprops {
    startIcons?: any,
    label?: string,
    endIcons?: any,
    buttonWidth?: string,
    filterList?: FilterDropDownItemList
    data?: { id: string | number, name: string, isSelected: boolean }[] | [],
    onFilterItemSelected?(selectedItem: FilterDropDownItem): void
    onItemSelected?: React.Dispatch<React.SetStateAction<{ id: string | number; name: string; isSelected: boolean }[]>>
    onTextSearched?: React.Dispatch<React.SetStateAction<string>>
    itemSelected?: { id: string | number, name: string, isSelected: boolean }[] | [],
    noRecordLabel?:string,
    onResetClicked?():void
    onCloseClicked?():void
    onApplyClicked?(): void;
}
export const InverseBtnDropDown = (props: Iprops) => {

    const { filterList, onResetClicked = ()=>{}, onCloseClicked = ()=>{}, onApplyClicked = ()=>{} } = props

    const displayButtonTitle = () => {
        if(!props.filterList || !props.filterList?.dropDownItems) return props.label;
        const selectedFilterNames = props.filterList.selectedItemCommaSeparatedNames()
        if(TextUtils.isEmpty(selectedFilterNames)) return props.label
        return (
            <Box className="filterList">{selectedFilterNames}</Box>
        )
    }

    //                     {...props}

    return (
        <DropDownData
            label={props.label}
            filterList={filterList}
            data={props.data}
            onFilterItemSelected={props.onFilterItemSelected}
            onItemSelected={props.onItemSelected}
            onTextSearched={props.onTextSearched}
            noRecordLabel={props.noRecordLabel}
            onCloseClicked={onCloseClicked}
            onResetClicked={onResetClicked}
            onApplyClicked={onApplyClicked}
        >
            <Box width={props?.buttonWidth} display="flex" >
                <Button
                    variant="contained"
                    className="InverseBtnDropDown"
                    sx={{
                        fontSize: "16px",
                        color: "#4C7B29",
                        background: "#fff",
                        borderRadius: "50px",
                        border: "1px solid #4C7B29",
                        textTransform:"capitalize",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        fontWeight: "600",
                        lineHeight: "20px",
                        boxShadow: "none",
                        '&:hover': {
                            backgroundColor: '#fff',
                            color: '#4C7B29',
                        },
                        '&:focus': {
                            backgroundColor: '#fff',
                            color: '#4C7B29',
                        }
                    }}
                >
                    <Box display="flex" justifyContent={props?.startIcons && props?.endIcons ? "space-between" : "center"} width="100%">
                        {props?.startIcons && <img src={props?.startIcons} alt="Start icon"/>}
                        {displayButtonTitle()}
                        {props?.endIcons && <img src={props?.endIcons} alt="End icon"/>}
                    </Box>
                </Button>
            </Box>
        </DropDownData>
    );
};
