import {Button, Form, Input, Space} from 'antd';
import React, {useContext, useEffect, useRef, useState} from 'react';

const EditableContext = React.createContext(null);

export const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

export const EditableCell = ({
                                 title,
                                 editable,
                                 children,
                                 dataIndex,
                                 record,
                                 dataSource,
                                 handleSave,
                                 ...restProps
                             }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                    {
                        validator(_, value) {
                            if (title === "Key" && !validateKey(value, dataSource)) {
                                return Promise.reject(new Error('Duplicate keys!'));
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

function validateKey(target, dataSource) {
    const len = dataSource.length;
    for(let i=0; i<len; i++) {
        if(dataSource[i].key === target) {
            return false;
        }
    }
    return true;
}

export const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};