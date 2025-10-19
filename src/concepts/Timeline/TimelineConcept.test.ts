// @ts-nocheck
import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import TimelineConcept from "./TimelineConcept.ts";

const userA = "user:Ahmed" as ID;

Deno.test("Principle: create timeline, add entries, list chronologically", async () => {
  const [db, client] = await testDb();
  const concept = new TimelineConcept(db);
  try {
    const { timeline } = (await concept.createTimeline({ user: userA, name: "College Decisions" })) as { timeline: ID };
    assertExists(timeline);

    const t1 = new Date("2025-01-01T10:00:00.000Z").toISOString();
    const t2 = new Date("2025-02-01T10:00:00.000Z").toISOString();
    await concept.addEntry({ user: userA, name: "Consider CS", time: t1, timeline });
    await concept.addEntry({ user: userA, name: "Consider Psych", time: t2, timeline });

    const list = await concept._listEntriesChrono({ timeline });
    assertEquals(list.map((e) => e.name), ["Consider CS", "Consider Psych"]);
  } finally {
    await client.close();
  }
});

Deno.test("Variants: duplicate names, remove entry and timeline", async () => {
  const [db, client] = await testDb();
  const concept = new TimelineConcept(db);
  try {
    const { timeline } = (await concept.createTimeline({ user: userA, name: "T" })) as { timeline: ID };
    const time = new Date().toISOString();
    const { entry } = (await concept.addEntry({ user: userA, name: "E1", time, timeline })) as { entry: ID };

    const dup = await concept.addEntry({ user: userA, name: "E1", time, timeline });
    assertEquals("error" in dup, true);

    const del = await concept.removeEntry({ user: userA, entry });
    assertEquals("error" in del, false);

    const rmTl = await concept.removeTimeLine({ user: userA, timeline });
    assertEquals("error" in rmTl, false);
  } finally {
    await client.close();
  }
});


