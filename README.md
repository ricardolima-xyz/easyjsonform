# fog.js - Form on the go!

## When you need a _form_, not a `<form>`.

**You, developer, probably know how to build `<form>` structures, but let's suppose you are developing an application where users, by nature, need to create forms. Examples of such applications are:**

- Survey systems
- Homework submission systems

It would be absurd if you had to code a form everytime a new one is needed. **That's where fog.js comes into action.**

## Phase 1: The form structure builder

To start, a user interface is needed so users can build forms themselves. The form structure builder does the job.

- With the form structure builder, users can intuitivelly create their forms using different form field types. 
- Internally, the builder stores the form structure as a json string that can be easily retrieved and stored by your application.

## Phase 2: The form itself

Once the form structure is created, now it is time for the other users to fill up the form.

- With the form structure, the library can build the form for the other users to fill.
- The filled-up form is also represented internally by a json file, so you can easily save it on the database and manipulate it in javascript or PHP, for example.

---

## Changelog
- 2021-05-11 **(feature)** The `outputStructureTable` method now receives one parameter, the structure name `$strname`. No more parameters for classes names. If the client needs style modifications, it can do throgh the ids of elements. This function now outputs 4 HTML elements. 1: The toolbar, in a div with its own id (new), 2: the structure table with its id, 3: the HTML hidden `input` element with the value that can be used in a form, and 4: the javascript code all contained in one script tag.
- 2021-05-11 **(feature)** Table structure icons are svgs. The function `find_relative_path` was removed, since there is no need to search for png files. There is no more http requests in the strcuture table.
- 2021-05-01 **(bug fix)** function `find_relative_path` is static
- 2020-12-16 **(bug fix)** The html output of a Bigtext is now enclosed with `<pre>...</pre>`, so the spacing is preserved.

