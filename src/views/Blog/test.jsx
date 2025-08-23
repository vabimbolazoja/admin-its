import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";

const Example = ({}) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {}}
      />
      <br />
      <br />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};
export default Example;
