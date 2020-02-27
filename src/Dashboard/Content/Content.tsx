import React, { useEffect, useState, Fragment } from "react";
import Styles from "./Content.module.scss";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";
import { DataService } from "../../Services/dataService";
import { Button, Typography, Box, Tabs, Tab } from "@material-ui/core";
import * as MockData from "../../Services/mockData";
import { MockModels } from "./../../data";
import { useForm } from "react-hook-form";
import AccordionHandler from "../../Components/AccordionHandler/AccordionHandler";
import SectionHandler from "../../Components/SectionHandler/SectionHandler";

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
  const { register, getValues } = useForm();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getModelDetails();
  }, []);

  const getModelDetails = () => {
    const resp = MockData.MockPageData;

    // resp.data = resp.data.map((data: any) => {
    //   return data;
    // });

    setContent(resp);
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

  const renderAccordionComponent = data => {
    return <AccordionHandler data={data} emitUpdatedData={updateData} />;
  };

  const renderSectionComponent = data => {
    return <SectionHandler data={data} emitUpdatedData={updateData} />;
  };

  const getComponentType = {
    Section: renderSectionComponent,
    AccordionComponent: renderAccordionComponent
  };

  const publishChanges = () => {
    console.log(content);
  };

  return (
    <Fragment>
      <div className={Styles.header}>
        <div className={Styles.flexRow}>
          <h3>{content.name}Travel Benefit</h3>
          <p>{content.description}</p>
        </div>
        <Button color="primary" variant="contained" onClick={publishChanges}>
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
            {(content.data || []).map(data => {
              return (
                <div className={Styles.models}>
                  <h3>{data.type}</h3>
                  {getComponentType[data.type]
                    ? getComponentType[data.type](data)
                    : false}
                </div>
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
    </Fragment>
  );
};

export default Content;
