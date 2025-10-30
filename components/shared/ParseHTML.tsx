"use client";

import { useEffect, useState } from "react";

import parse from "html-react-parser";
import Prism from "prismjs";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-mongodb";
import "prismjs/components/prism-python";
import "prismjs/components/prism-r";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-typescript";
// @ts-ignore
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";

interface Props {
  data: string;
}

const ParseHTML = ({ data }: Props) => {
  const [parsedContent, setParsedContent] = useState<React.ReactNode>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && data) {
      // Parse the HTML content
      setParsedContent(parse(data));

      // Highlight syntax after content is rendered
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }
  }, [data, isClient]);

  if (!isClient) {
    return <div className="min-h-[100px]" />; // Placeholder with min height
  }

  return (
    <div suppressHydrationWarning className={`markdown w-full min-w-full`}>
      {parsedContent}
    </div>
  );
};

export default ParseHTML;
