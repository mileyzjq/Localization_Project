import "./Table.css";
import {Button, Input, Table, Space, Popconfirm, message} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {EditableRow, EditableCell, components} from "./TableUtils";

const {baseApiUrl, localizationFolderPath} = require('./constants');
const buildBase = (projectId) => `${baseApiUrl}/projects/${projectId}/`;

const deleteError = () => {
    message.error('Fail to delete a row!');
};

const addError = () => {
    message.error('Fail to add a row!');
};

const saveError = () => {
    message.error('Fail to save a row!');
};

const addSuccess = () => {
    message.success('add successfully');
};

const deleteSuccess = () => {
    message.success('delete successfully');
};

const saveSuccess = () => {
    message.success('save successfully');
};


function Update() {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [count, setCount] = useState(0);
    const searchInput = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get("http://localhost:3090/doSearchAll");
            setTableData([...res.data.data]);
            console.log(res);
            setCount(res.data.data.length + 1);
        }
        fetchData();
    }, []);

    const handleDelete = async(key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        const res = await axios.post("http://localhost:3090/table/delete", {key: key});
        if(res.data.status === "success") {
            setDataSource(newData);
            deleteSuccess();
        } else {
            deleteError();
        }
    };

    const handleAdd = async() => {
        const newKey = `custome ${count}`;
        const newData = {
            id: count,
            key: newKey,
            value: '',
        };
        const res = await axios.post("http://localhost:3090/table/add", {key: newKey});
        if(res.data.status === "success") {
            setDataSource([newData, ...dataSource]);
            setCount(count + 1);
            addSuccess();
        } else {
            addError();
        }
    };

    const handleSave = async (row) => {
        console.log("save");
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        const res = await axios.post("http://localhost:3090/table/save", {row});
        console.log(res);
        if(res.data.status === "success") {
            newData.splice(index, 1, { ...item, ...row });
            setDataSource(newData);
            saveSuccess();
        } else {
            addError();
        }
    };


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        editable: true,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 120,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 120,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            sorter: (a, b) => a.key.localeCompare(b.key),
            ...getColumnSearchProps('key'),
        },
        {
            title: 'Value',
            dataIndex: 'value',
            sorter: (a, b) => a.value.localeCompare(b.value),
            ...getColumnSearchProps('value'),
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space size="middle" align="center">
                    {/*<a>Edit </a>*/}
                    {dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                    ) : null}
                </Space>
            ),
        }
    ];

    const setTableData =(results)=> {
        let arr = [];
        results.forEach(item=>{
            arr.push({
                id: item.id,
                key: item.key,
                value: item.value
            });
        });
        setDataSource([...arr]);
    }

    const handleNextPage =async()=> {
        // const response = await axios.post("/updateTable", {data: dataSource});
        // console.log(response);
        // if(response.data.status == "success") {
        //     navigate("/update/merge");
        // } else {
        //     error();
        // }
        // console.log(dataSource);
        navigate("/update/merge");
    }

    const mergeColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                dataSource,
                handleSave,
            }),
        };
    });

    return (
        <div>
            <br/>
            <Button
                onClick={handleAdd}
                type="primary"
            >
                Add a row
            </Button>
            <Button
                onClick={handleNextPage}
                type="primary"
                style={{float: "right"}}
            >
                Next
            </Button>
            <Table
                components={components}
                columns={mergeColumns}
                dataSource={dataSource}
                style={{marginTop: 16}}
                rowClassName={() => 'editable-row'}
                bordered
                size="small" />
        </div>
    );
}

export default Update;
