# EasyJsonForm

## When you just need a _form_, not a `<form>`.

**EasyJsonForm is a javascript form creation library for the cases when end-users need to create forms, such as survey or homework submission systems. With EasyJsonForm, users can easily create forms. The forms structures (and filled-in values) can be exported as json, saved in your database and be rebuilt as forms.**

## Key features

- Visual, intuitive form builder for end-users
- Forms and form data are represented as JSON objects and can be exported and retrieved whenever you can.
- Simplified form model with a real-world approach. There is "Single choice" instead of `<select>`. "Text" can be rendered as `<input>` or `<textarea>` according to what is set in its properties.
- Form validation.
- Pure javascript, no dependencies.

## Getting started

1. First of all, download the latest version of the library, add the file to a folder in your project.

2. Add `easyjsonform.js` to your javascript code.

```
<script src="PATH/easyjsonform.js">

// your code here...

</script>
```

... or if you are using ES6 modules, use the `easyjsonform-module.js` instead

```
import EasyJsonForm from 'PATH/easyjsonform-module.js';

// your code here...

</script>
```
Both files are identical, execpt that the module exports the EasyJsonForm object, which will be used directly in your code.

2. Create the EasyJsonForm object. It is used to create both the form builder and the form for the user.

```
let ejf = new EasyJsonForm('sample-form');
```

The `EasyJsonForm`constructor takes four parameters, but just the first is mandatory. It is the id of the form, which can be any string that uniquely identifies your form. 

3. To create a form builder on your page, use the method builderGet().


```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform.js">

let ejf = new EasyJsonForm('sample-form');
document.getElementById('my-container').appendChild(ejf.builderGet());

</script>
```


---

## Changelog
- 2022-12-07 **(new version!)** The dynamicform PHP library evolved into a new javascript implementation. The old PHP code used to write a lot of javascript already, so the transition to a pure javascript implementation was natual. The file upload capabilities now has to be implemented by the developer, but the library has got new powerful capabilities now the work is all made in the front-end. With a new code, a new name: EasyJsonForm!
- 2021-05-11 **(feature)** The `outputStructureTable` method now receives one parameter, the structure name `$strname`. No more parameters for classes names. If the client needs style modifications, it can do throgh the ids of elements. This function now outputs 4 HTML elements. 1: The toolbar, in a div with its own id (new), 2: the structure table with its id, 3: the HTML hidden `input` element with the value that can be used in a form, and 4: the javascript code all contained in one script tag.
- 2021-05-11 **(feature)** Table structure icons are svgs. The function `find_relative_path` was removed, since there is no need to search for png files. There is no more http requests in the strcuture table.
- 2021-05-01 **(bug fix)** function `find_relative_path` is static
- 2020-12-16 **(bug fix)** The html output of a Bigtext is now enclosed with `<pre>...</pre>`, so the spacing is preserved.