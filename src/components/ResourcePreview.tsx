import React from "react";
import { Resource } from "../types/timelineTypes";

interface ResourcePreviewProps {
  resource: Resource;
}

export const ResourcePreview: React.FC<ResourcePreviewProps> = ({
  resource,
}) => {
  const body = (() => {
    switch (resource.media) {
      case "video":
        return (
          <iframe
            id="ytplayer"
            width="100%"
            height="300"
            src={`${resource.location}?origin=${document.location.origin}`}
            frameBorder="0"
          ></iframe>
        );
      case "tweet":
        return null;
      case "article":
        return null;
      case "photo":
        return null;
      default:
        throw new Error(`Unhandled resource media type ${resource.media}`);
    }
  })();

  return <div>{body}</div>;
};
