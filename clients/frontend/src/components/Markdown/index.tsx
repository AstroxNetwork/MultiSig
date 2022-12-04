import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

type MarkdownEditProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
};

const MarkdownEdit: React.FC<MarkdownEditProps> = props => {
  const { onChange, value } = props;

  const [markdownvalue, setMarkdownvalue] = useState(value ?? '');

  return (
    <>
      <MDEditor
        height={250}
        value={markdownvalue}
        onChange={value => {
          setMarkdownvalue(value!)
          onChange && onChange(value)
        }}
      />
    </>
  );
};

export default MarkdownEdit;
