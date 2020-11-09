import flatMap from "lodash/flatMap";
import map from "lodash/map";
import timeline1 from "./aolTimeline1.json";
import timeline2 from "./aolTimeline2.json";
import timeline3 from "./aolTimeline3.json";

// {
//   "additional": "true",
//   "body": "Trump attacks FBI, DOJ as Russia probe heats up",
//   "date": "2018-02-02T00:00-05:00",
//   "heading": "",
//   "id": 2081933,
//   "image": null,
//   "module": "headline",
//   "publish_at": "2018-02-02T09:06:00.000-05:00",
//   "source": null,
//   "url": "https://www.aol.com/article/news/2018/02/02/trump-attacks-the-fbi-and-justice-department-as-the-war-over-the-memo-and-russia-investigation-heat-up/23351141/",
//   "submodules": []
// },

export function getTimeline() {
  const results = flatMap([timeline1, timeline2, timeline3], (timeline) => {
    return mapItemsToEvents(timeline.items);
  });
  return results;
}

function mapItemsToEvents(items: any[]) {
  return map(items, (item, i) => {
    return {
      id: item.id,
      title: item.body,
      date: item.date,
      summary: "",
      resources: [
        {
          id: "resource-1",
          media: "article",
          source: "AOL",
          description: "Article",
          location: item.url,
        },
      ],
    };
  });
}
