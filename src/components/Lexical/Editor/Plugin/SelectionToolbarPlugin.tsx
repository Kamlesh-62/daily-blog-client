// src/Plugins/SelectionToolbarPlugin.tsx
import type { JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_LOW,
    createCommand,
    LexicalCommand,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

// Custom commands
export const UPPERCASE_COMMAND: LexicalCommand<void> = createCommand('UPPERCASE_COMMAND');
export const LOWERCASE_COMMAND: LexicalCommand<void> = createCommand('LOWERCASE_COMMAND');
export const TOGGLE_HIGHLIGHT_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_HIGHLIGHT_COMMAND');

const HIGHLIGHT_COLOR = '#d1fae5';

// Helpers to merge inline styles safely
function parseStyle(style: string): Record<string, string> {
    return style
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .reduce<Record<string, string>>((acc, decl) => {
            const [k, v] = decl.split(':').map(x => x.trim());
            if (k && v) acc[k.toLowerCase()] = v;
            return acc;
        }, {});
}

function toStyleString(obj: Record<string, string>): string {
    return Object.entries(obj)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
}

export default function SelectionToolbarPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const popupRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    // Compute a good anchor rect from current native selection
    const getSelectionRect = useCallback((): DOMRect | null => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.width + rect.height > 0) return rect;
        return null;
    }, []);

    // Position popup either above selection or at mouse coords (context menu)
    const positionPopupAt = useCallback((x?: number, y?: number) => {
        const el = popupRef.current;
        if (!el) return;

        let left = 0;
        let top = 0;

        if (typeof x === 'number' && typeof y === 'number') {
            // Position near mouse
            left = x - el.offsetWidth / 2;
            top = y - el.offsetHeight - 8;
        } else {
            // Position over selection
            const rect = getSelectionRect();
            if (!rect) return;
            left = rect.left + rect.width / 2 - el.offsetWidth / 2 + window.scrollX;
            top = rect.top - el.offsetHeight - 8 + window.scrollY;
        }

        // Keep within viewport
        const pad = 8;
        left = Math.max(pad + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - el.offsetWidth - pad));
        top = Math.max(pad + window.scrollY, Math.min(top, window.scrollY + window.innerHeight - el.offsetHeight - pad));

        el.style.opacity = '1';
        el.style.transform = 'translate3d(0,0,0)';
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
    }, [getSelectionRect]);

    // Core: when selection changes, show/hide and position
    useEffect(() => {
        const unregister = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                editor.getEditorState().read(() => {
                    const selection = $getSelection();
                    const show = $isRangeSelection(selection) && !selection.isCollapsed() && selection.getTextContent() !== '';
                    setVisible(show);
                    if (show) {
                        requestAnimationFrame(() => positionPopupAt());
                    }
                });
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
        return unregister;
    }, [editor, positionPopupAt]);

    // Also reposition on window events
    useEffect(() => {
        const onScrollOrResize = () => {
            if (!visible) return;
            positionPopupAt();
        };
        window.addEventListener('scroll', onScrollOrResize, true);
        window.addEventListener('resize', onScrollOrResize);
        return () => {
            window.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, [visible, positionPopupAt]);

    // Right-click to show toolbar at cursor if there is a non-empty selection
    useEffect(() => {
        const rootEl = editor.getRootElement();
        if (!rootEl) return;

        const onContextMenu = (e: MouseEvent) => {
            const sel = window.getSelection();
            const hasRange = sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed;
            if (!hasRange) return;
            e.preventDefault();
            setVisible(true);
            requestAnimationFrame(() => positionPopupAt(e.clientX + window.scrollX, e.clientY + window.scrollY));
        };

        rootEl.addEventListener('contextmenu', onContextMenu);
        return () => rootEl.removeEventListener('contextmenu', onContextMenu);
    }, [editor, positionPopupAt]);

    // Click outside hides the popup
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            const el = popupRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) setVisible(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    // Register command handlers
    useEffect(() => {
        const cleanups = [
            editor.registerCommand(
                UPPERCASE_COMMAND,
                () => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            selection.getNodes().forEach(node => {
                                if ($isTextNode(node)) node.setTextContent(node.getTextContent().toUpperCase());
                            });
                        }
                    });
                    return true;
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerCommand(
                LOWERCASE_COMMAND,
                () => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            selection.getNodes().forEach(node => {
                                if ($isTextNode(node)) node.setTextContent(node.getTextContent().toLowerCase());
                            });
                        }
                    });
                    return true;
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerCommand(
                TOGGLE_HIGHLIGHT_COMMAND,
                () => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection) && selection.isCollapsed() && selection.getTextContent() !== '') {
                            selection.getNodes().forEach(node => {
                                if ($isTextNode(node)) {
                                    const current = parseStyle(node.getStyle());
                                    if ((current['background-color'] || '').toLowerCase() === HIGHLIGHT_COLOR) {
                                        delete current['background-color'];
                                    } else {
                                        current['background-color'] = HIGHLIGHT_COLOR;
                                    }
                                    node.setStyle(toStyleString(current));
                                }
                            });
                        }
                    });
                    return true;
                },
                COMMAND_PRIORITY_CRITICAL
            ),
        ];
        return () => cleanups.forEach(off => off());
    }, [editor]);

    if (!visible) return null;

    return (
        <div
            ref={popupRef}
            className="
        fixed z-50 rounded-md border border-slate-200 bg-white shadow-lg
        px-2 py-1 flex items-center gap-1 text-sm select-none
      "
            style={{ opacity: 0, transform: 'translate3d(0,-8px,0)' }}
        >
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className="px-2 py-1 rounded hover:bg-slate-100 active:bg-slate-200"
                title="Bold"
                type="button"
            >
                <span className="font-semibold">B</span>
            </button>

            <div className="w-px h-4 bg-slate-200 mx-1" />

            <button
                onClick={() => editor.dispatchCommand(UPPERCASE_COMMAND, undefined)}
                className="px-2 py-1 rounded hover:bg-slate-100 active:bg-slate-200"
                title="UPPERCASE"
                type="button"
            >
                UPPER
            </button>
            <button
                onClick={() => editor.dispatchCommand(LOWERCASE_COMMAND, undefined)}
                className="px-2 py-1 rounded hover:bg-slate-100 active:bg-slate-200"
                title="lowercase"
                type="button"
            >
                lower
            </button>

            <div className="w-px h-4 bg-slate-200 mx-1" />

            <button
                onClick={() => editor.dispatchCommand(TOGGLE_HIGHLIGHT_COMMAND, undefined)}
                className="px-2 py-1 rounded hover:bg-emerald-100 active:bg-emerald-200"
                title="Highlight"
                type="button"
                style={{ backgroundColor: HIGHLIGHT_COLOR }}
            >
                Highlight
            </button>
        </div>
    );
}
