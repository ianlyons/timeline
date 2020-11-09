import { EventEmitter } from "events";
import * as React from "react";
import { Chrono } from "react-chrono";
import { trumpTimeline } from "./mocks/timelineMock";

function mapEventsToChronoItems(events: any[]) {
  const formatter = new Intl.DateTimeFormat("en-US");
  return events.map((event) => {
    return {
      title: formatter.format(new Date(event.date)),
      cardTitle: event.title,
      cardDetailedText: "<ul><li>soemthing</li></ul>",
    };
  });
}

export function Timeline() {
  return (
    <Chrono
      mode="VERTICAL"
      items={mapEventsToChronoItems(trumpTimeline.events)}
    />
  );
}
