import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-3";
import { IMaterial } from "../../../core/models/Material";
interface Iprops {
    data: IMaterial[]
    contant: boolean
}
export default function DoughnutPiechart(props: Iprops) {

    const [listOfLabel, setListOfLabel] = useState(null);
    const [listOfPercentage, setListOfPercentage] = useState(null);

    useEffect(() => {
        if (props.data.length > 0) {
            let labels = props.data.map(data => { 
                return data.name+" ("+data.percentage +'%' +')';
            } );
            setListOfLabel(labels);
            let percentages = props.data.map(data => data.percentage);
            setListOfPercentage(percentages);
        }
    }, [])

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

    const DoughData = {
        labels: listOfLabel,
        datasets: [
            {
                data: listOfPercentage,
                borderWidth: 0,
                borderColor:"#4C7B29",
                backgroundColor: colorsArray,
                hoverBackgroundColor: colorsArray
            }
        ]
    };

    const options = {
        cutoutPercentage: 77,
        legend: {
            display: false,
            position: "right",
            labels: {
                "boxWidth":8,
                "fontColor": "rgb(255,255,255)",
                "fontSize": 14,
                "fontFamily": "Montserrat",
                "usePointStyle": true,
            },
        },
       
    };

    return (
        <Doughnut width={167} height={167} data={DoughData} options={options} />
    );
}
