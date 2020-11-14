import React, { useState } from "react";
import extend from "lodash/extend";
import findIndex from "lodash/findIndex";
import uniqueId from "lodash/uniqueId";
import { Button, Input, Select } from "antd";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Resource, Event, Media } from "../types/timelineTypes";
import { classes } from "../utils/styleUtils";
import { nanoid } from "nanoid";

const { TextArea } = Input;

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

interface ResourceFieldProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  value: string;
}

const ResourceField: React.FC<ResourceFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const resourceFieldId = uniqueId("ResourceField");
  return (
    <div className="ResourceField">
      <label htmlFor={resourceFieldId}>{label}</label>
      <Input
        id={resourceFieldId}
        size="small"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

interface ResourceEditorProps {
  value: Resource;
  onChange: (updatedResource: Resource) => void;
  onDelete: (idToDelete: string) => void;
}

const mediaTypes: Media[] = ["article", "video", "tweet", "photo"];
const ResourceEditor: React.FC<ResourceEditorProps> = ({
  value,
  onChange,
  onDelete,
}) => {
  return (
    <li className="ResourceEditor">
      <div className="ResourceEditor-controls">
        <Button
          type="dashed"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(value.id)}
        />
      </div>
      <ResourceField
        value={value.description}
        label="Description"
        onChange={(e) =>
          onChange({ ...value, description: e.currentTarget.value })
        }
      />
      <ResourceField
        value={value.source}
        label="Source"
        onChange={(e) => onChange({ ...value, source: e.currentTarget.value })}
      />
      <ResourceField
        value={value.location}
        label="Location"
        onChange={(e) =>
          onChange({ ...value, location: e.currentTarget.value })
        }
      />
      <Select
        value={value.media}
        onChange={(nextValue) => onChange({ ...value, media: nextValue })}
        defaultValue={mediaTypes[0]}
      >
        {mediaTypes.map((mediaType) => {
          return (
            <Select.Option key={mediaType} value={mediaType}>
              {mediaType}
            </Select.Option>
          );
        })}
      </Select>
    </li>
  );
};

interface TimelineEventProps {
  event: Event;
  deleted: boolean;
  editing: boolean;
  updateEvent: (updatedEvent: Event) => void;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  deleted,
  editing,
  updateEvent,
}) => {
  const onChange = (update: Partial<Event>) => {
    const eventUpdate = extend({ ...event }, update);
    console.log(eventUpdate);
    updateEvent(eventUpdate);
  };

  const onChangeResource = (updatedResource: Resource) => {
    const resourceIndex = findIndex(
      event.resources,
      (r) => r.id === updatedResource.id
    );
    const nextResources = [
      ...event.resources.slice(0, resourceIndex),
      updatedResource,
      ...event.resources.slice(resourceIndex + 1),
    ];
    onChange({ resources: nextResources });
  };

  const deleteResource = (resourceId: string) => {
    const nextResources = event.resources.filter(
      (resource) => resource.id !== resourceId
    );
    console.log(nextResources);
    onChange({ resources: nextResources });
  };

  const addResource = () => {
    const nextResources = event.resources.slice();
    nextResources.push({
      id: nanoid(),
      description: "",
      location: "",
      source: "",
      media: mediaTypes[0],
    });
    onChange({ resources: nextResources });
  };

  if (editing) {
    return (
      <article className="Event Event--editing">
        <header className="Event-header">
          <Input
            size="large"
            value={event.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </header>
        <div className="Event-summary">
          <TextArea
            style={{ height: 300 }}
            value={event.summary}
            onChange={(e) => onChange({ summary: e.target.value })}
          />
        </div>
        <footer className="Event-resources">
          <ul>
            {event.resources.map((resource) => (
              <ResourceEditor
                key={resource.id}
                value={resource}
                onDelete={(id) => deleteResource(id)}
                onChange={onChangeResource}
              />
            ))}
          </ul>
          <Button className="Event-addResource" onClick={addResource}>
            Add resource
          </Button>
        </footer>
      </article>
    );
  }

  return (
    <article className={classes("Event", deleted && "Event--deleted")}>
      <header className="Event-header">
        <h3 className="Event-title">{event.title}</h3>
      </header>
      {!deleted && (
        <>
          <p className="Event-summary">{event.summary}</p>
          {event.resources.length && (
            <footer className="Event-resources">
              <Resources resources={event.resources} />
            </footer>
          )}
        </>
      )}
    </article>
  );
};
