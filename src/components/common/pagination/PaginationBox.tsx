
import { Box, Typography } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import React from 'react';
import "./PaginationBox.scss";

interface IProps {
  perPageRecords: number
  currentPage: number
  currentPageItems: number
  totalRecordsCount: number
  totalPagesCount: number
  isDataLoading?: boolean
  onPageSelected(page: number): void
}

export default function PaginationBox(props: IProps) {
  const {perPageRecords,currentPage,currentPageItems,totalRecordsCount,totalPagesCount,isDataLoading = false,onPageSelected} = props
  const sCurrentPage = currentPage
  const startOffset = (sCurrentPage * perPageRecords) + 1
  const endOffset = (startOffset - 1) + currentPageItems
  let showingDetails = 'No entries available'
  if(totalRecordsCount !== 0) {
    showingDetails = `Showing ${startOffset} to ${endOffset} of ${totalRecordsCount} enteries`
  }

  // if(isDataLoading) return null

  if(currentPage == 0 && currentPageItems <= 0) {
      return null
  }
  
  return (
    <>
        <Box className="paginationBox" sx={{ display: "flex", gap: "25px", justifyContent: "flex-end", padding: "41px 0", background: "#F5F5F5" }}>
            <Typography sx={{
                marginRight: "18px",
                display: "flex",
                fontSize: "16px",
                lineHeight: "20px",
                color: "#171B1E",
                fontWeight: 400,
                justifyContent: "center",
                alignItems: "center"
            }}>
                {showingDetails}
            </Typography>
            <Pagination 
            count={totalPagesCount} 
            page={currentPage+1}
             onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              onPageSelected(value-1)
            }}/>
        </Box>
    </>
  )
}


