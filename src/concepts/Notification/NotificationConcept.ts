import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "../../utils/types.ts";
import { freshID } from "../../utils/database.ts";

const PREFIX = "Notification" + ".";

type User = ID;
type Message = ID;
type Tag = string; // generic parameter instantiated by fields; represented as string label

interface MessageDoc {
  _id: Message;
  user: User;
  content: string;
  time: string; // ISO-8601
  topic: Tag;
}

export default class NotificationConcept {
  messages: Collection<MessageDoc>;

  constructor(private readonly db: Db) {
    this.messages = this.db.collection(PREFIX + "messages");
  }

  /**
   * Action: setMessage
   * @effects Add a message for the user with given content, time and topic; return Message id.
   */
  async setMessage(
    { user, content, time, topic }: {
      user: User;
      content: string;
      time: string; // ISO-8601
      topic: Tag;
    },
  ): Promise<{ message: Message } | { error: string }> {
    // No requires beyond basic argument presence; store as-is
    const message = freshID() as Message;
    await this.messages.insertOne({ _id: message, user, content, time, topic });
    return { message };
  }

  /**
   * System Action: sendMessage
   * @requires Message exists and current equals message.time
   * @effects Return (content, topic) and remove the message from state.
   */
  async sendMessage(
    { message, current }: { message: Message; current: string },
  ): Promise<{ content: string; topic: Tag } | { error: string }> {
    const msg = await this.messages.findOne({ _id: message });
    if (!msg) {
      return { error: `Message with ID ${message} not found.` };
    }
    if (msg.time !== current) {
      return { error: "Current time does not match the scheduled time." };
    }

    await this.messages.deleteOne({ _id: message });
    return { content: msg.content, topic: msg.topic };
  }

  // Queries for testing/inspection
  async _getUserMessages({ user }: { user: User }): Promise<MessageDoc[]> {
    return await this.messages.find({ user }).toArray();
  }
}


