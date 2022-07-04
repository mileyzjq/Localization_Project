import './App.css';
import {Button, message, Select} from 'antd';
import React, {useState, useMemo} from 'react';
import axios from 'axios';
import {axiosRequest} from "./utils";
import { useNavigate } from 'react-router-dom';
import { SearchInput } from "./SearchInput";
import debounce from 'lodash.debounce';

const {baseApiUrl, localizationFolderPath} = require('./constants');
// projectId may change to geekSpeak
const monolithId = 102;
const buildBase = (projectId) => `${baseApiUrl}/projects/${projectId}/`;
const buildUri = (projectId) => `${buildBase(projectId)}/repository/`;
const { Option } = Select;

const error = () => {
    message.error('Fail to create database!');
};

function Home() {
    const [remoteBranch, setRemoteBranch] = useState([]);
    const [allBranches, setAllBranches] = useState([]);
    const navigate = useNavigate();

    const onChangeRemoteBranch = async(newValue) => {
        console.log('Change:', newValue);
        setRemoteBranch(newValue);
    };

    const handleGetBranches = async(ref) => {
        await axios({
            method: 'get',
            url: buildUri(monolithId) + 'branches',
            headers: {'Private-Token': "glpat-7fB58fLMLq9WfW22BxLu"},
            params: {
                search: ref,
                per_page: 100
            }
        })
            .then((response) => {
                console.log(response);
                getAllbranches(response.data);
            })
            .catch((error) => {
                console.log(process.env.gitlabApiToken);
                console.log(error)
            })
    }

    const handleBranchesSearch = (newValue) => {
        if (newValue) {
            handleGetBranches(newValue);
        } else {
            setAllBranches([]);
        }
    };

    const debouncedBranchesSearch = useMemo(
        () => debounce(handleBranchesSearch, 300)
        , []);

    const handleRepositoryFile = async () => {
        const fileName = "LocalizedStrings.properties";
        const pathToProperties = localizationFolderPath + fileName;
        const encodedPath = encodeURIComponent(pathToProperties);
        sessionStorage.setItem("sourceBranch", remoteBranch);
        console.log(encodedPath);

        const data = {
            method: 'get',
            url: "https://git.jostle.us/api/v4/projects/102/repository/files/" + encodedPath + "/raw",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            params: {
                ref: remoteBranch
            }
        }
        axios(data)
            .then((response) => {
                console.log(response);
                sendEntries(response.data);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const sendEntries = async(entry) => {
        console.log("entry: inset!");
        const response = await axios.post("http://localhost:3090/insertRows", {data: entry});
        console.log(response);
        if(response.data.status == "success") {
            navigate("/update");
        } else {
            error();
        }
    }

    const getAllbranches=(list)=> {
        const data = list.map((item) => ({
            value: item.name,
            text: item.name,
        }));
        console.log(data);
        setAllBranches([...data]);
    }

    const options = allBranches.map((d) => <Option key={d.value}>{d.text}</Option>);

    const handleTest=async()=>{
        const res = await axios.post("http://localhost:3090/translations", {branch: remoteBranch});
        console.log(res);
    }

    return (
        <div className="App">
            <br/>
            <span>
                <Select
                    showSearch
                    value={remoteBranch}
                    placeholder={"Source Branch"}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={debouncedBranchesSearch}
                    onChange={onChangeRemoteBranch}
                    notFoundContent={null}
                    style={{width: 300, textAlign: "left", marginRight: 30}}
                >
                    {options}
                </Select>
                <Button type="primary" onClick={handleRepositoryFile} > Update Database </Button>
            </span>
        </div>
    );
}

export default Home;
