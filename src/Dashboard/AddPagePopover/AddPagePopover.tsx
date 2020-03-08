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
import Style from "./AddPagePopover.module.scss";
import { useForm } from "react-hook-form";
import { DataService } from "../../Services/dataService";
import { useHistory } from "react-router-dom";
import uuid from "react-uuid";

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
  onSubmit?: any;
}

const AddPagePopover: React.FC<IProps> = ({
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

  const handleFeildTypeChange = event => {
    setValue("fieldType", event.target.value);
  };

  const submit = data => {
    const body = {
      name: data.pageName,
      uuid: uuid(),
      metaData: {
        client: data.client,
        account: data.account
      },
      contentTypes: []
    };
    dataService.postPageContent(body).then(resp => {
      console.log(resp);
      if (resp.status === 200) {
        handleClose();
        history.push(`/dashboard/content/${resp.data.data.id}`);
      }
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        <h3>Add new page details</h3>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <FormGroup className={Style.formGroup}>
              <TextField
                label="Client"
                className={Style.formElement}
                inputRef={register}
                name="client"
                defaultValue={data?.client}
              />
              <TextField
                label="Account"
                className={Style.formElement}
                inputRef={register}
                name="account"
                defaultValue={data?.account}
              />
            </FormGroup>
            <FormGroup className={Style.formGroup}>
              <TextField
                label="Page Name"
                className={Style.formElement}
                inputRef={register}
                name="pageName"
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
export default AddPagePopover;
