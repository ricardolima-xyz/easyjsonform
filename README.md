# EasyJsonForm

## When you just need a _form_, not a `<form>`.

**EasyJsonForm is a javascript form building library. Forms can be visually created and are internally represented as json objects. Form data are also represented as json objects.**

## Why a form builder?

You, developer, probably know how to build `<form>` structures, but let's suppose you are developing an application where end users need to create forms. Examples of such applications are:

- Survey systems
- Homework submission systems

EasyJsonForm makes that task easy for your application user.

## Key features

- _Easy:_ Visual form builder focused on end-users
- _Json:_ Forms and form data are represented as JSON objects
- _Form:_ Real-world approach. We offer "Multiple choice" instead of "checkbox"
- Pure javascript, no dependencies. Can be easily styled with Bootstrap or your preferred css classes and styles!

## The builder

EasyJsonForm features the Builder, a user interface that enables users to visually create their forms. Builder shows how the form will look like after each edit. Internally, the form data is represented as a json object. This json can be reloaded by the builder for further changes or be transformed into a form.

## The forms

Once you have json form is created, it can be tranformed into a form so other users are able to fill it up. Submitted form data are also represented as json objects so data can be easily manipulated by, for example, your PHP or javascript application. We also recommend **EasyJsonStats** for creating beautiful statistics from your EasyJsonForm data.

---

## Changelog
- 2022-12-07 **(new version!)** The dynamicform PHP library evolved into a new javascript implementation. The old PHP code used to write a lot of javascript already, so the transition was natual. Now all the work is made in the front-end. The new code has a new name: EasyJsonForm!
- 2021-05-11 **(feature)** The `outputStructureTable` method now receives one parameter, the structure name `$strname`. No more parameters for classes names. If the client needs style modifications, it can do throgh the ids of elements. This function now outputs 4 HTML elements. 1: The toolbar, in a div with its own id (new), 2: the structure table with its id, 3: the HTML hidden `input` element with the value that can be used in a form, and 4: the javascript code all contained in one script tag.
- 2021-05-11 **(feature)** Table structure icons are svgs. The function `find_relative_path` was removed, since there is no need to search for png files. There is no more http requests in the strcuture table.
- 2021-05-01 **(bug fix)** function `find_relative_path` is static
- 2020-12-16 **(bug fix)** The html output of a Bigtext is now enclosed with `<pre>...</pre>`, so the spacing is preserved.