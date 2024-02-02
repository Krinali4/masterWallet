import React, { Component } from 'react';
import { Box, Typography } from "@mui/material";
import "./UploadImage.scss";
import CancelIcon from '@mui/icons-material/Cancel';
import UploadImg from "../../../statics/svgs/UploadImg.svg"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
interface IProps {
    imageUrl?: string | undefined | any;
    setSelectedFile?: React.Dispatch<any>;
    selectedFile?: any;
    setError?: React.Dispatch<React.SetStateAction<string>>;
    setImageUrl?: React.Dispatch<React.SetStateAction<string>>
    imageTitle?: string;
    error?: string;
    boxWidth?: string;
    boxHeight?: string;
    isEditable: boolean
}

export class UploadImage extends Component<IProps> {

    state = {
        profileImg: UploadImg,
        flag: true,
        minSize: 31000,
        maxSize: 1000000,
        imgUrl: "",
    }
    imageHandler = (e: any) => {

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                this.setState({ profileImg: reader.result, flag: true })
            }
        }
        if (e.target.files[0].type == "image/png" || e.target.files[0].type == "image/jpeg" && (
            this.state.minSize < e.target.files[0].size && this.state.maxSize > e.target.files[0].size
        )) {
            this.props.setSelectedFile(e.target.files[0]);
            reader.readAsDataURL(e.target.files[0]);
            this.props.setError("");
        }
        else if (this.state.minSize > e.target.files[0].size || this.state.maxSize < e.target.files[0].size) {
            this.props.setError("Should be at least 200 x 200 pixels and below 1 MB");
        }
        else {
            this.props.setError("Image should be png or jpg format")
        }
    };

    delete = (e: any): void => {
        this.setState({
            profileImg: UploadImg, flag: false,
            imgUrl: "",
        });
        this.props.setSelectedFile(null);
        this.props.setImageUrl("");
        this.props.setError("");
    };

    componentDidMount() {
        if (!this.props.imageUrl || (this.props.imageUrl && this.props.imageUrl.length <= 0)) {
            this.setState({
                flag: false
            })
        }
        this.setState({
            imgUrl: this.props.imageUrl
        })
    }
    render() {

        const { profileImg } = this.state;
        let imgSrcUrl = profileImg
        if(this.props.imageUrl && this.props.imageUrl.length > 0) {
            imgSrcUrl = this.props.imageUrl
        }
        let sImageUrl = this.state.imgUrl
        if(!sImageUrl) {
            sImageUrl = ''
        }
        //{!((this.props.imageUrl && this.props.imageUrl.length > 0)) ? profileImg : this.props.imageUrl}
        return (
            <Box>
                <Box className="uploadImageBox" width={this.props?.boxWidth} height={this.props?.boxHeight}>
                    <Box className={this.state.flag ? "imgHolderActive" : "imgHolder"}>
                        {this.state.flag && this.props.isEditable && <CancelIcon className='deleteIcon' onClick={this.delete} />}
                        <img src={imgSrcUrl} alt="logo" id="uploadedImage" className="uploadedImage" />
                        <Typography>
                            {this.props.selectedFile == null && sImageUrl.length == 0 && this.props?.imageTitle}
                        </Typography>
                    </Box>
                    <input type="file" disabled={!this.props.isEditable} accept="image/png , image/jpeg" name="image-upload" id="input" onChange={this.imageHandler} />

                </Box>
                {this.props.error.length > 0 &&
                    <Box className="imgError">
                        <Typography><FiberManualRecordIcon  /> {this.props.error}</Typography>
                    </Box>}
                {this.props.isEditable && <Box className="imgGuideLine">
                    <Typography><FiberManualRecordIcon  /> Image should be in transparent PNG or JPG format.</Typography>
                    <Typography><FiberManualRecordIcon  /> Should have roughly square proportions.</Typography>
                    <Typography><FiberManualRecordIcon  /> Should be at least 200 x 200 pixels and below 1 MB</Typography>
                </Box>}
            </Box>)
    }
}

export default UploadImage;