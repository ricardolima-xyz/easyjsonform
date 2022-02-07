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

1. Download the library and unzip its contents into a folder in your project. This folder will be referred as `PATH` througout the examples.

2. Add `easyjsonform.js` to your Javascript/HTML code.

```
<script src="PATH/easyjsonform.js"></script>

<script>
// your code here...
</script>
```

... or if you are using ES6 modules, use `easyjsonform-module.js` instead

```
import EasyJsonForm from './PATH/easyjsonform-module.js';

// your code here...
```
Both files are identical, execpt that the module file exports the EasyJsonForm class in a ES6/Javascript fashion.

2. Create an instance of the EasyJsonForm class. This object is used to create form builders, forms and to parse and export JSON forms.

```
var ejf = new EasyJsonForm('my-form');
```

The `EasyJsonForm`constructor takes four parameters, but just the first is mandatory. It is the id of the form, which can be any string that uniquely identifies your form. When the form is rendered to the user the id of the enclosing `div` or `form` will have this value.

3. To create a form builder on your page, we use the `builderGet()` method.

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform.js"></script>

<script>

// Initializing form on the page
var ejf = new EasyJsonForm('my-form');
var myContainer = document.getElementById('my-container');

myContainer.appendChild(ejf.builderGet());

</script>
```

4. After the form is created on the screen, you'll want to have in your hands the corresponding JSON form structure. For that, we use the `structureExport()` method.

```
<div id="my-container"></div>
<button onclick="saveForm()">Save Form</button>
...
<script src="PATH/easyjsonform.js"></script>

<script>

// Initializing form on the page
var ejf = new EasyJsonForm('my-form');
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
<script src="PATH/easyjsonform.js"></script>

<script>

// Loading the structure. In real life, the structure would be retrieved from
// the database. In this example, we are just passing a hardcoded structure.
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

// The JSON needs to be converted to an object, before it is passed to EasyJsonForm
let structure = JSON.parse(jsonStructure);

// Creating the EasyJsonForm, now with the structure of the saved form
var ejf = new EasyJsonForm('my-form', structure);

// Initializing the form builder on the page
document.getElementById('my-container').appendChild(ejf.builderGet());

</script>
```

You don't need to pass a structure as argument, you can simply not use the second argument at all. But if you need to pass the third or fourth arguments (see below), you will need to or pass `null` or an empty array `[]` as the second argument of the `EasyJsonForm` constructor.

6. If you want to display the form (not the form builder) in your page,
you'll need to use the method `formGet()` (instead of `builderGet()`). The rest remain pretty much the same as the previous item. But, for this, a previously created structure is necessary.

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform.js"></script>

<script>

// Loading the structure. In real life, the structure would be retrieved from
// the database. In this example, we are just passing a hardcoded structure.
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

// The JSON needs to be converted to an object, before it is passed to EasyJsonForm
let structure = JSON.parse(jsonStructure);

// Creating the EasyJsonForm, now with the structure of the saved form
var ejf = new EasyJsonForm('my-form', structure);

// Initializing the form the page
document.getElementById('my-container').appendChild(ejf.formGet());

</script>
```

7. Styling. To style your builder and your forms, you can pass, as the third parameter of EasyJsonForm, an object which specifies which parts of the form will be styled and how. We provide a sample formatter to be used with Boostrap5: `easyjsonform-bootstrap.js` or `easyjsonform-bootstrap-module.js` (if you are using ES6-modules).

```
<div id="my-container"></div>
...
<script src="PATH/easyjsonform-bootstrap.js"></script>
<script src="PATH/easyjsonform.js"></script>

<script>

// Initializing form on the page with bootstrap styling
// The variable ejfBootstrapStyle is located at easyjsonform-bootstrap.js
var ejf = new EasyJsonForm('my-form', null, ejfBootstrapStyle);
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
var ejf = new EasyJsonForm('my-form', null, ejfBootstrapStyle);
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