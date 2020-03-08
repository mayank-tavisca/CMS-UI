import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  makeStyles,
  Theme,
  createStyles,
  Button,
  FormGroup,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from "@material-ui/core";
import Style from "./AddFieldPopover.module.scss";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 800,
      height: 400,
      backgroundColor: "#fff",
      padding: theme.spacing(2, 4, 3),
      outline: "none"
    }
  })
);

function getModalStyle() {
  return {
    left: "calc(50%)",
    top: "50%",
    transform: "translate(calc(-50%), -50%)"
  };
}

interface IProps {
  open: boolean;
  handleOpen?: any;
  handleClose?: any;
  data?: any;
  onSubmit: any;
}

const AddFieldPopover: React.FC<IProps> = ({
  open,
  handleOpen,
  handleClose,
  data,
  onSubmit
}) => {
  const classes = useStyles();
  const { register, handleSubmit, setValue } = useForm();

  const [modalStyle] = useState(getModalStyle);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    register({ name: "fieldType" });
  }, []);

  useEffect(() => {
    if (data.type) {
      setIsEditMode(true);
      setValue("fieldType", data.type);
    }
  }, [data]);

  const handleFeildTypeChange = event => {
    setValue("fieldType", event.target.value);
  };

  const submit = data => {
    console.log(data, isEditMode);
    onSubmit(data, isEditMode);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        <h3>Add new field</h3>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <FormGroup className={Style.formGroup}>
              <FormControl className={Style.formElement}>
                <InputLabel>Field Type</InputLabel>
                <Select
                  labelId="Field Type"
                  id="select"
                  onChange={handleFeildTypeChange}
                  label="Field Type"
                  defaultValue={data?.type}
                  name="fieldType"
                  required
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="markedText">Marked Text</MenuItem>
                  <MenuItem value="array">List</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Field Name"
                className={Style.formElement}
                inputRef={register}
                name="fieldName"
                defaultValue={data?.name}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                style={{ display: "none" }}
                label="Field Key"
                className={Style.formElement}
                inputRef={register}
                name="fieldKey"
                defaultValue={data?.id}
              />
            </FormGroup>
          </div>
          <FormGroup>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={Style.submitBtn}
            >
              Save
            </Button>
          </FormGroup>
        </form>
      </div>
    </Modal>
  );
};
export default AddFieldPopover;
