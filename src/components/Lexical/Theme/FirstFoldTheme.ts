// theme.ts
// Tailwind utility classes mapped to Lexical theme slots.
// No safelist needed because class names are static.

export default {
  code: "font-mono text-sm rounded px-1 py-[2px] bg-black/5",
  heading: {
    h1: "text-3xl font-semibold leading-tight my-3",
    h2: "text-2xl font-semibold leading-tight my-3",
    h3: "text-xl font-semibold leading-snug my-2.5",
    h4: "text-lg font-semibold leading-snug my-2",
    h5: "text-base font-semibold leading-snug my-2",
  },
  image: "max-w-full h-auto rounded",
  link: "text-blue-600 underline underline-offset-2 hover:text-blue-700",
  list: {
    listitem: "ml-6",
    nested: { listitem: "ml-6" },
    ol: "list-decimal ml-6 space-y-1",
    ul: "list-disc ml-6 space-y-1",
  },
  paragraph: "leading-7 my-2",
  placeholder: "pointer-events-none text-gray-400",
  quote: "border-l-4 border-gray-300 pl-3 italic text-gray-700 my-3",
  text: {
    bold: "font-bold",
    code: "font-mono text-[0.9em] rounded px-1 bg-black/5",
    hashtag: "text-blue-600",
    italic: "italic",
    overflowed: "overflow-hidden text-ellipsis whitespace-nowrap",
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
};
