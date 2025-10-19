# Concept: TimeLine[Entry]

## Purpose
Allow users to organize and review entries in chronological order.

## Principle
A user creates a timeline, adds entries with timestamps, and the system displays them in chronological order for easy review.

## State
* a set of TimeLines with:
  + a user: User
  + a name: String
* a set of Entries with:
  + a timeline: TimeLine
  + a name: String
  + a time: DateTime

## Actions
* createTimeline(user: User, name: String): (timeline: TimeLine)
  + requires: no timeline associated with the user has the same name
  + effects: add a new timeline with name under user, with empty set of entries; return its id

* addEntry(user: User, name: String, time: DateTime, timeline: TimeLine)
  + requires: timeline exists under user; no entry under timeline has the same name
  + effects: add an entry to the timeline with DateTime time

* removeEntry(user: User, entry: Entry)
  + requires: entry exists and belongs to a timeline under user
  + effects: remove the entry from its timeline

* removeTimeLine(user: User, timeline: TimeLine)
  + requires: a timeline exists under user
  + effects: remove the timeline and all its entries

## Notes
* `DateTime` is ISO-8601 string.
* Entries are de-duplicated by name within a timeline per spec.


