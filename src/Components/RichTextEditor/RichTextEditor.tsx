import React, { useState, useEffect, Fragment } from "react";
import Styles from "./RichTextEditor.module.scss";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { exampleSetup } from "prosemirror-example-setup";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer
} from "prosemirror-markdown";

interface IProps {
  value: any;
  index: number;
  getValue?: boolean;
  returnValue?: any;
}

const RichTextEditor: React.FC<IProps> = ({
  value,
  index,
  getValue,
  returnValue
}) => {
  const [markedTextEditorView, setMarkedTextEditorView]: any = useState();

  useEffect(() => {
    const text = value;
    const markedTextEditor: any = document.querySelector(
      "#markedTextEditor" + index
    );
    setMarkedTextEditorView(
      new EditorView(markedTextEditor, {
        state: EditorState.create({
          doc: defaultMarkdownParser.parse(text),
          plugins: exampleSetup({ schema: schema })
        })
      })
    );
  }, []);

  useEffect(() => {
    if (getValue) {
      returnValue(submitMarkedText());
    }
  }, [getValue]);

  const submitMarkedText = () => {
    const value = defaultMarkdownSerializer.serialize(
      markedTextEditorView.state.doc
    );
    return value;
  };

  return (
    <Fragment>
      <div
        id={"markedTextEditor" + index}
        className={Styles.markedTextEditor}
      ></div>
    </Fragment>
  );
};
export default RichTextEditor;
