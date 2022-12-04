import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { PATH } from '@/services/api/path'

type MyEditorProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const  MyEditor: React.FC<MyEditorProps> = (props) => {
  const {onChange, value} = props;
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)   // TS 语法
    // const [editor, setEditor] = useState(null)                   // JS 语法

    // 编辑器内容
    const [html, setHtml] = useState(value ?? '')

    // 模拟 ajax 请求，异步设置 html
    useEffect(() => {
        // setTimeout(() => {
        //     setHtml('<p>hello world</p>')
        // }, 1500)
    }, [])

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = { }  // TS 语法
    // const toolbarConfig = { }                        // JS 语法

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {    // TS 语法
    // const editorConfig = {                         // JS 语法
        placeholder: '请输入内容...',
        MENU_CONF: {
          'uploadImage': {
            server: import.meta.env.VITE_OPER_API +  PATH.FILE_S3,
            meta: {
              fileType: 'TOKEN_ICON'
            },
            fieldName: 'file',
            maxFileSize: 1 * 1024 * 1024, // 1M
            headers:{
              Authorization: localStorage.getItem('userToken') ?? ''
            },
            customInsert: (res: any, insertFn: any) => {  // TS 语法
              // customInsert(res, insertFn) {                  // JS 语法
              // res 即服务端的返回结果
              // 从 res 中找到 url alt href ，然后插入图片
              insertFn(res.data.url, '', '')
            },
          }
        }
    }
    console.log('editorConfig', editorConfig)

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100}}>
                <Toolbar
                  editor={editor}
                  defaultConfig={toolbarConfig}
                  mode="default"
                  style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                  defaultConfig={editorConfig}
                  value={html}
                  onCreated={setEditor}
                  onChange={editor => {
                    setHtml(editor.getHtml())
                    onChange && onChange(editor.getHtml())
                  }}
                  mode="default"
                  style={{ height: '250px', overflowY: 'hidden' }}
                />
            </div>
            {/* <div style={{ marginTop: '15px' }}>
                {html}
            </div> */}
        </>
    )
}

export default MyEditor