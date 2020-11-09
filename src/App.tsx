import React, { useState } from "react";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { Button } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import logo from "./logo.svg";
import { Event, Resource } from "./types/timelineTypes";
import { trumpTimeline } from "./mocks/timelineMock";
import "./reset.css";
import "./App.css";
import "antd/dist/antd.css";

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

const Resources: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <aside>
      <div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          type="link"
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

const EventElement: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <article className="Event">
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

function App() {
  const { title, events } = trumpTimeline;
  const structuredEvents = structureEvents(events);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{title}</h1>
      </header>
      <main className="Timeline">
        <ol className="Timeline-yearList">
          {structuredEvents.map(({ year, events }) => (
            <li className="Timeline-yearListItem" key={year}>
              <h2 className="Timeline-yearHeader">{year}</h2>
              <ol className="Timeline-eventsList">
                {events.map((event) => (
                  <li className="Timeline-eventsListItem" key={event.id}>
                    <div className="Timeline-eventsListItemContent">
                      <span className="Timeline-eventsListBullet">&nbsp;</span>
                      <span className="Timeline-eventsListDate">
                        {formatter.format(new Date(event.date))}
                      </span>
                      <EventElement event={event} />
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
