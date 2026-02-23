import { generateKey } from "./sanityAdmin";

interface SanitySpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface SanityMarkDef {
  _type: string;
  _key: string;
  href?: string;
}

interface SanityBlock {
  _type: "block";
  _key: string;
  style: string;
  markDefs: SanityMarkDef[];
  children: SanitySpan[];
  listItem?: string;
  level?: number;
}

type PortableTextBlock = SanityBlock;

function parseInlineMarks(
  text: string
): { spans: SanitySpan[]; markDefs: SanityMarkDef[] } {
  const spans: SanitySpan[] = [];
  const markDefs: SanityMarkDef[] = [];

  // Regex-based tokenizer for **bold**, *italic*, [link](url)
  const regex =
    /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      if (before) {
        spans.push({
          _type: "span",
          _key: generateKey(),
          text: before,
          marks: [],
        });
      }
    }

    if (match[1] !== undefined) {
      // **bold**
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[1],
        marks: ["strong"],
      });
    } else if (match[2] !== undefined) {
      // *italic*
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[2],
        marks: ["em"],
      });
    } else if (match[3] !== undefined && match[4] !== undefined) {
      // [text](url)
      const linkKey = generateKey();
      markDefs.push({ _type: "link", _key: linkKey, href: match[4] });
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[3],
        marks: [linkKey],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    spans.push({
      _type: "span",
      _key: generateKey(),
      text: text.slice(lastIndex),
      marks: [],
    });
  }

  if (spans.length === 0) {
    spans.push({
      _type: "span",
      _key: generateKey(),
      text: "",
      marks: [],
    });
  }

  return { spans, markDefs };
}

export function markdownToBlocks(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const lines = markdown.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const style = `h${level}`;
      const { spans, markDefs } = parseInlineMarks(headingMatch[2]);
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style,
        markDefs,
        children: spans,
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const text = line.slice(2);
      const { spans, markDefs } = parseInlineMarks(text);
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "blockquote",
        markDefs,
        children: spans,
      });
      i++;
      continue;
    }

    // Bullet list items
    const bulletMatch = line.match(/^[\-\*]\s+(.+)/);
    if (bulletMatch) {
      const { spans, markDefs } = parseInlineMarks(bulletMatch[1]);
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "normal",
        markDefs,
        children: spans,
        listItem: "bullet",
        level: 1,
      });
      i++;
      continue;
    }

    // Normal paragraph
    const { spans, markDefs } = parseInlineMarks(line);
    blocks.push({
      _type: "block",
      _key: generateKey(),
      style: "normal",
      markDefs,
      children: spans,
    });
    i++;
  }

  return blocks;
}
