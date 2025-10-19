// @ts-nocheck
import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FormConcept from "./FormConcept.ts";

const userA = "user:Ahmed" as ID;

Deno.test("Principle: create, fill, submit", async () => {
  const [db, client] = await testDb();
  const concept = new FormConcept(db);
  try {
    const { form } = (await concept.createForm({
      user: userA,
      name: "Decision: Major Choice",
      fields: [
        { prompt: "Situation", charLimit: 200 },
        { prompt: "Options", charLimit: 200 },
        { prompt: "Reasoning", charLimit: 300 },
      ],
    })) as { form: ID };
    assertExists(form);

    const fields = await concept._getFormFields({ form });
    assertEquals(fields.length, 3);

    await concept.fillField({ user: userA, field: fields[0]._id, answer: "College choice context" });
    await concept.fillField({ user: userA, field: fields[1]._id, answer: "CS vs Psychology" });
    await concept.fillField({ user: userA, field: fields[2]._id, answer: "Leaning CS due to interests" });

    const now = new Date().toISOString();
    const res = await concept.submitForm({ user: userA, form, current: now });
    assertEquals("error" in res, false);
  } finally {
    await client.close();
  }
});

Deno.test("Variants: enforcement of charLimit and submission rules", async () => {
  const [db, client] = await testDb();
  const concept = new FormConcept(db);
  try {
    const { form } = (await concept.createForm({
      user: userA,
      name: "Test",
      fields: [{ prompt: "Short", charLimit: 5 }],
    })) as { form: ID };
    const [field] = await concept._getFormFields({ form });

    const tooLong = await concept.fillField({ user: userA, field: field._id, answer: "toolong" });
    assertEquals("error" in tooLong, true);

    await concept.fillField({ user: userA, field: field._id, answer: "short" });
    const now = new Date().toISOString();
    await concept.submitForm({ user: userA, form, current: now });

    const afterSubmitted = await concept.fillField({ user: userA, field: field._id, answer: "edit" });
    assertEquals("error" in afterSubmitted, true);
  } finally {
    await client.close();
  }
});


