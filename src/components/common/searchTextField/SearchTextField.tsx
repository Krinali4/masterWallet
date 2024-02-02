import * as React from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import "./SearchTextField.scss";
import {
  Box,
  InputAdornment,
  Link,
} from "@mui/material";
import { InputField } from "../inputfield/inputField";
import SearchIcon from "@mui/icons-material/Search";
interface Iprops {
  placeholder?: string;
  value?: any;
  searchResults?: any[];
  onTextChange(text: string): void;
  onSelectSearchResult:any;
  searchFieldWidth?: string;
  children?: React.ReactNode;
}

export default function SearchTextField(props: Iprops) {
  const { searchFieldWidth = "100%" } = props;
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(props.value);
  const handleChange = (e: any) => {  
    setText(e.target.value);
    props.onTextChange(e.target.value);
  };
  const handleClickAway = () => {
    setOpen(false);
  };

 const onSelectedSerach = (searchResults:any)=> {
    props.onSelectSearchResult(searchResults)
    setOpen(false); 
    setText(searchResults.name)

 }
 React.useEffect(() => {
    setText(props.onSelectSearchResult)
 }, []);
  return (
    <Box className="searchTextField" maxWidth={searchFieldWidth}>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handleClickAway}
      >
        <Box sx={{ position: "relative" }}>
          <InputField
            value={text}
            placeholder={props?.placeholder}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                props.onTextChange(e.target.value);
              }
           }}
          />
          {open ? (
            <Box className="SearchDropDownData">
              {props.searchResults
                .filter((data: any) => data.name.toLowerCase().includes(text))
                .map((searchResults: any, index: number) => {
                  return <Link onClick={()=>onSelectedSerach(searchResults)} color="inherit">{searchResults.name}</Link>;
                })}
            </Box>
          ) : null}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}
