import React, { useState } from "react";
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
}

const AddFieldPopover: React.FC<IProps> = ({
  open,
  handleOpen,
  handleClose,
  data
}) => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        <h3>Add new field</h3>
        <form>
          <div>
            <FormGroup className={Style.formGroup}>
              <FormControl className={Style.formElement}>
                <InputLabel>Field Type</InputLabel>
                <Select labelId="Field Type" id="select">
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="markedText">Marked Text</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Field Name" className={Style.formElement} />
            </FormGroup>
            <FormGroup>
              <TextField label="Field Key" className={Style.formElement} />
            </FormGroup>
          </div>
          <FormGroup>
            <Button
              color="primary"
              variant="contained"
              className={Style.submitBtn}
            >
              Add
            </Button>
          </FormGroup>
        </form>
      </div>
    </Modal>
  );
};
export default AddFieldPopover;
