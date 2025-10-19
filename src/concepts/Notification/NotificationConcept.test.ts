// @ts-nocheck
import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import NotificationConcept from "./NotificationConcept.ts";

const userA = "user:Ahmed" as ID;

Deno.test("Principle: schedule then send at exact time", async () => {
  const [db, client] = await testDb();
  const concept = new NotificationConcept(db);
  try {
    const time = new Date().toISOString();
    const setRes = await concept.setMessage({
      user: userA,
      content: "Remember to reflect on your choice",
      time,
      topic: "Reminder",
    });
    assertEquals("error" in setRes, false);
    const { message } = setRes as { message: ID };
    assertExists(message);

    const before = await concept._getUserMessages({ user: userA });
    console.log("Scheduled messages count:", before.length);

    const sendRes = await concept.sendMessage({ message, current: time });
    assertEquals("error" in sendRes, false);
    assertEquals((sendRes as { content: string }).content, "Remember to reflect on your choice");
    assertEquals((sendRes as { topic: string }).topic, "Reminder");

    const after = await concept._getUserMessages({ user: userA });
    assertEquals(after.length, 0, "Message should be removed after sending");
  } finally {
    await client.close();
  }
});

Deno.test("Variant: sending at wrong time fails and does not delete", async () => {
  const [db, client] = await testDb();
  const concept = new NotificationConcept(db);
  try {
    const time = new Date().toISOString();
    const wrongTime = new Date(Date.now() + 1000).toISOString();
    const { message } = (await concept.setMessage({
      user: userA,
      content: "Ping",
      time,
      topic: "Reminder",
    })) as { message: ID };

    const res = await concept.sendMessage({ message, current: wrongTime });
    assertEquals("error" in res, true);

    const stillThere = await concept._getUserMessages({ user: userA });
    assertEquals(stillThere.length, 1);
  } finally {
    await client.close();
  }
});

Deno.test("Variant: sending non-existent message fails", async () => {
  const [db, client] = await testDb();
  const concept = new NotificationConcept(db);
  try {
    const res = await concept.sendMessage({
      message: "message:missing" as ID,
      current: new Date().toISOString(),
    });
    assertEquals("error" in res, true);
  } finally {
    await client.close();
  }
});


