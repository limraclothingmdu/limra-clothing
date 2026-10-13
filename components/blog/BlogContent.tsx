
import React from "react";

type BlogContentProps = {
  content: string;
};

export default function BlogContent({ content }: BlogContentProps) {
  const linkPattern =
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s<]+)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      elements.push(content.slice(lastIndex, match.index));
    }

    const label = match[1];
    const markdownUrl = match[2];
    const plainUrl = match[3];

    if (markdownUrl) {
      elements.push(
        <a
          key={key++}
          href={markdownUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
        >
          {label}
        </a>
      );
      lastIndex = match.index + match[0].length;
    } else if (plainUrl) {
      const url = plainUrl.replace(/[.,!?;:]+$/, "");
      const trailing = plainUrl.slice(url.length);

      elements.push(
        <React.Fragment key={key++}>
          <a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
>
            {url}
          </a>
          {trailing}
        </React.Fragment>
      );

      lastIndex = match.index + match[0].length;
    }
  }

  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }

  return (
    <div className="whitespace-pre-line break-words">
      {elements}
    </div>
  );
}
