import {
  ModalFormProps,
  DrawerFormProps,
  QueryFilterProps,
  ProFormDigit,
  ProFormUploadButton,
  ProFormSwitch,
} from '@ant-design/pro-form';
import ProForm, {
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
  DrawerForm,
  ProFormUploadDragger,
  QueryFilter,
} from '@ant-design/pro-form';
import { Form, message, Upload, UploadProps } from 'antd';
import type { ProFieldProps } from '@ant-design/pro-utils';
import type { ReactNode } from 'react';
import {
  ProFormCaptchaProps,
  ProFormCheckbox,
  ProFormCheckboxGroupProps,
  ProFormColorPickerProps,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormDependency,
  ProFormDependencyProps,
  ProFormDigitProps,
  ProFormDigitRange,
  ProFormDigitRangeProps,
  ProFormItemProps,
  ProFormList,
  ProFormListProps,
  ProFormMoneyProps,
  ProFormRadio,
  ProFormRadioGroupProps,
  ProFormSelectProps,
  ProFormSlider,
  ProFormSliderProps,
  ProFormSwitchProps,
  ProFormTreeSelect,
  ProFormUploadButtonProps,
  ProFormUploadDraggerProps,
} from '@ant-design/pro-components';
import { InboxOutlined } from '@ant-design/icons';
import MyEditor from '../WangEdit';
import MarkdownEdit from '../Markdown';
import { TextAreaProps } from 'antd/es/input';

export interface FormItemProps {
  type:
    | 'text'
    | 'number'
    | 'number-range'
    | 'slider'
    | 'select'
    | 'treeSelect'
    | 'switch'
    | 'radio-group'
    | 'checkbox-group'
    | 'textArea'
    | 'dateTime'
    | 'date-range'
    | 'dateTime-range'
    | 'upload'
    | 'uploadDragger'
    | 'group'
    | 'password'
    | 'dependency'
    | 'render'
    | 'list'
    | 'markdown'
    | 'edit';
  itemProps?:
    | ProFormSelectProps
    | ProFormCaptchaProps
    | ProFormUploadButtonProps
    | ProFormSwitchProps
    | ProFormCheckboxGroupProps
    | ProFormDependencyProps
    | ProFormDigitProps
    | ProFormDigitRangeProps
    | ProFormRadioGroupProps
    | ProFormSliderProps
    | ProFormMoneyProps
    | ProFormColorPickerProps
    | ProFormItemProps
    | ProFormListProps<any>
    | ProFormUploadDraggerProps;
  dependencyName?: string;
  dependencyrequest?: (values: any) => void;
  group?: FormItemProps[];
  render?: ReactNode;
  children?: ReactNode;
}

interface CreateFormProps {
  formItems: FormItemProps[];
  type: 'modal' | 'drawer' | 'query';
  // onFinish: (values: any) => void;
  formWraperProps: ModalFormProps | DrawerFormProps | QueryFilterProps;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { formItems, type, formWraperProps } = props;

  const renderField = (item: FormItemProps, index: number) => {
    if (item.type === 'textArea') {
      return (
        <ProFormTextArea
          key={index}
          {...(item.itemProps as ProFormItemProps<TextAreaProps>)}
        />
      );
    } else if (item.type === 'number') {
      return (
        <ProFormDigit key={index} {...(item.itemProps as ProFormDigitProps)} />
      );
    } else if (item.type === 'number-range') {
      return (
        <ProFormDigitRange
          key={index}
          {...(item.itemProps as ProFormDigitRangeProps)}
        />
      );
    } else if (item.type === 'slider') {
      return (
        <ProFormSlider
          key={index}
          {...(item.itemProps as ProFormSliderProps)}
        />
      );
    } else if (item.type === 'password') {
      return (
        <ProFormText.Password
          key={index}
          {...(item.itemProps as ProFormItemProps)}
        />
      );
    } else if (item.type === 'select') {
      return (
        <ProFormSelect
          key={index}
          {...(item.itemProps as ProFormSelectProps)}
        />
      );
    } else if (item.type === 'switch') {
      return (
        <ProFormSwitch
          key={index}
          {...(item.itemProps as ProFormSwitchProps)}
        />
      );
    } else if (item.type === 'radio-group') {
      return (
        <ProFormRadio.Group
          key={index}
          {...(item.itemProps as ProFormRadioGroupProps)}
        />
      );
    } else if (item.type === 'checkbox-group') {
      return (
        <ProFormCheckbox.Group
          key={index}
          {...(item.itemProps as ProFormCheckboxGroupProps)}
        />
      );
    } else if (item.type === 'dateTime') {
      return (
        <ProFormDateTimePicker
          key={index}
          {...(item.itemProps as ProFormItemProps)}
        />
      );
    } else if (item.type === 'date-range') {
      return (
        <ProFormDateRangePicker
          key={index}
          {...(item.itemProps as ProFormItemProps)}
        />
      );
    } else if (item.type === 'dateTime-range') {
      return (
        <ProFormDateTimeRangePicker
          key={index}
          {...(item.itemProps as ProFormItemProps)}
        />
      );
    } else if (item.type === 'treeSelect') {
      return (
        <ProFormTreeSelect
          key={index}
          {...(item.itemProps as ProFormItemProps)}
        />
      );
    } else if (item.type === 'group') {
      return (
        <ProForm.Group key={index}>
          {item.group?.map((groupItem, groupIndex) =>
            renderField(groupItem, groupIndex),
          )}
        </ProForm.Group>
      );
    } else if (item.dependencyName !== undefined) {
      console.log('dependencyName', item.dependencyName);

      return (
        <ProFormDependency
          {...(item.itemProps as ProFormDependencyProps)}
          name={[item.dependencyName!]}
        >
          {values => {
            console.log('values', values[item.dependencyName!], {
              ...item,
              dependencyName: undefined,
            });
            if (values[item.dependencyName!]) {
              console.log(
                '11',
                renderField({ ...item, dependencyName: undefined }, index),
              );
              return renderField({ ...item, dependencyName: undefined }, index);
            }
            return null;
          }}
        </ProFormDependency>
      );
    } else if (item.type === 'upload') {
      return (
        <ProFormUploadButton
          key={index}
          {...(item.itemProps as ProFormUploadButtonProps)}
          fieldProps={{
            headers: {
              Authorization: localStorage.getItem('userToken') ?? '',
            },
            onChange(info) {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                item.itemProps;
                message.success(`${info.file.name} 上传成功.`);
              } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
              }
            },

            ...(item.itemProps as ProFormUploadDraggerProps).fieldProps,
          }}
        />
      );
    } else if (item.type === 'uploadDragger') {
      return (
        <ProFormUploadDragger
          key={index}
          {...(item.itemProps as ProFormUploadDraggerProps)}
          fieldProps={{
            headers: {
              Authorization: localStorage.getItem('userToken') ?? '',
            },
            ...(item.itemProps as ProFormUploadDraggerProps).fieldProps,
          }}
        />
      );
    } else if (item.type === 'edit') {
      return (
        <ProForm.Item key={index} {...(item.itemProps as ProFormItemProps)}>
          <MyEditor />
        </ProForm.Item>
      );
    } else if (item.type === 'markdown') {
      return (
        <ProForm.Item
          style={{ width: '100%' }}
          key={index}
          {...(item.itemProps as ProFormItemProps)}
        >
          <MarkdownEdit />
        </ProForm.Item>
      );
    } else if (item.type === 'list') {
      return (
        // @ts-ignore
        <ProFormList key={index} {...(item.itemProps as ProFormItemProps)}>
          {(f, index, action) => {
            console.log(f, index, action);
            return (
              <ProForm.Group>
                {item.group?.map((subItem, subIndex) =>
                  renderField({ ...subItem }, subIndex),
                )}
              </ProForm.Group>
            );
          }}
        </ProFormList>
      );
    } else if (item.type === 'text') {
      return (
        <ProFormText key={index} {...(item.itemProps as ProFormItemProps)} />
      );
    } else {
      return item.render;
    }
  };

  if (type === 'modal') {
    return (
      <ModalForm {...(formWraperProps as ModalFormProps)}>
        {formItems.map((item, index) => renderField(item, index))}
      </ModalForm>
    );
  } else if (type === 'drawer') {
    return (
      <DrawerForm {...(formWraperProps as DrawerFormProps)}>
        {formItems.map((item, index) => renderField(item, index))}
      </DrawerForm>
    );
  } else {
    return (
      <QueryFilter {...(formWraperProps as QueryFilterProps)}>
        {formItems.map((item, index) => renderField(item, index))}
      </QueryFilter>
    );
  }
};

export default CreateForm;
