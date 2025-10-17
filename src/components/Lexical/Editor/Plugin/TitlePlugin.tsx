import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, COMMAND_PRIORITY_CRITICAL, EditorState } from 'lexical';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';

export default function TitlePlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            editor.update(() => {
                const root = $getRoot();
                const firstChild = root.getFirstChild();
                
                
                // If the first child is not a HeadingNode...
                if (!$isHeadingNode(firstChild)) {
                    const newHeading = $createHeadingNode('h2');
                    if (firstChild === null) {
                        root.append(newHeading);
                    } else {
                        firstChild.replace(newHeading);
                    }
                    newHeading.select();
                }
            });
        });
    }, [editor]);

    return null;
}