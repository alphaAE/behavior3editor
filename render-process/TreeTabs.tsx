import Editor from "./Editor";
import React, { Component } from "react";
import { Layout, Tabs, message } from "antd";
import { ipcRenderer } from "electron";
import * as path from "path";

import "antd/dist/antd.dark.css";
import MainEventType from "../common/MainEventType";
import { BehaviorTreeModel } from "../common/BehaviorTreeModel";

const { TabPane } = Tabs;

interface TreeTabsProps {
    onTabSelected: (path: string) => void;
}

interface TreeInfo {
    filepath: string;
    unsave?: boolean;
}

interface TreeTabsState {
    trees: TreeInfo[];
    curTree?: string;
}

export default class TreeTabs extends Component<TreeTabsProps, TreeTabsState> {
    state: TreeTabsState = {
        trees: [],
    };

    editors: { [path: string]: Editor } = {};

    componentDidMount() {
        ipcRenderer.on(MainEventType.CREATE_NODE, (event: any, name: any) => {
            const editor = this.getCurEditor();
            editor?.createNode(name);
        });

        ipcRenderer.on(MainEventType.DELETE_NODE, () => {
            const editor = this.getCurEditor();
            editor?.deleteNode();
        });

        ipcRenderer.on(MainEventType.COPY_NODE, () => {
            const editor = this.getCurEditor();
            editor?.copyNode();
        });

        ipcRenderer.on(MainEventType.PASTE_NODE, () => {
            const editor = this.getCurEditor();
            editor?.pasteNode();
        });

        ipcRenderer.on(MainEventType.SAVE, (event: any) => {
            const { curTree: curPath } = this.state;
            if (!curPath) {
                return;
            }
            const editor = this.editors[curPath];
            editor.save();
            message.success("已保存Json");
        });

        ipcRenderer.on(MainEventType.SAVE_ALL, (event: any) => {
            for (let k in this.editors) {
                let editor = this.editors[k];
                editor.save();
            }
            message.success("已保存所有行为树");
        });

        ipcRenderer.on(MainEventType.UNDO, () => {
            const editor = this.getCurEditor();
            editor?.undo();
        });

        ipcRenderer.on(MainEventType.REDO, () => {
            const editor = this.getCurEditor();
            editor?.redo();
        });
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.props.onTabSelected(this.state.curTree);
        }, 500);
    }

    getOpenTreesModel() {
        const trees: BehaviorTreeModel[] = []
        for (let k in this.editors) {
            let editor = this.editors[k];
            if (editor) {
                editor.save();
                trees.push(editor.getTreeModel());
            }
        }
        return trees;
    }

    getCurEditor() {
        const { curTree: curPath } = this.state;
        if (!curPath) {
            return;
        }
        return this.editors[curPath];
    }

    openFile(path: string) {
        if (!this.state.trees.find(e => e.filepath == path)) {
            const trees = this.state.trees;
            trees.push({ filepath: path });
            this.setState({ trees, curTree: path });
        } else {
            this.setState({ curTree: path });
        }
    }

    closeFile(path: string) {
        let trees = this.state.trees;
        trees = trees.filter(tree => tree.filepath != path);
        const length = trees.length;
        this.setState({ trees: trees, curTree: length > 0 ? trees[0].filepath : null });
    }

    render() {
        const { trees, curTree } = this.state;
        console.log("render tabs", trees);
        if (!curTree) {
            return <div />;
        }
        this.editors = {};
        return (
            <Tabs
                hideAdd
                className="tabs"
                type="editable-card"
                defaultActiveKey={curTree}
                activeKey={curTree}
                onChange={(activeKey) => {
                    this.setState({ curTree: activeKey });
                }}
                onEdit={(targetKey, action) => {
                    if (action == "remove") {
                        this.closeFile(targetKey as string);
                    }
                }}
            >
                {trees.map((tree) => {
                    return (
                        <TabPane tab={`${path.basename(tree.filepath)}${tree.unsave?"*":''}`} key={tree.filepath}>
                            <Editor
                                filepath={tree.filepath}
                                onChangeSaveState={(unsave) => {
                                    if(tree.unsave != unsave) {
                                        tree.unsave = unsave;
                                        this.forceUpdate();
                                    } 
                                }}
                                ref={(ref) => {
                                    this.editors[tree.filepath] = ref;
                                }}
                            />
                        </TabPane>
                    );
                })}
            </Tabs>
        );
    }
}
