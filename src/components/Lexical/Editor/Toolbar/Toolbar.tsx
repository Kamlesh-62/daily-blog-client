import React, { useState, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    REDO_COMMAND,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { createPortal } from "react-dom";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from '@lexical/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faStrikethrough, faUnderline, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import BlockOptionsDropdownList from "./BlockOptionsDropdownList/BlockOptionsDropdownList";

const Toolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);

    const LowPriority = 1;

    const supportedBlockTypes = new Set([
        "paragraph",
        "quote",
        "code",
        "h1",
        "h2",
        "ul",
        "ol"
    ]);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsCode(selection.hasFormat('code'));
        }
    }, [editor]);


    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [updateToolbar, editor]);

    return (
        <div className="fixed z-20 shadow bottom-8 left-1/2 transform -translate-x-1/2 min-w-52 h-10 px-2 py-2 mb-4 space-x-2 flex items-center">
            {supportedBlockTypes.has(blockType) && (
                <BlockOptionsDropdownList

                    editor={editor}
                    blockType={blockType}
                    toolbarRef={null}
                    setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                />
            )}
            <div onClick={() => {
                canUndo && editor.dispatchCommand(UNDO_COMMAND, undefined);
            }} className={canUndo ? 'text-black bold bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                <FontAwesomeIcon icon={faRotateLeft} />
            </div>
            <div onClick={() => {
                canRedo && editor.dispatchCommand(REDO_COMMAND, undefined);
            }} className={canRedo ? 'text-black bold bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                <FontAwesomeIcon icon={faRotateRight} />
            </div>
            <div onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }} className={isBold ? 'text-black bold bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                <FontAwesomeIcon icon={faBold} />
            </div>
            <div onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
                className={isItalic ? 'text-black italic bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                <FontAwesomeIcon icon={faItalic} />
            </div>
            <div onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
                className={isStrikethrough ? 'text-black strikethrough bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                <FontAwesomeIcon icon={faStrikethrough} />
            </div>
            <div onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
                className={isUnderline ? 'text-black underline bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                <FontAwesomeIcon icon={faUnderline} />
            </div>
            <div onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
                className={isCode ? 'text-black code bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                Code
            </div>
        </div>
    );
};

export default Toolbar;
