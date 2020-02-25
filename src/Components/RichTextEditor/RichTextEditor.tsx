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
}

const RichTextEditor: React.FC<IProps> = ({ value, index }) => {
  const [markedTextEditorView, setMarkedTextEditorView]: any = useState();

  useEffect(() => {
    const text = value.value;
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
