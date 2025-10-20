'use client';
import type { JSX } from 'react';
import { useEffect } from 'react';
// import Lexical components
import { $getRoot }from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// added plugins
import TitlePlugin from './Plugin/TitlePlugin';
import ClearAllPlugin from './Plugin/ClearAllPlugin';
import PlaceholderPlugin from './Plugin/PlaceholderPlugin';
import SelectionToolbarPlugin from './Plugin/SelectionToolbarPlugin';
import Toolbar from './Toolbar/Toolbar';

export default function Editor(): JSX.Element {

    function LogOnChangePlugin() {
        const [editor] = useLexicalComposerContext();

        useEffect(() => {
            return editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const text = $getRoot().getTextContent();
                    console.log('TEXT:', text);

                    const html = $generateHtmlFromNodes(editor);
                    console.log('HTML:', html);

                    const json = JSON.stringify(editorState.toJSON());
                    console.log('JSON:', json);
                });
            });
        }, [editor]);

        return null;
    }

    return (
        <div className='relative block px-[46px] md:px-[46px] max-[1025px]:px-[8px]'>
            {/* // this plugin add the title */}
            <TitlePlugin />

            {/* // this plugin add the placeholder */}
            <PlaceholderPlugin />

            {/* this plugin add the toolbar( bold, italic, underline, strikethrough, code) */}
            <Toolbar />

            {/* // this plugin add the editor */}
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className="min-h-[400px] resize-none focus:outline-none"
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />

            {/* <SelectionToolbarPlugin /> */}

            {/* // this plugin add the history */}
            <HistoryPlugin />

            {/* // this plugin add the auto focus */}
            <AutoFocusPlugin />

            {/* // this plugin add the clear all */}
            <ClearAllPlugin />

            {/* // this plugin add the log on change */}
            <LogOnChangePlugin />
        </div>
    )
}
