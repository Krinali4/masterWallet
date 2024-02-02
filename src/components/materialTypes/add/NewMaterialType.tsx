import { Box } from "@mui/material"
import ModalController from "../../common/modalController/ModalController"
import { useState } from "react"
import MaterialType, { IMaterialType } from "../../../core/models/MaterialType"
import { InputField } from "../../common/inputfield/inputField"
import TextUtils from "../../../core/utils/TextUtils"
import MaterialTypeService from "../../../services/MaterialTypeService"
import { ApiError } from "../../../core/webservice/ApiError"
import { showApiErrorMessage } from "../../common/customeToast/MessageNotifier"
import {useEffect} from 'react';

interface IMaterialTypeProps {
  show: boolean
  pMaterialType: MaterialType
  onSuccess(message: string): void
  onClose(): void
}

function NewMaterialType(props: IMaterialTypeProps) {
  const { show, pMaterialType } = props
  const [isLoading, setIsLoading] = useState(false)

  const defMt: IMaterialType = {
    id: undefined,
    name: "",
    isActivated: true,
    isRemoved: false,
    }
  let mt: IMaterialType = defMt
  if(pMaterialType) {
    mt = pMaterialType.getMaterialType()
  }
  console.log(JSON.stringify(pMaterialType))
  console.log(JSON.stringify(mt))
  const [materialType, setMaterialType] = useState<IMaterialType>(mt)

  const upMaterialTypeField = (field: string, value: any) => {
    setMaterialType({ ...materialType, [field]: value })
  }

  useEffect(() => {
    if(pMaterialType) {
      setMaterialType(pMaterialType.getMaterialType())
    } else {
      setMaterialType(defMt)
    }
  },[pMaterialType])

  const handleSaveOrUpdate = () => {
    if(isLoading) return
    setIsLoading(true)
    MaterialTypeService.createOrUpdateMaterialType(materialType)
      .then((result: MaterialType) => {
        setIsLoading(false)
        props.onSuccess((materialType.id) ? 'Material Type Updated Successfully' : 'Material Type Added Successfully')
        setTimeout(() => {
          setMaterialType(defMt)
        },500)
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        showApiErrorMessage(apiError)
      })
  }

  const handleClose = () => {
    props.onClose()
  }

  const isFormValidated = () => {
    let isValidated = true
    if (!materialType || TextUtils.isEmpty(materialType.name)) {
      isValidated = false
    }
    return isValidated
  }

  const renderInputField = () => {
    return (
      <Box>
        <InputField
          inputLabel={`Enter Material Type`}
          placeholder="Enter Material Type"
          required={true}
          type="text"
          value={materialType.name}
          onChange={(e: any) => upMaterialTypeField("name", e.target.value)}
        />
      </Box>
    )
  }
  return (
    <Box>
      <ModalController
        children={renderInputField()}
        pShow={show}
        pLoading={isLoading}
        pTitle={materialType.id ? "Edit Material Type" : "Add New Material Type"}
        pYesButtonTitle={materialType.id ? "Update" : "Save"}
        pCancelButtonTitle="Cancel"
        pYesDisabled={!isFormValidated()}
        onYesClick={() => {
          handleSaveOrUpdate()
        }}
        onCancelClick={() => {
          handleClose()
          setTimeout(() => {
            setMaterialType(defMt)
          },500)
        }}
      />
    </Box>
  )
}
export default NewMaterialType
