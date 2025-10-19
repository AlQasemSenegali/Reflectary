import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "../../utils/types.ts";
import { freshID } from "../../utils/database.ts";

const PREFIX = "Form" + ".";

type User = ID;
type Form = ID;
type Field = ID;

interface FormDoc {
  _id: Form;
  user: User;
  name: string;
  submissionTime: string; // ISO-8601 or "" for none
  submitted: boolean;
}

interface FieldDoc {
  _id: Field;
  form: Form;
  prompt: string;
  charLimit: number;
  answer: string;
}

export default class FormConcept {
  forms: Collection<FormDoc>;
  fields: Collection<FieldDoc>;

  constructor(private readonly db: Db) {
    this.forms = this.db.collection(PREFIX + "forms");
    this.fields = this.db.collection(PREFIX + "fields");
  }

  async createForm(
    { user, fields, name }: {
      user: User;
      name: string;
      fields: Array<{ prompt: string; charLimit: number }>;
    },
  ): Promise<{ form: Form } | { error: string }> {
    const form = freshID() as Form;
    await this.forms.insertOne({
      _id: form,
      user,
      name,
      submissionTime: "",
      submitted: false,
    });

    const fieldDocs: FieldDoc[] = fields.map((f) => ({
      _id: freshID() as Field,
      form,
      prompt: f.prompt,
      charLimit: f.charLimit,
      answer: "",
    }));
    if (fieldDocs.length > 0) {
      await this.fields.insertMany(fieldDocs);
    }
    return { form };
  }

  async fillField(
    { user, field, answer }: { user: User; field: Field; answer: string },
  ): Promise<Empty | { error: string }> {
    const fieldDoc = await this.fields.findOne({ _id: field });
    if (!fieldDoc) return { error: "Field not found." };
    const formDoc = await this.forms.findOne({ _id: fieldDoc.form });
    if (!formDoc) return { error: "Form not found." };
    if (formDoc.user !== user) return { error: "Field not under user's form." };
    if (formDoc.submitted) return { error: "Form already submitted." };
    if (answer.length > fieldDoc.charLimit) return { error: "Answer exceeds charLimit." };

    await this.fields.updateOne({ _id: field }, { $set: { answer } });
    return {};
  }

  async submitForm(
    { user, form, current }: { user: User; form: Form; current: string },
  ): Promise<Empty | { error: string }> {
    const formDoc = await this.forms.findOne({ _id: form });
    if (!formDoc) return { error: "Form not found." };
    if (formDoc.user !== user) return { error: "Form not under user." };
    if (formDoc.submitted) return { error: "Form already submitted." };

    await this.forms.updateOne({ _id: form }, {
      $set: { submitted: true, submissionTime: current },
    });
    return {};
  }

  // Queries
  async _getFormFields({ form }: { form: Form }): Promise<FieldDoc[]> {
    return await this.fields.find({ form }).toArray();
  }
}


