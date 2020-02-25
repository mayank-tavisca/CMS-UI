import React, { useEffect, useState, Fragment } from "react";
import * as MockData from "./../../data";
import Styles from "./ModelDetails.module.scss";
import { Tabs, Tab, Typography, Box, Button } from "@material-ui/core";
import { match } from "react-router-dom";
import AddFieldPopover from "../AddFieldPopover/AddFieldPopover";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

interface IProps {
  match: any;
  history: History;
  location: Location;
}

const ModelDetails: React.FC<IProps> = ({
  match: {
    params: { id }
  },
  history
}) => {
  const [content, setContent] = useState<any>({});
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getModelDetails();
  }, []);

  const getModelDetails = () => {
    const model = MockData.MockModels.find(model => {
      return model.id === id;
    });
    setContent(model);
  };

  const handlePopupOpen = () => {
    setOpen(true);
  };

  const handlePopupClose = () => {
    setOpen(false);
  };

  const addField = () => {
    setOpen(true);
    MockData.MockModels[0].fields.push({
      keyName: "linkType",
      type: "text",
      label: "Link Type"
    });
  };

  return (
    <Fragment>
      <div className={Styles.header}>
        <h3>{content.name}</h3>
        <p>{content.description}</p>
      </div>

      <div className={Styles.container}>
        <Tabs
          value={value}
          onChange={handleChange}
          style={{ borderBottom: "1px solid #ddd" }}
        >
          <Tab label="Fields" {...a11yProps(0)} />
          <Tab label="JSON" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <div className={Styles.content}>
            {(content.fields || []).map(field => {
              return (
                <div className={Styles.field}>
                  <span>{field.label}</span>
                  <span>{field.type}</span>
                </div>
              );
            })}
            <Button
              className={Styles.addFieldBtn}
              color="primary"
              variant="contained"
              onClick={addField}
            >
              Add field
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={Styles.content}>
            <pre style={{ textAlign: "left" }}>
              {JSON.stringify(content, null, 3)}
            </pre>
          </div>
        </TabPanel>
      </div>
      <AddFieldPopover
        open={open}
        handleOpen={handlePopupOpen}
        handleClose={handlePopupClose}
      />
    </Fragment>
  );
};

export default ModelDetails;
