import React, { useState } from "react";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import keyBy from "lodash/keyBy";
import orderBy from "lodash/orderBy";
import compact from "lodash/compact";
import extend from "lodash/extend";
import omit from "lodash/omit";
import { Button } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import { Event } from "./types/timelineTypes";
import { TimelineEvent, AddTimelineEvent } from "./components/TimelineEvent";
import { trumpTimeline } from "./mocks/timelineMock";
import "./reset.css";
import "antd/dist/antd.css";
import "./App.css";
import { merge } from "lodash";

const IS_DEV_MODE = document.location.search.indexOf("dev=true") > -1;

function structureEvents(events: EventIdMap) {
  return groupBy(orderBy(events, "date"), (event: Event) =>
    new Date(event.date).getFullYear()
  );
}

function normalizeEvents(events: Event[]) {
  return keyBy(
    events.map((event) => {
      event.tags = event.tags || [];
      return event;
    }),
    "id"
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

type ResourceIdMap = Record<string, boolean>;
type EventIdMap = Record<string, Event>;

function App() {
  const { title } = trumpTimeline;
  const [timeline, updateTimeline] = useState<EventIdMap>(
    normalizeEvents(trumpTimeline.events)
  );
  const [editingEvents, updateEditingEvents] = useState<ResourceIdMap>({});
  const [deletedEvents, updateDeletedEvents] = useState<ResourceIdMap>({});

  function updateEvent(eventUpdate: RecursivePartial<Event>) {
    if (!eventUpdate.id) throw new Error(`Event updates must have IDs.`);
    const nextTimeline = {
      ...timeline,
      [eventUpdate.id]: merge({}, timeline[eventUpdate.id], eventUpdate),
    };
    console.log(nextTimeline);
    updateTimeline(nextTimeline);
  }

  function addEvent(afterId: string) {
    const eventToAddAfter = timeline[afterId];
    const initialNewEventDate = new Date(eventToAddAfter.date);
    initialNewEventDate.setDate(initialNewEventDate.getDate() + 1);
    const newEvent: Event = {
      id: nanoid(),
      title: "",
      summary: "",
      date: initialNewEventDate.toISOString(),
      resources: [],
    };
    timeline[newEvent.id] = newEvent;
    updateTimeline(timeline);
    updateEditingEvents({ [newEvent.id]: true });
  }

  function copyTimelineContents(e: React.MouseEvent) {
    e.preventDefault();
    const serializedTimeline = JSON.stringify(
      compact(
        map(timeline, (event) => {
          if (deletedEvents[event.id]) return null;
          return event;
        })
      ),
      undefined,
      2
    );
    navigator.clipboard.writeText(serializedTimeline);
  }

  const timelineByYear = structureEvents(timeline);
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
        <aside className="Timeline-summary">
          <ul>
            <li>{Object.keys(timeline).length} events</li>
          </ul>
        </aside>
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
                                  ...deletedEvents,
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
                    <div>
                      <AddTimelineEvent addEvent={() => addEvent(event.id)} />
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
