import React, { useEffect, useState, Fragment } from "react";
import Styles from "./Content.module.scss";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";
import { DataService } from "../../Services/dataService";
import {
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Menu,
  withStyles,
  MenuProps,
  ListItemText,
  Fab
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import flat from "flat";

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

const StyledMenu = withStyles({
  paper: {
    // border: "1px solid #d3d4d5",
    margin: "0 10px 30px"
  }
})((props: MenuProps) => (
  <Menu
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    {...props}
  />
));

interface IProps {
  match: any;
  history: History;
  location: Location;
}

const Content = ({
  match: {
    params: { id }
  },
  history
}) => {
  const dataService = new DataService();

  const [content, setContent] = useState<any>({});
  const [contentTypes, setContentTypes] = useState<any>([]);

  const [tabvalue, setTabvalue] = React.useState(0);
  const { register, getValues, handleSubmit, setValue } = useForm();
  const [previousVersions, setPreviousVersions] = useState<any>([]);
  const [activeVersion, setActiveVersion] = useState<any>("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isSubmitPressed, setisSubmitPressed] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabvalue(newValue);
  };

  useEffect(() => {
    getModelDetails(id);
    getContentTypes();
  }, []);

  const getContentTypes = () => {
    dataService.getContetTypes().then(resp => {
      if (resp.status === 200) {
        setContentTypes(resp.data.data);
      }
    });
  };

  const getModelDetails = pageId => {
    dataService.getPageContentById(pageId).then(resp => {
      if (resp.status === 200) {
        console.log(resp.data);
        setContent(resp.data.data);
        setPreviousVersions([
          resp.data.data.id,
          ...resp.data.data.previousVersions
        ]);
        setActiveVersion(resp.data.data.id);
      }
    });
  };

  const updateData = updatedComponentData => {
    const temp = Object.assign({}, content);
    const updateIndex = temp.data.findIndex(t => {
      return t.id === updatedComponentData.id;
    });

    if (updateIndex !== -1) {
      temp.data[updateIndex] = updatedComponentData;
      setContent(temp);
    }
  };

  const publishChanges = data => {
    console.log(content);
    console.log(data);
    setisSubmitPressed(true);
    setTimeout(() => {
      const formData = flat.unflatten(getValues());
      updatePageContent(getValues());
      console.log(formData);
      setisSubmitPressed(false);
    }, 500);
  };

  const updatePageContent = data => {
    const newContent = Object.assign({}, content);

    Object.keys(data).map(key => {
      const keyMap = key.split(".");
      const fieldKey = keyMap.pop();
      let t = newContent.contentTypes;

      for (let i = 0; i < keyMap.length; i++) {
        t = t[keyMap[i]];
      }
      if (t.name === fieldKey) {
        t.value = data[key];
      }
    });

    dataService.updatePageContent(newContent).then(resp => {
      if (resp.status === 200) {
        console.log(resp);
        setContent(resp.data.data);
        setPreviousVersions([
          resp.data.data.id,
          ...resp.data.data.previousVersions
        ]);
        setActiveVersion(resp.data.data.id);
      }
    });
  };

  const renderPreviousVersion = data => {
    return (
      <FormControl
        className={Styles.formElement}
        style={{ width: "200px", marginRight: "10px" }}
      >
        <InputLabel>Restore to Version</InputLabel>
        <Select
          labelId="Previous Version"
          id="select"
          // onChange={handleFeildTypeChange}
          label="Previous Version"
          defaultValue={activeVersion}
          name="previousVersion"
          required
        >
          {(previousVersions || []).map((e, index) => {
            return <MenuItem value="e">{`V${index + 1}`}</MenuItem>;
          })}
          ;
        </Select>
      </FormControl>
    );
  };

  const deleteField = (key, field) => {
    console.log(key);
    console.log(field);
    const temp = Object.assign({}, content);

    delete temp.contentTypes[key];
    console.log(temp);
  };

  const saveMarkedTextValue = (e: any) => {
    console.log(e);
    setValue(e.key, e.value);
  };

  const renderValue = (field, key) => {
    if (field.type === "text") {
      return (
        <div className={Styles.valueContainer}>
          <span className={Styles.label}>
            {field.name}
            <ClearIcon
              onClick={() => deleteField(key, field)}
              className={Styles.icon}
            />
          </span>
          <TextField
            type="text"
            value={field.value}
            inputRef={register}
            name={key}
          />
        </div>
      );
    } else if (field.type === "markedText") {
      register({ name: key });
      return (
        <div className={Styles.valueContainer}>
          <span className={Styles.label}>
            {field.name}
            <ClearIcon
              onClick={() => deleteField(key, field)}
              className={Styles.icon}
            />
          </span>
          <RichTextEditor
            value={field.value || ""}
            index={key.replace(/[.]/g, "-")}
            getValue={isSubmitPressed}
            returnValue={value => saveMarkedTextValue({ key, value })}
          />
        </div>
      );
    } else if (field.type === "array") {
      // return renderItems(field.items, -1, fieldIndex);
    }
  };

  const addItem = (fieldName, contentIndex, fieldIndex) => {
    const fields = contentTypes[0].fields.filter(field => {
      return field.name === fieldName;
    });
    const field: any = fields[0];
    const newContent = Object.assign({}, content);

    field.items = field.items.map(item => {
      const t = {
        type: item.type,
        name: item.name,
        value: ""
      };
      return t;
    });

    newContent.contentTypes[contentIndex].fields[fieldIndex].items.push(
      field.items
    );

    setContent(newContent);
    console.log(field);
    console.log(newContent);
  };

  const renderItems = (field, contentIndex, fieldIndex, key) => {
    return (
      <div className={Styles.itemsContainer}>
        <div>
          <span className={Styles.label}>
            {field.name}
            <AddIcon
              className={Styles.icon}
              onClick={() => addItem(field.name, contentIndex, fieldIndex)}
            />
          </span>
        </div>
        <div className={Styles.items}>
          {(field.items || []).map((item, itemIndex) => {
            return (
              <div className={Styles.item}>
                <span className={Styles.label}>
                  {field.name} {itemIndex + 1}
                </span>
                {(item || []).map((itemField, itemFieldIndex) => {
                  return (
                    <div>
                      <span className={Styles.iconContainer}></span>
                      {renderValue(
                        itemField,
                        `${key}.${itemIndex}.${itemField.name}`
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = (content, index) => {
    return (
      <div className={Styles.content}>
        <h4 className={Styles.contentHeading}>{content.name}</h4>
        <div className={Styles.contentFields}>
          {(content.fields || []).map((field, fieldIndex) => {
            return (
              <div className={Styles.field}>
                {field.type === "array"
                  ? renderItems(
                      field,
                      index,
                      fieldIndex,
                      `${index}.${field.name}`
                    )
                  : renderValue(
                      field,
                      `${index}.fields.${fieldIndex}.${field.name}`
                    )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const addContentFromModel = model => {
    console.log(model);
    handleClose();

    const contentFields: any = [];

    model.fields.forEach(field => {
      const t = {
        type: field.type,
        name: field.name
      };
      if (field.type === "array") {
        t["items"] = [];
      }
      contentFields.push(t);
    });

    const contentType = {
      name: model.type,
      type: model.type,
      fields: contentFields
    };

    const newContent = Object.assign({}, content);
    newContent.contentTypes.push(contentType);
    setContent(newContent);
    console.log(newContent);
  };

  const renderAddModelMenu = () => {
    return (
      <div>
        <Fab onClick={handleClick} className={Styles.addIcon}>
          <AddIcon />
        </Fab>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {(contentTypes || []).map((model, modelIndex) => {
            return (
              <MenuItem
                onClick={() => {
                  addContentFromModel(model);
                }}
              >
                {model.type}
              </MenuItem>
            );
          })}
        </StyledMenu>
      </div>
    );
  };

  const renderLeftPanel = () => {
    return (
      <Fragment>
        <Tabs
          value={tabvalue}
          onChange={handleChange}
          style={{ borderBottom: "1px solid #ddd" }}
        >
          <Tab label="Fields" {...a11yProps(0)} />
          <Tab label="JSON" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tabvalue} index={0}>
          <div className={Styles.contentContainer}>
            {(content.contentTypes || []).map((content, index) => {
              return renderContent(content, index);
            })}
          </div>
        </TabPanel>
        <TabPanel value={tabvalue} index={1}>
          <div className={Styles.content}>
            <pre style={{ textAlign: "left" }}>
              {JSON.stringify(content, null, 3)}
            </pre>
          </div>
        </TabPanel>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className={Styles.header}>
        <div className={Styles.flexCol}>
          <h3>{content.name}</h3>
        </div>
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit(publishChanges)}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className={Styles.container}>
        <div className={Styles.leftPanel}>{renderLeftPanel()}</div>
        <div className={Styles.rightPanel}>
          <p>UUID - {content.uuid}</p>
          <p>Version - {content.version}</p>
          <p>
            Modified on -{new Date(content.lastModifiedOn).toLocaleString()}
          </p>
          {renderPreviousVersion(content.previousVersions)}
        </div>
      </div>

      {renderAddModelMenu()}
    </Fragment>
  );
};

export default Content;
