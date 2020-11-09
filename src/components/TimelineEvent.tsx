import React, { useState } from "react";
import { Button } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import { Resource, Event } from "../types/timelineTypes";
import { classes } from "../utils/styleUtils";

const Resources: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <aside>
      <div className="Resources-expandButton">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          type="text"
          icon={isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
        >
          References
        </Button>
      </div>
      {isExpanded && (
        <ul className="Resources">
          {resources.map((resource) => (
            <li className="Resources-resourceListItem" key={resource.id}>
              <a className="Resources-link" href={resource.location}>
                {resource.description}
              </a>{" "}
              ({resource.media}, {resource.source})
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

interface TimelineEventProps {
  event: Event;
  deleted: boolean;
  updateEvent: (updatedEvent: Event, opts: { doDelete: boolean }) => void;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  deleted,
}) => {
  return (
    <article className={classes("Event", deleted && "Event--deleted")}>
      <header className="Event-header">
        <h3 className="Event-title">{event.title}</h3>
      </header>
      <p className="Event-summary">{event.summary}</p>
      {event.resources.length && (
        <footer className="Event-resources">
          <Resources resources={event.resources} />
        </footer>
      )}
    </article>
  );
};
