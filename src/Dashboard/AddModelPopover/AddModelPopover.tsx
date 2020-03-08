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
import Style from "./AddModelPopover.module.scss";
import { useForm } from "react-hook-form";
import { DataService } from "../../Services/dataService";
import { useHistory } from "react-router-dom";
import uuid from "react-uuid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
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
  onSubmit?: any;
}

const AddModelPopover: React.FC<IProps> = ({
  open,
  handleOpen,
  handleClose,
  data,
  onSubmit
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit, setValue } = useForm();

  const [modalStyle] = useState(getModalStyle);
  const [isEditMode, setIsEditMode] = useState(false);
  const dataService = new DataService();

  useEffect(() => {
    if (data && data.type) {
      setIsEditMode(true);
    }
  }, [data]);

  const submit = data => {
    const body = {
      type: data.modelName,
      fields: []
    };
    dataService.saveContentType(body).then(resp => {
      console.log(resp);
      if (resp.status === 200) {
        handleClose();
        history.push(`/dashboard/models/${resp.data.data.id}`);
      }
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        <h3>Add new model</h3>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <FormGroup className={Style.formGroup}>
              <TextField
                label="Model Name"
                className={Style.formElement}
                inputRef={register}
                name="modelName"
                defaultValue={data?.name}
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
              Continue
            </Button>
          </FormGroup>
        </form>
      </div>
    </Modal>
  );
};
export default AddModelPopover;
