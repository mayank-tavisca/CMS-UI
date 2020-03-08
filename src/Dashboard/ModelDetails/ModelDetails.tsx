import React, { useEffect, useState, Fragment } from "react";
import Styles from "./ModelDetails.module.scss";
import { Tabs, Tab, Typography, Box, Button } from "@material-ui/core";
import AddFieldPopover from "../AddFieldPopover/AddFieldPopover";
import { DataService } from "../../Services/dataService";

import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import uuid from "react-uuid";

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
  const [editFieldData, setEditFieldData] = useState<any>({});

  const dataService = new DataService();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getModelDetails();
  }, []);

  const getModelDetails = () => {
    dataService.getContentTypeById(id).then(resp => {
      if (resp.status === 200) {
        setContent(resp.data.data);
      }
    });
  };

  const handlePopupOpen = () => {
    setOpen(true);
  };

  const handlePopupClose = () => {
    setOpen(false);
    setEditFieldData({});
  };

  const saveField = (data, isEditMode?: boolean) => {
    const newPageContent = Object.assign({}, content);

    if (isEditMode) {
      const indexToReplace = newPageContent.fields.findIndex(field => {
        return field.id === data.id;
      });

      newPageContent.fields[indexToReplace] = data;
    } else {
      const field = {
        id: uuid(),
        name: data.fieldName,
        type: data.fieldType
      };

      newPageContent.fields.push(field);
    }
    setContent(newPageContent);
    handlePopupClose();
  };

  const onSave = () => {
    dataService.updateContentType(content).then(resp => {
      console.log(resp);
    });
  };

  const editField = data => {
    setEditFieldData(data);
    handlePopupOpen();
  };

  const deleteField = fieldId => {
    const newPageContent = Object.assign({}, content);

    newPageContent.fields = newPageContent.fields.filter(field => {
      return field.id !== fieldId;
    });

    setContent(newPageContent);
  };

  const renderItems = items => {
    return (
      <div className={Styles.items}>
        {items.map(field => {
          return (
            <div className={Styles.field}>
              <div className={Styles.flexRow}>
                <span className={Styles.name}>{field.name}</span>
                <span className={Styles.type}>{field.type}</span>
                <span className={Styles.iconContainer}>
                  {field.items ? <AddIcon className={Styles.icon} /> : false}

                  <EditIcon className={Styles.icon} />
                  <ClearIcon className={Styles.icon} />
                </span>
              </div>
              {field.items ? renderItems(field.items) : false}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Fragment>
      <div className={Styles.headerContainer}>
        <div className={Styles.header}>
          <h3>{content.type}</h3>
          <span>Schema Version - {content.schemaVersion}</span>
          <span>
            Updated on - {new Date(content.lastModifiedOn).toLocaleString()}
          </span>
        </div>
        <div className={Styles.buttonGroup}>
          <Button
            className={Styles.addFieldBtn}
            color="primary"
            variant="contained"
            onClick={handlePopupOpen}
          >
            Add field
          </Button>
          <Button
            className={Styles.addFieldBtn}
            color="secondary"
            variant="contained"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
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
                <Fragment>
                  <div className={Styles.field}>
                    <div className={Styles.flexRow}>
                      <span className={Styles.name}>{field.name}</span>
                      <span className={Styles.type}>{field.type}</span>

                      <span className={Styles.iconContainer}>
                        {field.items ? (
                          <AddIcon className={Styles.icon} />
                        ) : (
                          false
                        )}
                        <EditIcon
                          onClick={() => editField(field)}
                          className={Styles.icon}
                        />
                        <ClearIcon
                          onClick={() => deleteField(field.id)}
                          className={Styles.icon}
                        />
                      </span>
                    </div>
                    {field.items ? renderItems(field.items) : false}
                  </div>
                </Fragment>
              );
            })}
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
        onSubmit={saveField}
        data={editFieldData}
      />
    </Fragment>
  );
};

export default ModelDetails;
