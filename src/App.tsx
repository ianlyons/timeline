import React, { useState } from "react";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import findIndex from "lodash/findIndex";
import compact from "lodash/compact";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Event } from "./types/timelineTypes";
import { TimelineEvent } from "./components/TimelineEvent";
import { trumpTimeline } from "./mocks/timelineMock";
import "./reset.css";
import "antd/dist/antd.css";
import "./App.css";

const IS_DEV_MODE = document.location.search.indexOf("dev=true") > -1;

// const deletedEvents: any = {};

// function filterEvents(events: Event[]) {
//   return events.filter((event) => {
//     if (deletedEvents[event.id]) return false;
//     return true;
//   });
// }

function structureEvents(events: Event[]) {
  return map(
    groupBy(events, (event: Event) => new Date(event.date).getFullYear()),
    (events: Event[], year: string) => ({ year, events })
  );
}

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function App() {
  const { title } = trumpTimeline;
  const [eventsToDelete, setEventsToDelete] = useState<Record<string, boolean>>(
    {}
  );
  const [timeline, updateTimeline] = useState(trumpTimeline.events);

  function updateEvent(eventUpdate: Event, opts: { doDelete: boolean }) {
    const eventIndex = findIndex(timeline, { id: eventUpdate.id });
    if (!eventIndex)
      throw new Error(`Can't find event with ID ${eventUpdate.id}`);
    const nextTimeline = compact([
      ...timeline.slice(0, eventIndex - 1),
      opts.doDelete ? null : eventUpdate,
      ...timeline.slice(eventIndex + 1),
    ]);

    updateTimeline(nextTimeline);
  }

  const timelineByYear = structureEvents(timeline);

  console.log(eventsToDelete);
  return (
    <div className="App">
      <header className="App-header">
        <h1>{title}</h1>
      </header>
      <main className="Timeline">
        <ol className="Timeline-yearList">
          {timelineByYear.map(({ year, events }) => (
            <li className="Timeline-yearListItem" key={year}>
              <h2 className="Timeline-yearHeader">{year}</h2>
              <ol className="Timeline-eventsList">
                {events.map((event) => (
                  <li className="Timeline-eventsListItem" key={event.id}>
                    <div className="Timeline-eventsListItemContent">
                      <span className="Timeline-eventsListBullet">&nbsp;</span>
                      <span className="Timeline-eventsListDate">
                        {formatter.format(new Date(event.date))}&nbsp;
                        {IS_DEV_MODE && (
                          <Button
                            type="dashed"
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              setEventsToDelete({
                                ...eventsToDelete,
                                [event.id]: true,
                              })
                            }
                          />
                        )}
                      </span>
                      <TimelineEvent
                        deleted={eventsToDelete[event.id]}
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
