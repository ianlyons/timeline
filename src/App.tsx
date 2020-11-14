import React, { useState } from "react";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import findIndex from "lodash/findIndex";
import compact from "lodash/compact";
import extend from "lodash/extend";
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

function App() {
  const { title } = trumpTimeline;
  const [timeline, updateTimeline] = useState(
    addInterfacePropertiesToEvents(trumpTimeline.events.slice(0, 100))
  );

  function updateEvent(eventUpdate: RecursivePartial<EventUI>) {
    const eventIndex = findIndex(timeline, { id: eventUpdate.id });
    if (eventIndex === -1)
      throw new Error(`Can't find event with ID ${eventUpdate.id}`);
    console.log(timeline);
    const nextTimeline = compact([
      ...timeline.slice(0, eventIndex),
      extend({}, timeline[eventIndex], eventUpdate),
      ...timeline.slice(eventIndex + 1),
    ]);

    console.log("next", nextTimeline);

    updateTimeline(nextTimeline);
  }

  const timelineByYear = structureEvents(timeline);
  console.log(timelineByYear);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{title}</h1>
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
                                event.interface.markedForDeletion
                                  ? "primary"
                                  : "dashed"
                              }
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                updateEvent({
                                  id: event.id,
                                  interface: {
                                    markedForDeletion: !event.interface
                                      .markedForDeletion,
                                  },
                                })
                              }
                            />
                            <Button
                              type={
                                event.interface.editing ? "primary" : "dashed"
                              }
                              icon={<FormOutlined />}
                              onClick={() =>
                                updateEvent({
                                  id: event.id,
                                  interface: {
                                    editing: !event.interface.editing,
                                  },
                                })
                              }
                            />
                          </span>
                        )}
                      </span>
                      <TimelineEvent
                        deleted={event.interface.markedForDeletion}
                        editing={event.interface.editing}
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
