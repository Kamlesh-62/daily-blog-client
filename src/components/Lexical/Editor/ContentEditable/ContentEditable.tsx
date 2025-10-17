import { JSX } from 'react';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

export default function LexicalContentEditable(): JSX.Element {

    return (
        <div className="relative">
            <ContentEditable
                className={`text-[16px] text-[#333] font-[400] leading-[1.5] max-[1025px]:text-[14px] max-[1025px]:leading-[1.4] focus:outline-none `}
            />
        </div>
    );
}
