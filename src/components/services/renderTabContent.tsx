import type { ReactNode } from "react";

import { urlForImage } from "@/sanity/lib/image";
import type {
  ContentBlock,
  SanityFeatureItem,
  TextBlock,
} from "@/sanity/lib/types";

import { ExclusiveAccordionGroup } from "./Accordion";
import { FeatureGrid, LinkList, type FeatureItem } from "./FeatureGrid";

function toFeatureItems(items: SanityFeatureItem[]): FeatureItem[] {
  return items.map((item) => ({
    label: item.label,
    image: item.icon
      ? urlForImage(item.icon).width(128).height(128).fit("max").url()
      : undefined,
  }));
}

function TextBlockEl({ block }: { block: TextBlock }) {
  switch (block.style) {
    case "intro":
      return (
        <p className="text-[32px] font-normal leading-none text-[#c1c7c7]">
          {block.text}
        </p>
      );
    case "label":
      return (
        <p className="text-2xl font-normal leading-[0.9] text-[#c1c7c7]">
          {block.text}
        </p>
      );
    case "title":
      return (
        <p className="text-2xl font-normal text-[#eaefef]">{block.text}</p>
      );
    case "body":
      return (
        <p className="mt-3 text-xl font-light text-[#c1c7c7]">
          {block.text}
        </p>
      );
    default:
      return null;
  }
}

function BlockEl({ block }: { block: ContentBlock }) {
  switch (block._type) {
    case "textBlock":
      return <TextBlockEl block={block} />;
    case "featureGridBlock":
      return (
        <div className="flex flex-col gap-6">
          {block.heading && (
            <p className="text-2xl font-normal leading-[0.9] text-[#c1c7c7]">
              {block.heading}
            </p>
          )}
          <FeatureGrid items={toFeatureItems(block.items)} />
        </div>
      );
    case "linkListBlock":
      return (
        <div>
          {block.heading && (
            <p className="text-2xl font-normal leading-[0.9] text-[#c1c7c7]">
              {block.heading}
            </p>
          )}
          <div className={block.heading ? "mt-3" : undefined}>
            <LinkList items={block.items} />
          </div>
        </div>
      );
    case "accordionGroupBlock":
      return (
        <ExclusiveAccordionGroup
          defaultOpenIndex={0}
          items={block.items.map((panel) => ({
            title: panel.title,
            content: <FeatureGrid items={toFeatureItems(panel.items)} />,
          }))}
        />
      );
    default:
      return null;
  }
}

// Consecutive "title" + "body" text blocks (the Tanks & Containers style
// heading pairing) render as one tight unit rather than getting the
// standard gap applied between every block.
type RenderGroup =
  | { kind: "titleBody"; key: string; title: TextBlock; body: TextBlock }
  | { kind: "single"; key: string; block: ContentBlock };

function groupBlocks(blocks: ContentBlock[]): RenderGroup[] {
  const groups: RenderGroup[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    if (
      block._type === "textBlock" &&
      block.style === "title" &&
      next?._type === "textBlock" &&
      next.style === "body"
    ) {
      groups.push({ kind: "titleBody", key: block._key, title: block, body: next });
      i++;
    } else {
      groups.push({ kind: "single", key: block._key, block });
    }
  }
  return groups;
}

/**
 * Turns a tab's Sanity content blocks into the same JSX shape the
 * ServiceSection card expects. If the tab opens with an "intro"
 * paragraph, that paragraph stays pinned to the top of the card and
 * everything else is vertically centered beneath it; otherwise the
 * whole content block is centered as a group.
 */
export function renderTabContent(blocks: ContentBlock[]): ReactNode {
  const groups = groupBlocks(blocks);
  const hasIntro =
    groups[0]?.kind === "single" &&
    groups[0].block._type === "textBlock" &&
    groups[0].block.style === "intro";

  const renderGroup = (group: RenderGroup) => {
    if (group.kind === "titleBody") {
      return (
        <div key={group.key}>
          <TextBlockEl block={group.title} />
          <TextBlockEl block={group.body} />
        </div>
      );
    }
    return <BlockEl key={group.key} block={group.block} />;
  };

  if (hasIntro) {
    const [intro, ...rest] = groups;
    return (
      <div className="flex h-full flex-col">
        {renderGroup(intro)}
        <div className="flex flex-1 flex-col justify-center gap-8 pt-16">
          {rest.map(renderGroup)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-8">
      {groups.map(renderGroup)}
    </div>
  );
}
