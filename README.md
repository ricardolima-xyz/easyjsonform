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

1. First of all, download the latest version of the library, and add the file to a folder in your project. This folder will be referred as `PATH` througout the examples.

2. Add `easyjsonform.js` to your javascript code.

```
<script src="PATH/easyjsonform.js">

// your code here...

</script>
```

... or if you are using ES6 modules, use `easyjsonform-module.js` instead

```
import EasyJsonForm from './PATH/easyjsonform-module.js';

// your code here...
```
Both files are identical, execpt that the module exports the EasyJsonForm class, which will be used to manipulate your forms.

2. Create an instance of the EasyJsonForm class. The object used to create both the form builder and the form for the user.

```
let ejf = new EasyJsonForm('sample-form');
```

The `EasyJsonForm`constructor takes four parameters, but just the first is mandatory. It is the id of the form, which can be any string that uniquely identifies your form.

3. To create a form builder on your page, we use the `builderGet()` method.

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform.js">

// Initializing form on the page
var ejf = new EasyJsonForm('sample-form');
document.getElementById('my-container').appendChild(ejf.builderGet());

</script>
```

4. After the user has created the form, you'll want to have in your hands that json form structure. For that, we use the `structureExport()` method.

```
<div id="my-container"></div>
<button onclick="saveForm()">Save Form</button>
...
<script src="PATH/easyjsonform.js">

// Initializing form on the page
var ejf = new EasyJsonForm('sample-form');
document.getElementById('my-container').appendChild(ejf.builderGet());

// Save method when user click on "Save form" button
function saveForm() {
    // structure is a javascript object. It can be used to recreate the form
    // using a EasyJsonForm object or can be saved in your database. For that,
    // the object needs to be converted as a json string using JSON.stringify

    let structure = ejf.structureExport();
    let jsonStructure = JSON.stringify(structure);
    
    // Now you can save jsonStructure in your database
}

</script>
```

5. If you want to load a previously saved structure into your builder, you need to pass the structure as the second argument of the EasyJsonForm constructor.

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform.js">

// Loading the structure. In the real life, this structure would be
// retrieved from a database. In this example, we just hardcoded a
// structure (you don't need to know exactly how it is built).
let jsonStructure = `[
    {
        "type": "text",
        "label": "New Text 1",
        "customattribute": "",
        "mandatory": false,
        "properties": {
            "lengthmeasurement": "no",
            "lengthmax": 0,
            "lengthmin": 0,
            "multiline": false
        },
        "value": ""
    }
]`;

// The json needs to be converted to an object, before it is passed to
// EasyJsonForm
let structure = JSON.parse(jsonStructure);

// Creating the EasyJsonForm, now with the structure of the saved form
var ejf = new EasyJsonForm('sample-form', structure);

// Initializing the form builder on the page
document.getElementById('my-container').appendChild(ejf.builderGet());

</script>
```

If you don't need to preload the builder with a structure, just remove the second argument, or pass `null` or an empty array `[]` as the second argument of the `EasyJsonForm` constructor. This is necessary when the third and fourth parameters are used (see items below).

6. If you want to display the form (and not the form builder) in your page,
you'll need to use the method `formGet()` instead of `builderGet()`. The rest remain pretty much the same as the previous item, since for this, you'll need a previously created structure.

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform.js">

// Loading the structure. In the real life, this structure would be
// retrieved from a database. In this example, we just hardcoded a
// structure (you don't need to know exactly how it is built).
let jsonStructure = `[
    {
        "type": "text",
        "label": "New Text 1",
        "customattribute": "",
        "mandatory": false,
        "properties": {
            "lengthmeasurement": "no",
            "lengthmax": 0,
            "lengthmin": 0,
            "multiline": false
        },
        "value": ""
    }
]`;

// The json needs to be converted to an object, before it is passed to
// EasyJsonForm
let structure = JSON.parse(jsonStructure);

// Creating the EasyJsonForm, now with the structure of the saved form
var ejf = new EasyJsonForm('sample-form', structure);

// Initializing the form the page
document.getElementById('my-container').appendChild(ejf.formGet());

</script>
```

7. Styling. To style your builder and your forms, you can pass, as the third parameter of EasyJsonForm, an object which specifies which parts of the form will be styled and how. We provide a sample formatter to be used with Boostrap5: `easyjsonform-bootstrap.js` or `easyjsonform-bootstrap-module.js` (if you are using ES6-modules)

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform-bootstrap.js">
<script src="PATH/easyjsonform.js">

// Initializing form on the page with bootstrap styling
// The variable ejfBootstrapStyle is located at easyjsonform-bootstrap.js
var ejf = new EasyJsonForm('sample-form', null, ejfBootstrapStyle);
document.getElementById('my-container').appendChild(ejf.builderGet());

</script>
```

Using ES6 modules:

```
<div id="my-container"></div>
...
<script type="module">
import EasyJsonForm from './PATH/easyjsonform-module.js';
import ejfBootstrapStyle from './PATH/easyjsonform-bootstrap-module.js';

// Initializing form on the page with bootstrap styling
var ejf = new EasyJsonForm('sample-form', null, ejfBootstrapStyle);
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