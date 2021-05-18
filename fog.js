class Fog {

    /**
     * Creates the Fog Builder in the document.
     * 
     * @param {string} elementId The element on the page which will be made invisible, being
     * replaced on the screen by the form builder and which will store the form structure in
     * its value
     */
    static createFogBuilder(elementId) {
        // Creating the entry in the internal structure array
        this.structure[elementId] = Array();

        // Creating the elements in the document
        let element = document.getElementById(elementId);
        let parentElement = element.parentElement;        

        // Creating toolbar
        let formBuilderToolbar = document.createElement('div');
        formBuilderToolbar.id = elementId + '-fog-builder-toolbar';

        // Creating table
        let formBuilderTable = document.createElement('table');
        formBuilderTable.id = elementId + '-fog-builder-table';
        formBuilderTable.innerHTML = '<tr><td>Table</td></tr>';
        
        // Inserting elements on the document and hiding the original one
        parentElement.insertBefore(formBuilderToolbar, element);
        parentElement.insertBefore(formBuilderTable, element);
        element.style.display = 'none';

        // Iterating through registered fog fields
        FogFieldText.createFogBuilderControls(elementId);
        
        console.log(this.structure);
    }

    static structure = {};

    static dictionary = {
        "control.action.change": "Change",
        "control.restriction.end": ")",
        "control.restriction.filetypes": "File types: ",
        "control.restriction.filetypes.all": "all ",
        "control.restriction.mandatory": "Mandatory",
        "control.restriction.maxsize": "Maximum size: ",
        "control.restriction.maxsize.megabytes": " MB",
        "control.restriction.maxwords": "Max. of words:",
        "control.restriction.minwords": "Min. of words: ",
        "control.restriction.separator": ", ",
        "control.restriction.start": " (",
        "control.singlechoice.null": "&gt;&gt; Select",
        "dynamicform.validation.error.mandatory":"The field <field> is mandatory",
        "dynamicform.validation.error.under.min.words":"The text on field <field> has fewer words than the minimum specified",
        "dynamicform.validation.error.over.max.words":"The text on field <field> has more words than the maximum specified",
        "dynamicform.validation.error.file.error":"Error on uploading the file on field <field>",
        "dynamicform.validation.error.file.exceeded.size":"File on field <field> has exceeded the maximum size",
        "dynamicform.validation.error.file.wrong.type":"File on field <field> is of a type not permitted",
        "dynamicform.validation.error.file.upload.error":"Error on uploading the file on field <field>",	
        "item.action.cancel": "Cancel",
        "item.action.save": "Save",
        "item.bigtext": "Big text",
        "item.bigtext.spec.maxwords": "Maximum of words",
        "item.bigtext.spec.minwords": "Minimum of words",
        "item.choice": "Choice",
        "item.choice.no": "No",
        "item.choice.yes": "Yes",
        "item.description": "Description",
        "item.file": "File",
        "item.file.spec.filetypes": "Allowed filetypes",
        "item.file.spec.maxsize": "Maximum size (MB)",
        "item.groupedtext": "Grouped text",
        "item.groupedtext.spec.items": "Items",
        "item.groupedtext.spec.items.help": "(One per line)",
        "item.mandatory": "Mandatory",
        "item.multiplechoice": "Multiple choice",
        "item.multiplechoice.spec.items": "Items",
        "item.multiplechoice.spec.items.help": "(One per line)",
        "item.singlechoice": "Single choice",
        "item.singlechoice.spec.items": "Items",
        "item.singlechoice.spec.items.help": "(One per line)",
        "item.text": "Text",
        "item.customattribute": "Custom attribute",
        "structure.table.button.add.bigtext": "+ Big text",
        "structure.table.button.add.choice": "+ Choice",
        "structure.table.button.add.file": "+ File",
        "structure.table.button.add.groupedtext": "+ Grouped text",
        "structure.table.button.add.multiplechoice": "+ Multiple choice",
        "structure.table.button.add.singlechoice": "+ Single choice",
        "structure.table.button.add.text": "+ Text",
        "structure.table.header.description": "Description",
        "structure.table.header.mandatory": "Mandatory",
        "structure.table.header.options": "Options",
        "structure.table.header.position": "Position",
        "structure.table.header.type": "Type",
        "structure.table.header.customattribute": "Custom attr.",
        "structure.table.message.add": "Enter the description of the new item",
        "structure.table.message.delete.1": "Are you sure you want to delete item at position ",
        "structure.table.message.delete.2": "? "
    };
}


class FogField { 
    type = null;
    description = null;
    customattribute = null;
    mandatory = null;
    spec = null;
}

class FogFieldText extends FogField {

    static createFogBuilderControls(elementId) {

        let toolbar = document.getElementById(elementId + '-fog-builder-toolbar');
        
        let button = document.createElement('button');
        button.id = toolbar.id + '-button-txt';
        button.innerHTML = Fog.dictionary["structure.table.button.add.text"];
        button.addEventListener("click", function() {
            Fog.structure[elementId].push(new FogFieldText());
            console.log(Fog.structure[elementId]);
            console.log(JSON.stringify(Fog.structure[elementId]));
            console.log("Hello World!");
        });
        toolbar.appendChild(button);
    }
}
