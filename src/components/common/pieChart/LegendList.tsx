import { Box } from "@mui/material";
import { IMaterial } from "../../../core/models/Material";
import LegendItem from './LegendItem';

interface ILegendListProps {
    data: IMaterial[]
}

export default function LegendList(props: ILegendListProps) {
    
    const colorsArray = [
        "#384B2A",
        "#ADCA98",
        "#EBF9E1",
        "#A9A9A9",
        "#D9D9D9",
        "#FFFFFF",
        "#B4C8A6",
        "#669544",
        "#A1B095",
        "#627952",
        "#384B2A",
        "#ADCA98",
        "#EBF9E1",
        "#A9A9A9",
        "#D9D9D9",
        "#FFFFFF",
        "#B4C8A6",
        "#669544",
        "#A1B095",
        "#627952",
        "#384B2A",
        "#ADCA98",
        "#EBF9E1",
        "#A9A9A9",
        "#D9D9D9",
        "#FFFFFF",
        "#B4C8A6",
        "#669544",
        "#A1B095",
        "#627952",
        "#384B2A",
        "#ADCA98",
        "#EBF9E1",
        "#A9A9A9",
        "#D9D9D9",
        "#FFFFFF",
        "#B4C8A6",
        "#669544",
        "#A1B095",
        "#627952",
        "#384B2A",
        "#ADCA98",
        "#EBF9E1",
        "#A9A9A9",
        "#D9D9D9",
        "#FFFFFF",
        "#B4C8A6",
        "#669544",
        "#A1B095",
        "#627952"
    ]
    
    return(
        <Box sx={{marginBottom:"10px"}}>
            {props.data.map((data, i) => { 
                return <LegendItem title={`${data.name} (${data.percentage}%)`} color={colorsArray[i]} />;
            })}
        </Box>
    )
}