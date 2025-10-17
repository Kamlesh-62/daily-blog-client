'use client';
import type { JSX } from 'react';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import TitlePlugin from './Plugin/TitlePlugin';
import ClearAllPlugin from './Plugin/ClearAllPlugin';
import PlaceholderPlugin from './Plugin/PlaceholderPlugin';
import SelectionToolbarPlugin from './Plugin/SelectionToolbarPlugin';
import Toolbar from './Toolbar/Toolbar';

export default function Editor(): JSX.Element {

    return (
        <div className='relative block px-[46px] md:px-[46px] max-[1025px]:px-[8px]'>
            <TitlePlugin />
            <PlaceholderPlugin />
            <Toolbar />
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                    className="min-h-[400px] resize-none focus:outline-none"
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <SelectionToolbarPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ClearAllPlugin />
        </div>
    )
}
