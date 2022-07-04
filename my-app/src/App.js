import './App.css';
import {Button, Input, Select} from 'antd';
import React, {useState, useMemo} from 'react';
import axios from 'axios';
import {axiosRequest} from "./utils";
import { SearchInput } from "./SearchInput";
import debounce from 'lodash.debounce';

const {baseApiUrl, localizationFolderPath} = require('./constants');
// projectId may change to geekSpeak
const projectId = 290;
const monolithId = 102;
const filePath = "files/LocalizedStrings.properties";
const buildBase = (projectId) => `${baseApiUrl}/projects/${projectId}/`;
const buildUri = (projectId) => `${buildBase(projectId)}/repository/`;
const { Option } = Select;

function App() {
    const [branch, setBranch] = useState("");
    const [deletedbranch, setDeletedBranch] = useState("");
    const [target, setTarget] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [entries, setEntries] = useState("");
    const [entryID, setEntryID] = useState("");
    const [updatedValue, setUpdatedValue] = useState("");
    const [remoteBranch, setRemoteBranch] = useState([]);
    const [MRLink, setMRLink] =  useState("");
    const [allBranches, setAllBranches] = useState([]);

    const onChangeAdd = e => {
        console.log(process.env.Token);
        console.log('Change:', e.target.value);
        setBranch(e.target.value);
    };

    const onChangeRemoteBranch = async(newValue) => {
        console.log('Change:', newValue);
        setRemoteBranch(newValue);
    };

    const debouncedChangeRemoteBranch = useMemo(
        () => debounce(onChangeRemoteBranch, 300)
        , []);

    const onChangeDelete = e => {
        console.log('Change:', e.target.value);
        setDeletedBranch(e.target.value);
    };

    const onChangeCommitMessage = e => {
        console.log('Change:', e.target.value);
        //setCommitMessage(e.target.value);
    };

    const onChangeTarget = e => {
        console.log('Change:', e.target.value);
        setTarget(e.target.value);
    };

    const onChangeEntryID = e => {
        console.log('Change:', e.target.value);
        setEntryID(e.target.value);
    };

    const onChangeUpdatedValue = e => {
        console.log('Change:', e.target.value);
        setUpdatedValue(e.target.value);
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


    const handleCreateBranches = async () => {
        await axios({
            method: 'post',
            url: buildUri(monolithId) + "branches",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            params: {
                'branch': branch,
                'ref': remoteBranch
            },
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleDeleteBranches = () => {
        axios({
            method: 'delete',
            url: "https://git.jostle.us/api/v4/projects/290/repository/branches/" + deletedbranch,
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(branch);
                console.log(error)
            })
    }

    const handleUpdatedContent = async () => {
        let res = await axios.get("/newFiles");
        console.log(res);
        return res.data;
    }

    const handleCommit = async () => {
        const content = await handleUpdatedContent();
        const fileName = "LocalizedStrings.properties";
        const pathToProperties = 'src/main/java/com/jostleme/jostle/ui/localization/' + fileName;
        await axios({
            method: 'post',
            url: buildUri(monolithId) + "commits",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            data: {
                "branch": branch,
                "commit_message": branch + "-" + entryID + "-" + updatedValue,
                "actions": [{
                    "action": "update",
                    "file_path": pathToProperties,
                    "content": content,
                }]
            }
        })
            .then((response) => {
                console.log(content);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleMergeRequest = async () => {
        await handleCreateBranches();
        await handleCommit();
        await axios({
            method: 'post',
            url: buildBase(monolithId) + "merge_requests",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            data: {
                "source_branch": branch,
                "target_branch": remoteBranch,
                "title": "commit " + branch,
            }
        })
            .then((response) => {
                console.log(response);
                console.log(response.data.web_url);
                setMRLink(response.data.web_url);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleSearch = () => {
        console.log(target);
        axios({
            method: 'post',
            url: "/doSearch",
            params: {searchTerm: target},
            data: {searchTerm: target}
        })
            .then((response) => {
                console.log(response);
                console.log(response.data);
                setSearchResult([...response.data.data]);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleUpdateValue = () => {
        console.log(entryID + " - " + updatedValue);
        axios({
            method: 'post',
            url: "/update",
            data: {
                entryID,
                updatedValue
            }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleRepositoryFile = async () => {
        const fileName = "LocalizedStrings.properties";
        const pathToProperties = localizationFolderPath + fileName;
        const encodedPath = encodeURIComponent(pathToProperties);
        console.log(encodedPath);

        const data = {
            method: 'get',
            url: "https://git.jostle.us/api/v4/projects/102/repository/files/" + encodedPath + "/raw",
            headers: {"PRIVATE-TOKEN": "glpat-7fB58fLMLq9WfW22BxLu"},
            json: true,
            data: {
                ref: remoteBranch
            }
        }
        axios(data)
            .then((response) => {
                console.log(response);
                console.log(remoteBranch);
                sendEntries(response.data);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const sendEntries = (entry) => {
        const data = {
            method: 'post',
            url: "http://localhost:3090/insertRows",
            data: {entry: entry},
        }
        axiosRequest(data, false);
    }

    const displayData = () => {
        return (
            searchResult.map(re => {
                return (<p key={re.id} onClick={()=>console.log(re.value)}>id: {re.id}, key: {re.key}, value: {re.value}, </p>)
            }));
    }

    const displayLink =()=> {
        return (<a href={MRLink}> {MRLink} </a>);
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

    return (
        <div className="App">
            <h1> Geek Speak </h1>
            <SearchInput
                placeholder="input search text"
                style={{
                    width: 200,
                    textAlign: "left"
                }}
            />
            <br/>
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
                {/*<Input onChange={debouncedChangeRemoteBranch} placeholder="Source Branch" style={{width: '16%', marginRight: '5%'}}/>*/}
                <Button type="primary" onClick={handleRepositoryFile} > Update Database </Button>
            </span>
            <br/>
            <br/>
            <span>
                <Input onChange={onChangeTarget} placeholder="Search Value" style={{width: '36%', marginRight: '5%'}}/>
                <Button type="primary" onClick={handleSearch} style={{marginRight: '5%'}}>Search</Button>
              </span>
            {displayData()}
            <br/>
            <br/>
            <span>
                <Input onChange={onChangeEntryID} placeholder="Entry ID" style={{width: '8%', marginRight: '3%'}}/>
                <Input onChange={onChangeUpdatedValue} placeholder="Updated Value" style={{width: '30%', marginRight: '5%'}}/>
                <Button type="primary" onClick={handleUpdateValue}>Update</Button>
            </span>
            <br/>
            <br/>
            <span>
                <Input onChange={onChangeAdd} placeholder="New Branch" style={{width: '16%', marginRight: '5%'}}/>
                <Button type="primary" onClick={handleMergeRequest}>Merge Request</Button>
            </span>
            <br/>
            {displayLink()}
            {/*<br />
      <br />
      <span>
        <Input onChange={onChangeCommitMessage} style={{ width: '30%', marginRight: '5%' }} />
        <Button type="primary" onClick={handleCommit} style={{marginRight: '5%'}}>Commit</Button>
        <Button type="primary" onClick={handleMergeRequest}>Merge Request</Button>
      </span>
      *<br />
      <br />
      <Button type="primary" onClick={handleRepositoryFile}>fetch file</Button>
      <p>{entries}</p>*/}
        </div>
    );
}

export default App;
