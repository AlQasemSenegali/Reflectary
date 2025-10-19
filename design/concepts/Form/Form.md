# Concept: Form

## Purpose
Allow users to enter and preserve structured responses to prompts.

## Principle
A user creates a form with fields derived from prompts. The user fills each field with responses, then submits the form, which records the responses with a timestamp.

## State
* a set of Forms with:
  + a user: User
  + a name: String
  + a submissionTime: DateTime
  + a submitted: Flag
* a set of Fields with:
  + a form: Form
  + a prompt: String
  + a charLimit: Number
  + an answer: String

## Actions
* createForm(user: User, fields: FieldSpec[], name: String): (form: Form)
  + where FieldSpec = (prompt: String, charLimit: Number)
  + requires: none
  + effects: add a new form under user with submitted=False and submissionTime=None and with fields having empty answers and given charLimits; return its Form id

* fillField(user: User, field: Field, answer: String)
  + requires: the field belongs to a form associated with user; len(answer) <= field.charLimit; the form is not submitted
  + effects: set the answer of field to answer

* submitForm(user: User, form: Form, current: DateTime)
  + requires: the form belongs to user; the form is not yet submitted
  + effects: set form.submitted=True and form.submissionTime=current

## Notes
* `DateTime` is ISO-8601 string; `None` represented by empty string "".
* Only primitive values and identifiers are used at boundaries.


