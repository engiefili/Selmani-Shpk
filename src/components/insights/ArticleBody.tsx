import { PortableText, type PortableTextComponents } from "next-sanity";
import Link from "next/link";

import { blockText, slugify } from "@/lib/insights";

// Typography for article copy. Headings get an id (for the "In this
// article" table of contents) derived from their text.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-lg font-light leading-[1.75] text-[#c1c7c7] sm:text-[19px]">
        {children}
      </p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={slugify(blockText(value))}
        className="mb-4 mt-14 scroll-mt-28 text-[28px] font-normal leading-tight tracking-tight text-[#eaefef] sm:text-[34px]"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugify(blockText(value))}
        className="mb-3 mt-9 scroll-mt-28 text-xl font-medium leading-snug text-[#eaefef] sm:text-2xl"
      >
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 mt-2 flex flex-col gap-3">{children}</ul>,
    number: ({ children }) => (
      <ol className="mb-6 mt-2 flex list-decimal flex-col gap-3 pl-6 marker:text-accent">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 text-lg font-light leading-[1.65] text-[#c1c7c7] sm:text-[19px]">
        <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent" />
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="pl-1 text-lg font-light leading-[1.65] text-[#c1c7c7] sm:text-[19px]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-[#eaefef]">{children}</strong>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#";
      return href.startsWith("http") ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
          {children}
        </a>
      ) : (
        <Link href={href} className="text-accent underline underline-offset-4">
          {children}
        </Link>
      );
    },
  },
};

export default function ArticleBody({ value }: { value: Parameters<typeof PortableText>[0]["value"] }) {
  return <PortableText value={value} components={components} />;
}
