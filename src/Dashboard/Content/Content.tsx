import React, { useEffect, useState, Fragment } from "react";
import Styles from "./Content.module.scss";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";
import { DataService } from "../../Services/dataService";
import { Button, Typography, Box, Tabs, Tab } from "@material-ui/core";
import * as flat from "flat";
import * as MockData from "../../Services/mockData";
import { MockModels } from "./../../data";
import { parseData } from "../../Services/utils";

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

const Content = () => {
  const dataService = new DataService();
  const [content, setContent] = useState<any>({});
  const [editableFields, setEditableFields] = useState<any>([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getModelDetails();
  }, []);

  const getModelDetails = () => {
    setContent(MockData.MockPageData);

    const resp = MockData.MockPageData;

    resp.data = (resp.data || []).map(data => {
      data.metaData = flat(data.metaData);
      return data;
    });

    const tempFields: any = [];
    resp.data.forEach((data: any) => {
      const model = getModel(data.type);

      if (model) {
        tempFields.push({
          ...data,
          metaData: getEditableFeilds(data.metaData, model)
        });
      }
    });

    // console.log(flat.unflatten(resp));

    // console.log(tempFields);

    // groupFields(tempFields);
    setEditableFields(tempFields);
  };

  // const groupFields = (fields) => {
  //   fields.reduce()
  // }

  const getModel = key => {
    let t;
    MockModels.forEach(model => {
      if (model.name === key) {
        t = model;
        return;
      }
    });
    return t;
  };

  const getEditableFeilds = (data, model) => {
    const fields: any = [];
    // console.log(data, model);

    Object.keys(data).forEach((key: any) => {
      const keysList = key.split(".");

      (model.fields || []).forEach(e => {
        if (e.type === "array") {
          // const subFields: any = [];
          e.fields.map(ele => {
            if (ele.keyName === keysList[keysList.length - 1]) {
              const temp = {
                keys: keysList,
                key: key,
                value: data[key],
                ...ele
              };
              fields.push(temp);
            }
          });
          // console.log(subFields);
          // if (subFields.length) {
          //   fields.push(subFields);
          // }
        } else {
          if (e.keyName === keysList[keysList.length - 1]) {
            const temp = {
              keys: keysList,
              key: key,
              value: data[key],
              ...e
            };
            fields.push(temp);
          }
        }
      });
    });

    return fields;
  };

  const renderRichTextEditor = (data, index) => {
    return (
      <div className={Styles.markedText}>
        <RichTextEditor value={data} index={index} />
      </div>
    );
  };

  const renderTextBox = (data, index) => {
    return <input className={Styles.input} value={data.value} />;
  };

  const renderMediaSelector = (data, index) => {
    return <input type="file" />;
  };

  const renderArray = (data, index) => {
    console.log(data);
    return (
      <div>
        {data.fields.map((t, ind) => {
          // const i = `${index}-${ind}`;

          return renderField(t, index, ind);
        })}
      </div>
    );
  };

  const getFieldType = {
    markedText: renderRichTextEditor,
    text: renderTextBox,
    media: renderMediaSelector,
    array: renderArray
  };

  const renderField = (field, modelIndex, index) => {
    const fieldIndex = `${modelIndex}-${index}`;
    return (
      <div className={Styles.field}>
        <label>
          {field.label} {modelIndex} {index}
        </label>
        {getFieldType[field.type](field, fieldIndex)}
      </div>
    );
  };

  const renderModel = (model, modelIndex) => {
    return (
      <div className={Styles.models}>
        <h3>{model.type}</h3>
        <div className={Styles.fields}>
          {(model.metaData || []).map((field, index) => {
            return renderField(field, modelIndex, index);
          })}
          <Button
            className={Styles.addBtn}
            onClick={() => {
              addNewContent(model.metaData, modelIndex);
            }}
          >
            Add new content
          </Button>
        </div>
      </div>
    );
  };

  const addNewContent = (data, key) => {
    console.log(key);
    console.log(data);

    const t: any = MockModels[4].fields[0];
    const fields: any = t.fields;

    console.log(fields);

    fields[0].key = "content.13.heading";
    fields[0].value = "";

    fields[1].key = "content.13.content.0.content";
    fields[1].value = "";

    let temp: any = [...editableFields];

    // temp = temp.concat(editableFields);

    temp[4].metaData.push(...fields);

    setEditableFields(temp);
    console.log(editableFields);
  };

  const renderFields = data => {
    data = MockData.MockPageData.data;
    console.log(data);
    return Object.keys(MockData.MockPageData.data).map(key => {
      const d = data[key];
      console.log(d, key);
      return (
        <div>
          {d.type}
          {flatResp(d.metaData)}
        </div>
      );
    });
  };

  const flatResp = t => {
    console.log(t);
    if (t instanceof Array) {
      return t.map(e => {
        return flatResp(e);
      });
    } else if (t instanceof Object) {
      return Object.keys(t).map(r => {
        if (t[r] instanceof Object || t[r] instanceof Array) {
          return flatResp(t[r]);
        } else {
          console.log(r);
          if (r === "heading") {
            return renderTextBox({ value: "test" }, 1);
          } else if (r === "content") {
            return renderRichTextEditor({ value: "test" }, 1);
          } else {
            return <div>Some field</div>;
          }
        }
      });
    } else {
      return <div>ekse</div>;
    }
  };

  return (
    <Fragment>
      <div className={Styles.header}>
        <div className={Styles.flexRow}>
          <h3>{content.name}Travel Benefit</h3>
          <p>{content.description}</p>
        </div>
        <Button color="primary" variant="contained">
          Publish
        </Button>
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
            {(editableFields || []).map((data, index) => {
              return renderModel(data, index);
            })}

            {/* {renderFields(content)} */}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={Styles.content}>
            <pre style={{ textAlign: "left" }}>
              {JSON.stringify(editableFields, null, 3)}
              {JSON.stringify(content, null, 3)}
            </pre>
          </div>
        </TabPanel>
      </div>
    </Fragment>
  );
};

export default Content;
