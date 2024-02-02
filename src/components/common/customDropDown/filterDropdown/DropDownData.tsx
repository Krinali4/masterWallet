import * as React from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import "./FilterDropdown.scss";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { InputField } from "../../inputfield/inputField";
import SearchIcon from "@mui/icons-material/Search";
import FilterDropDownItem from "../../../../core/models/FilterDropDownItem";
import FilterDropDownItemList from "../../../../core/models/FilterDropDownItemList";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryBtn } from "../../button/PrimaryBtn";

interface Iprops {
  label?: string;
  data?: { id: string | number; name: string; isSelected: boolean }[] | [];
  filterList: FilterDropDownItemList;
  onFilterItemSelected(selectedItem: FilterDropDownItem): void;
  onItemSelected?: React.Dispatch<
    React.SetStateAction<
      { id: string | number; name: string; isSelected: boolean }[]
    >
  >;
  onTextSearched?: React.Dispatch<React.SetStateAction<string>>;
  children?: React.ReactNode;
  noRecordLabel?: string;
  onResetClicked?(): void;
  onCloseClicked?(): void;
  onApplyClicked?(): void;
}

export default function DropDownData(props: Iprops) {
  const { filterList, onResetClicked = ()=>{}, onCloseClicked = ()=>{}, onApplyClicked = ()=>{} } = props;

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
    onCloseClicked()
  };

  const handleChange = (selectedItem: FilterDropDownItem) => {
    props.onFilterItemSelected(selectedItem);
  };
  if (!filterList) return null;
  const dropDownItems = filterList.dropDownItems;

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <Box sx={{ position: "relative" }}>
        <Box onClick={handleClick}>{props.children}</Box>
        {open ? (
          <Box className="MultiDropDownData">
            <Box className="filterDropHeader">
              <Box
                className="filterAction"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Link
                  color="inherit"
                  onClick={() => {
                    onResetClicked();
                    setOpen(false);
                  }}
                >
                  Reset
                </Link>
                <Typography>{props.label}</Typography>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={() => {
                    onCloseClicked();
                    setOpen(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <InputField
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e: any) => {
                  setText(e.target.value);
                  props.onTextSearched(e.target.value);
                }}
              />
            </Box> 
            {dropDownItems == undefined || dropDownItems.length == 0 ? (
              <Typography className="noRecordData">
                {props.noRecordLabel}
              </Typography>
            ) : (
              <>
              <Box className="filterCheckBox">
                <FormGroup>
                  {dropDownItems
                    .filter((item: FilterDropDownItem) =>
                      item.name.toUpperCase().includes(text.toUpperCase())
                    )
                    .map((dItem: FilterDropDownItem, index: number) => {
                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={dItem.isSelected}
                              onChange={() => handleChange(dItem)}
                            />
                          }
                          label={dItem.name}
                        />
                      );
                    })}
                </FormGroup>
              </Box>
              <Box className="applyActionBtn">
                <PrimaryBtn label="Apply" onClick={(e: any) => {
                  onApplyClicked()
                  setOpen(false);
                }}/> 
              </Box>
              </>
            )}
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
}
