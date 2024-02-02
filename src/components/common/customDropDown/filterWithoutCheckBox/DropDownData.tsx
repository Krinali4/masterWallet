import * as React from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import "./FilterDropdown.scss";
import { Typography } from '@mui/material';


interface Iprops {
  data?: string[],
  children?: React.ReactNode,
  setDropdownActive?: React.Dispatch<React.SetStateAction<boolean>>
  dropdownActive?: boolean,
  onSelectedValue?: React.Dispatch<React.SetStateAction<string>>,
}

export default function DropDownData(props: Iprops) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
    props.setDropdownActive(!props.dropdownActive)
  };

  const handleClickAway = () => {
    setOpen(false);
    props.setDropdownActive(false);
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <Box sx={{ position: 'relative' }}>
        <Box onClick={handleClick}>
          {props.children}
        </Box>
        {open ? (
          <Box className="DropDownData">
            {props?.data == undefined || props?.data.length == 0 ?
              <Typography className='noRecordData'>
                No data found .
              </Typography>
              :
              <Box className='filterCheckBox'>
                {props?.data.map((data, index) => {
                  return <Typography key={index} margin="10px 0" onClick={() => {
                    props.onSelectedValue(data)
                  }}>{data}</Typography>
                })
                }
              </Box>
            }
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
}
