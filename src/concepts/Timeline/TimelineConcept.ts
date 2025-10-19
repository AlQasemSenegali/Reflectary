import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "../../utils/types.ts";
import { freshID } from "../../utils/database.ts";

const PREFIX = "TimeLine" + ".";

type User = ID;
type TimeLine = ID;
type Entry = ID;

interface TimeLineDoc {
  _id: TimeLine;
  user: User;
  name: string;
}

interface EntryDoc {
  _id: Entry;
  timeline: TimeLine;
  name: string;
  time: string; // ISO-8601
}

export default class TimelineConcept {
  timelines: Collection<TimeLineDoc>;
  entries: Collection<EntryDoc>;

  constructor(private readonly db: Db) {
    this.timelines = this.db.collection(PREFIX + "timelines");
    this.entries = this.db.collection(PREFIX + "entries");
  }

  async createTimeline(
    { user, name }: { user: User; name: string },
  ): Promise<{ timeline: TimeLine } | { error: string }> {
    const dup = await this.timelines.findOne({ user, name });
    if (dup) return { error: "Timeline name already exists for user." };
    const timeline = freshID() as TimeLine;
    await this.timelines.insertOne({ _id: timeline, user, name });
    return { timeline };
  }

  async addEntry(
    { user, name, time, timeline }: {
      user: User;
      name: string;
      time: string;
      timeline: TimeLine;
    },
  ): Promise<{ entry: Entry } | { error: string }> {
    const tl = await this.timelines.findOne({ _id: timeline });
    if (!tl || tl.user !== user) return { error: "Timeline not found for user." };
    const dupName = await this.entries.findOne({ timeline, name });
    if (dupName) return { error: "Entry with same name exists in timeline." };
    const entry = freshID() as Entry;
    await this.entries.insertOne({ _id: entry, timeline, name, time });
    return { entry };
  }

  async removeEntry(
    { user, entry }: { user: User; entry: Entry },
  ): Promise<Empty | { error: string }> {
    const ent = await this.entries.findOne({ _id: entry });
    if (!ent) return { error: "Entry not found." };
    const tl = await this.timelines.findOne({ _id: ent.timeline });
    if (!tl || tl.user !== user) return { error: "Entry not under user's timeline." };
    await this.entries.deleteOne({ _id: entry });
    return {};
  }

  async removeTimeLine(
    { user, timeline }: { user: User; timeline: TimeLine },
  ): Promise<Empty | { error: string }> {
    const tl = await this.timelines.findOne({ _id: timeline });
    if (!tl || tl.user !== user) return { error: "Timeline not found for user." };
    await this.entries.deleteMany({ timeline });
    await this.timelines.deleteOne({ _id: timeline });
    return {};
  }

  async _listEntriesChrono(
    { timeline }: { timeline: TimeLine },
  ): Promise<EntryDoc[]> {
    return await this.entries.find({ timeline }).sort({ time: 1 }).toArray();
  }
}


