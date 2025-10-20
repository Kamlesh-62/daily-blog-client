import React, { useState, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    TextFormatType,
} from 'lexical';
import { CLEAR_ALL_COMMAND } from '../Plugin/ClearAllPlugin';
import { mergeRegister } from '@lexical/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faStrikethrough, faUnderline, faCode } from '@fortawesome/free-solid-svg-icons'

const Toolbar = () => {
    
    const [editor] = useLexicalComposerContext();

    // State to track toolbar state
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [isCode, setIsCode] = useState<boolean>(false);

    // Function to update toolbar state
    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));
        }
    }, []);

    // Update the toolbar when selection changes
    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            })
        );
    }, [updateToolbar, editor]);

    // Function to handle code click
    const handleCodeClick = () => {
        if (isBold) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        if (isItalic) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        if (isUnderline) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        if (isStrikethrough) editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');

        // Finally, toggle the code format
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
    };

    // Function to handle format click
    const handleFormatClick = (format: TextFormatType) => {
        if (isCode) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }

        // Special handling for mutually exclusive underline/strikethrough
        if (format === 'underline' && isStrikethrough) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }
        if (format === 'strikethrough' && isUnderline) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }

        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    }

    return (
        <>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(CLEAR_ALL_COMMAND, undefined)}
                className="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 right-2 absolute  text-sm text-slate-600"
                title="Clear all"
            >
                Clear
            </button>
            <div className="fixed z-20 shadow bottom-8 left-1/2 transform -translate-x-1/2 min-w-52 h-10 px-10 py-10 mb-4 space-x-2 flex items-center">
                <div onClick={() => handleFormatClick('bold')} className={isBold ? 'text-black bold bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                    <FontAwesomeIcon icon={faBold} />
                </div>
                <div onClick={() => handleFormatClick('italic')}
                    className={isItalic ? 'text-black italic bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                    <FontAwesomeIcon icon={faItalic} />
                </div>
                <div onClick={() => handleFormatClick('strikethrough')}
                    className={isStrikethrough ? 'text-black strikethrough bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                    <FontAwesomeIcon icon={faStrikethrough} />
                </div>
                <div onClick={() => handleFormatClick('underline')}
                    className={isUnderline ? 'text-black underline bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                    <FontAwesomeIcon icon={faUnderline} />
                </div>
                <div onClick={handleCodeClick}
                    className={isCode ? 'text-black code bg-gray-200 px-2 py-1 rounded' : 'text-gray-800 px-2 py-1 rounded '}>
                    <FontAwesomeIcon icon={faCode} />
                </div>
            </div>
        </>
    );
};

export default Toolbar;
