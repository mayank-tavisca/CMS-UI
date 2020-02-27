import React, { useEffect, useState, Fragment, useRef } from "react";
import { mapAccordionData } from "./utils";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { useForm } from "react-hook-form";
import Styles from "./AccordionHandler.module.scss";
import flat from "flat";
import { Button } from "@material-ui/core";

interface IProps {
  data: any;
  emitUpdatedData: any;
}

const AccordionHandler: React.FC<IProps> = ({ data, emitUpdatedData }) => {
  const [fieldData, setFieldData] = useState<any>({});
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [isSubmitPressed, setisSubmitPressed] = useState(false);

  useEffect(() => {
    const mappedData = mapAccordionData(data.metaData);
    console.log(mappedData);
    setFieldData(mappedData);
  }, [data]);

  const renderRichTextEditor = (data, index, key) => {
    register({ name: key });
    return (
      <div className={Styles.markedText}>
        <RichTextEditor
          value={data}
          index={index}
          getValue={isSubmitPressed}
          returnValue={value => saveMarkedTextValue({ key, value })}
        />
      </div>
    );
  };

  const renderTextBox = (data, index, key) => {
    return (
      <input
        ref={register}
        name={key}
        className={Styles.input}
        defaultValue={data}
      />
    );
  };

  const renderMediaSelector = (data, index, key) => {
    return <input type="file" ref={register} name={key} />;
  };

  const renderFieldType = {
    markedText: renderRichTextEditor,
    text: renderTextBox,
    media: renderMediaSelector
  };

  const getFieldType = key => {
    const schema = data.schema;
    return schema[key];
  };

  const renderFields = () => {
    return Object.keys(fieldData).map((key, index) => {
      if (fieldData[key] instanceof Array) {
        return renderContents(fieldData[key]);
      } else {
        return (
          <div className={Styles.field}>
            <label>{key}</label>
            {getFieldType(key)
              ? renderFieldType[getFieldType(key)](fieldData[key], index, key)
              : false}
          </div>
        );
      }
    });
  };

  const renderContents = contents => {
    return (
      <Fragment>
        {(contents || []).map((field, index) => {
          return (
            <div className={Styles.field}>
              <label>Content {index + 1}</label>
              {Object.keys(field).map((key, subIndex) => {
                return (
                  <div>
                    {getFieldType(key)
                      ? renderFieldType[getFieldType(key)](
                          field[key],
                          `${data.id}-${index}`,
                          `contents.${index}.${key}`
                        )
                      : false}
                  </div>
                );
              })}
            </div>
          );
        })}
      </Fragment>
    );
  };

  const saveMarkedTextValue = (e: any) => {
    console.log(e);
    setValue(e.key, e.value);
  };

  const submitValue = () => {
    setisSubmitPressed(true);
    setTimeout(() => {
      const formData = flat.unflatten(getValues());
      updateData(formData);
      setisSubmitPressed(false);
    }, 500);
  };

  const updateData = formData => {
    const metaData = data.metaData;

    Object.keys(formData).forEach(key => {
      const val = formData[key];

      if (key === "heading") {
        metaData.heading = val;
      } else if (key === "contents") {
        val.forEach((item, index) => {
          if (!metaData.content[index]) {
            metaData.content.push(
              Object.assign({}, metaData.content[index - 1])
            );
          }
          metaData.content[index].heading = item.heading;
          metaData.content[index].content[0].content = item.content;
        });
      }
    });
    data.metaData = metaData;
    console.log(data);
    emitUpdatedData(data);
  };

  const addNewSection = () => {
    const temp = Object.assign({}, fieldData);
    const newContent = temp.contents[0];
    newContent.heading = "";
    newContent.content = "";

    temp.contents.push(newContent);
    setFieldData(temp);
  };

  return (
    <div className={Styles.fields}>
      {renderFields()}
      <Button
        color="primary"
        variant="contained"
        className={Styles.actionBtn}
        onClick={addNewSection}
      >
        Add new section
      </Button>
      <Button
        color="primary"
        variant="contained"
        className={Styles.actionBtn}
        onClick={submitValue}
      >
        Submit
      </Button>
    </div>
  );
};

export default AccordionHandler;
