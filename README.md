# EasyJsonForm

## When you need just a _form_, not a `<form>`.

**EasyJsonForm is a javascript form builder framework. Forms are created visually and are descripted as json objects. The form data is also descripted as json objects.**

You, developer, probably know how to build `<form>` structures, but let's suppose you are developing an application where users, by nature, need to create forms. Examples of such applications are:**

- Survey systems
- Homework submission systems

## Key features

- Real world types: Multiple choice instead of checkbox
- Visual form builder focused on the end-user
- Pure javascript, no dependencies
- ...but easily styled with Bootstrap or your preferred css classes and styles!
- Forms and form data are descripted in JSON

## Phase 1: Builder

You can write your own JSON to build a form if you want, but we offer a user interface to visually build your form.

- With the builder, users can intuitivelly create their forms.
- Internally, the builder stores the form structure as a json string that can be easily stored by your application and retrieved by EasyJsonForm.

## Phase 2: Form

Once the form structure is created, now it is time for the other users to fill up the form.

- With the structure, EasyJsonForm can build the form for the other users to fill.
- The filled-up form is also represented internally by a json file, so you can easily save it on the database and manipulate it in javascript or PHP.

---

## Changelog
- 2022-12-07 **(new version!)** The dynamicform PHP library evolved into a new javascript implementation. The old PHP code used to write a lot of javascript already, so the transition was natual. Now all the work is made in the front-end. The new code has a new name: EasyJsonForm!
- 2021-05-11 **(feature)** The `outputStructureTable` method now receives one parameter, the structure name `$strname`. No more parameters for classes names. If the client needs style modifications, it can do throgh the ids of elements. This function now outputs 4 HTML elements. 1: The toolbar, in a div with its own id (new), 2: the structure table with its id, 3: the HTML hidden `input` element with the value that can be used in a form, and 4: the javascript code all contained in one script tag.
- 2021-05-11 **(feature)** Table structure icons are svgs. The function `find_relative_path` was removed, since there is no need to search for png files. There is no more http requests in the strcuture table.
- 2021-05-01 **(bug fix)** function `find_relative_path` is static
- 2020-12-16 **(bug fix)** The html output of a Bigtext is now enclosed with `<pre>...</pre>`, so the spacing is preserved.