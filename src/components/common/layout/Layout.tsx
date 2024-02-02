import { Box } from "@mui/material";
import Header from "../header/Header";
import Footer from "../footer/Footer";

function Layout({ router, children }: any) {
    return (
        <Box className="coreWarpper" sx={{}}>
            <Header router={router}/>
            <Box className="contentWarpper" sx={{ minHeight:"calc(100vh - 196px)", background: "#F5F5F5", padding: "30px 51px 0 51px",
            margin:"0 auto",
            maxWidth:"1920px",
            width:"100%",
             }}>
                {children}
            </Box>
            <Footer />
        </Box>
    )
}
export default Layout;