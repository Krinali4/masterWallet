import { Typography, ButtonBase, Box } from "@mui/material"
import rewastelogo from "../../../statics/svgs/rewastelogo.svg"
import LogOut from "../../../statics/svgs/LogOut.svg"
import "./Header.scss"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import UserManager from "../../../core/utils/UserManager"
import { useState, useEffect } from "react"
import {
  MenuItem,
  getMenuItemsByRole,
  getCurrentMenuItemsByRole,
} from "../../../core/models/MenuItem"
import Navigation from "../../../navigation/Navigation"
import { getSettingsMenuItemsByRole } from "../../../core/models/MenuItem"

function Header(props: any) {
  const arrOfMenuItems = getMenuItemsByRole(UserManager.shared().user)
  const arrOfSettingsMenuItems = getSettingsMenuItemsByRole(
    UserManager.shared().user
  )
  const sSelectedItem = getCurrentMenuItemsByRole(
    props.router.location.pathname,
    UserManager.shared().user
  )
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    sSelectedItem ? sSelectedItem : arrOfMenuItems[0]
  )

  useEffect(() => {
    setSelectedMenuItem(sSelectedItem ? sSelectedItem : arrOfMenuItems[0])
  }, [sSelectedItem])

  const [subMenuClose, setSubMenuClose] = useState(false);
  const handleOnMenuItemClicked = (selectedItem: MenuItem) => {
    setSelectedMenuItem(selectedItem);
    setSubMenuClose(true);
    setTimeout(() => {
        setSubMenuClose(false);
      },100)
    Navigation.toMenuItem(props.router, selectedItem)
  }

  const handleOnLogoutClicked = () => {
    Navigation.logOut(props.router)
    props.onLogoutSuccess()
  }

  const renderSettingsMenuItems = (menuItem: string) => {
    if (arrOfSettingsMenuItems.length === 0) return null
    const isSettingsSelected = ([
      MenuItem.CLIENTS,
      MenuItem.ACCOUNTS,
      MenuItem.LOCATIONS,
      MenuItem.USERS,
      MenuItem.MATERIALS
    ].includes(selectedMenuItem)) ? true : false
    return (
      <ButtonBase className="menuHasItems">
        <Typography className={`linkItem${isSettingsSelected ? " active" : ""}`}>
          {menuItem} <KeyboardArrowDownRoundedIcon />
        </Typography>
        <Box className="subMenuItems">
          <Box className="subMenuWarpper" display={subMenuClose && "none !important"}>
            {arrOfSettingsMenuItems.map((subMenuItem,index) => (
              <ButtonBase
                key={`sub_menu_item_${index.toString()}`} 
                onClick={() => {
                  handleOnMenuItemClicked(subMenuItem)
                }}
              >
                <Typography className={`subLinkItem${
                  selectedMenuItem === subMenuItem ? " active" : ""
                }`}>{subMenuItem}</Typography>
              </ButtonBase>
            ))}
          </Box>
        </Box>
      </ButtonBase>
    )
  }

  const renderMenuItems = () => {
    return (
      <Box
        className="navigationBar"
        sx={{
          display: "flex",
          gap: "60px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {arrOfMenuItems.map((menuItem, index) =>
          menuItem === MenuItem.SETTINGS ? (
            renderSettingsMenuItems(menuItem)
          ) : (
            <ButtonBase
              key={`header_menu_item_${index.toString()}`}
              onClick={() => {
                handleOnMenuItemClicked(menuItem)
              }}
            >
              <Typography
                className={`linkItem${
                  selectedMenuItem === menuItem ? " active" : ""
                }`}
              >
                {menuItem}
              </Typography>
            </ButtonBase>
          )
        )}
      </Box>
    )
  }

  return (
    <Box
      className="header"
      sx={{
        borderRadius: "2px",
        position: "sticky",
        top: "0",
        zIndex: "99",
        background: "#FBFBFB",
        width: "100%",
        height: "100px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #EEEEEE",
        alignItems: "center",
        padding: "0 51px",
      }}
    >
      <Box className="logoBox">
        <img src={rewastelogo} width="144px" height="66px" alt="Rewaste logo" />
      </Box>
      {renderMenuItems()}
      {/* <Box className="navigationBar" sx={{ display: "flex", gap: "60px", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography className="linkItem active">
                        Home
                    </Typography>
                </Box>
                <Box>
                    <Typography className="linkItem">
                        Locations
                    </Typography>
                </Box>
                <Box>
                    <Typography className="linkItem">
                        Users
                    </Typography>
                </Box>
            </Box> */}

      <Box
        className="logOutBox"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => {
          handleOnLogoutClicked()
        }}
      >
        <img src={LogOut} width="25px" height="30px" alt="logout" />
      </Box>
    </Box>
  )
}
export default Header
