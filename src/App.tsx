import React, { useState } from "react";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import findIndex from "lodash/findIndex";
import compact from "lodash/compact";
import extend from "lodash/extend";
import omit from "lodash/omit";
import { Button } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Event, EventUI } from "./types/timelineTypes";
import { TimelineEvent } from "./components/TimelineEvent";
import { trumpTimeline } from "./mocks/timelineMock";
import "./reset.css";
import "antd/dist/antd.css";
import "./App.css";

const IS_DEV_MODE = document.location.search.indexOf("dev=true") > -1;

function structureEvents(events: EventUI[]) {
  return groupBy(events, (event: EventUI) =>
    new Date(event.date).getFullYear()
  );
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function addInterfacePropertiesToEvents(events: Event[]): EventUI[] {
  return events.map((e) => ({
    ...e,
    interface: {
      markedForDeletion: false,
      editing: false,
    },
  }));
}

type ResourceIdMap = Record<string, boolean>;

function App() {
  const { title } = trumpTimeline;
  const [timeline, updateTimeline] = useState(
    addInterfacePropertiesToEvents(trumpTimeline.events)
  );
  const [editingEvents, updateEditingEvents] = useState<ResourceIdMap>({});
  const [deletedEvents, updateDeletedEvents] = useState<ResourceIdMap>({});

  function updateEvent(eventUpdate: RecursivePartial<EventUI>) {
    const eventIndex = findIndex(timeline, { id: eventUpdate.id });
    if (eventIndex === -1)
      throw new Error(`Can't find event with ID ${eventUpdate.id}`);
    const nextTimeline = compact([
      ...timeline.slice(0, eventIndex),
      extend({}, timeline[eventIndex], eventUpdate),
      ...timeline.slice(eventIndex + 1),
    ]);

    updateTimeline(nextTimeline);
  }

  const timelineByYear = structureEvents(timeline);

  function copyTimelineContents(e: React.MouseEvent) {
    e.preventDefault();
    const serializedTimeline = JSON.stringify(
      compact(
        timeline.map((event) => {
          if (deletedEvents[event.id]) return null;
          return omit(event, "interface");
        })
      ),
      undefined,
      2
    );
    navigator.clipboard.writeText(serializedTimeline);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{title}</h1>
        {IS_DEV_MODE && (
          <span className="App-copyButton">
            <Button onClick={copyTimelineContents}>Copy timeline</Button>
          </span>
        )}
      </header>
      <main className="Timeline">
        <ol className="Timeline-yearList">
          {map(timelineByYear, (events, year) => (
            <li className="Timeline-yearListItem" key={year}>
              <h2 className="Timeline-yearHeader">{year}</h2>
              <ol className="Timeline-eventsList">
                {events.map((event, i) => (
                  <li
                    className="Timeline-eventsListItem"
                    key={`${event.id}-${i}`}
                  >
                    <div className="Timeline-eventsListItemContent">
                      <span className="Timeline-eventsListBullet">&nbsp;</span>
                      <span className="Timeline-eventsListDate">
                        {formatter.format(new Date(event.date))}&nbsp;
                        {IS_DEV_MODE && (
                          <span className="Timeline-eventsListControls">
                            <Button
                              type={
                                deletedEvents[event.id] ? "primary" : "dashed"
                              }
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                updateDeletedEvents({
                                  [event.id]: !deletedEvents[event.id],
                                })
                              }
                            />
                            <Button
                              type={
                                editingEvents[event.id] ? "primary" : "dashed"
                              }
                              icon={<FormOutlined />}
                              onClick={() =>
                                updateEditingEvents({
                                  [event.id]: !editingEvents[event.id],
                                })
                              }
                            />
                          </span>
                        )}
                      </span>
                      <TimelineEvent
                        deleted={deletedEvents[event.id]}
                        editing={editingEvents[event.id]}
                        updateEvent={updateEvent}
                        event={event}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

export default App;
