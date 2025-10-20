// DailyBlogRichTextEditor.tsx
'use client';
import React from 'react';


// Import all necessary nodes
import Editor from './Editor/Editor';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { ParagraphNode, TextNode, $getRoot } from 'lexical';

// Import your custom components and plugins
import FirstFoldTheme from './Theme/FirstFoldTheme';

const editorConfig: InitialConfigType = {
    namespace: 'DailyBlogRichTextEditor',
    theme: FirstFoldTheme,
    onError: (error: Error) => console.error(error),
    nodes: [
        {
            replace: ParagraphNode,
            with: (node: ParagraphNode) => {
                return new ParagraphNode();
            },
        },
        HeadingNode,
        ParagraphNode,
        TextNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
    ],
    editorState: () => {
        const root = $getRoot();
        const heading = new HeadingNode('h2');
        heading.append(new TextNode('')); 
        const paragraph = new ParagraphNode();
        paragraph.append(new TextNode(''));
        root.append(heading, paragraph);
    },
};

const DailyBlogRichTextEditor = () => {
    return (
        <div className='p-4'>
            <LexicalComposer initialConfig={editorConfig}>
                <Editor />
            </LexicalComposer>
        </div>
    );
};

export default DailyBlogRichTextEditor;