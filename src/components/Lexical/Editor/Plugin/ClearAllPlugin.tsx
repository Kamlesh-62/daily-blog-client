// src/Plugins/ClearAllPlugin.tsx
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    
    $getRoot,
    COMMAND_PRIORITY_CRITICAL,
    createCommand,
    LexicalCommand,
    CLEAR_HISTORY_COMMAND
} from 'lexical';

export const CLEAR_ALL_COMMAND: LexicalCommand<void> = createCommand('CLEAR_ALL_COMMAND');

export default function ClearAllPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            CLEAR_ALL_COMMAND,
            () => {
                editor.update(() => {

                    const root = $getRoot();
                    root.clear();                        
                });
                editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined); 
                return true;
            },
            COMMAND_PRIORITY_CRITICAL
        );
    }, [editor]);

    return null;
}
