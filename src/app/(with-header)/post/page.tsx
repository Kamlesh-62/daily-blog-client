'use client';
import React, { JSX, useEffect } from "react";
import DailyBlogRichTextEditor from "@/components/Lexical/Lexical";
const Page = (): JSX.Element => {
    return (
        <div className="max-w-7xl mx-auto">
            <DailyBlogRichTextEditor />
        </div>
    )
}

export default Page;