# Concept: Notification[Tag]

## Purpose
Enable the system or a user to schedule reminders and messages.

## Principle
A user schedules a notification with a message and time. When the scheduled time arrives, the system delivers the message to the user.

## State
* a set of Messages with:
  + a user: User
  + a content: String
  + a time: DateTime
  + a topic: Tag

## Actions
* setMessage(user: User, content: String, time: DateTime, topic: Tag): (message: Message)
  + requires: none
  + effects: add a message to the set of messages under user with the specified content, time and topic; return its Message id

* system sendMessage(message: Message, current: DateTime): (content: String, topic: Tag)
  + requires: the message exists and current equals the message's time
  + effects: return the content and topic of the message and remove it from the set of messages

## Notes
* Arguments and results use primitive values or identifiers (Message id); `sendMessage` returns two primitives `(content, topic)` as per spec.
* `DateTime` is represented as an ISO-8601 string.


