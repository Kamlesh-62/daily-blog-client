import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';

export default function PlaceholderPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();

    // State to control the visibility of each placeholder
    const [showTitlePlaceholder, setShowTitlePlaceholder] = useState(false);
    const [showBodyPlaceholder, setShowBodyPlaceholder] = useState(false);

    useEffect(() => {
        const unregister = editor.registerUpdateListener(({ editorState }) => {
            // Read the state of the editor to determine which placeholders to show
            editorState.read(() => {
                const root = $getRoot();
                const firstChild = root.getFirstChild();
                const secondChild = firstChild ? firstChild.getNextSibling() : null;
                const secondChildren = firstChild ? firstChild.getNextSiblings() : null;

                // Check title placeholder visibility
                const titleIsEmpty = $isHeadingNode(firstChild) && firstChild.getTextContentSize() === 0;
                setShowTitlePlaceholder(titleIsEmpty);

                // Check body placeholder visibility
                const bodyIsTextEmpty = secondChild ? secondChild.getTextContentSize() === 0 : false;
                const bodyIsEmpty = secondChildren ? secondChildren?.length === 1 && bodyIsTextEmpty : false;
                setShowBodyPlaceholder(bodyIsEmpty);
            });
        });

        return unregister;
    }, [editor]);

    const titlePlaceholder = (
        <div className="absolute top-0 left-[46px] text-[22px] text-[#999] overflow-hidden text-ellipsis whitespace-nowrap select-none inline-block pointer-events-none max-[1025px]:left-[8px]">
            Enter a title...
        </div>
    );

    const bodyPlaceholder = (
        <div className="absolute top-[40px] left-[46px] text-[15px] text-[#999] overflow-hidden text-ellipsis whitespace-nowrap select-none inline-block pointer-events-none max-[1025px]:left-[8px]">
            Start writing your post here...
        </div>
    );

    return (
        <>
            {showTitlePlaceholder && titlePlaceholder}
            {showBodyPlaceholder && bodyPlaceholder}
        </>
    );
}