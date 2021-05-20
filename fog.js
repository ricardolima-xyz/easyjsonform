class Fog {

    /**
     * Creates the Fog Builder in the document.
     * 
     * @param {string} elementId The element on the page which will be made invisible, being
     * replaced on the screen by the form builder and which will store the form structure in
     * its value
     */
    static createFogBuilder(elementId) {
        // TODO: READ POSSIBLE SAVED VALUES IN element elementID
        // AND CONVERT THEM INTO structure items

        // Creating the entry in the internal structure array
        this.structure[elementId] = Array();

        // Creating the elements in the document
        let element = document.getElementById(elementId);
        let parentElement = element.parentElement;        

        // Creating toolbar
        let formBuilderToolbar = document.createElement('div');
        formBuilderToolbar.id = elementId + '-fog-builder-toolbar';

        // Creating table
        let formBuilderTHead = document.createElement('thead');
        let formBuilderTBody = document.createElement('tbody');
        let formBuilderTable = document.createElement('table');
        formBuilderTHead.innerHTML = `
        <th>${this.dictionary['structure.table.header.position']}</th>
        <th>${this.dictionary['structure.table.header.type']}</th>
        <th>${this.dictionary['structure.table.header.description']}</th>
        <th>${this.dictionary['structure.table.header.customattribute']}</th>
        <th>${this.dictionary['structure.table.header.mandatory']}</th>
        <th colspan="4">${this.dictionary['structure.table.header.options']}</th>`;
        formBuilderTable.appendChild(formBuilderTHead);
        formBuilderTable.appendChild(formBuilderTBody);
        formBuilderTBody.id = elementId + '-fog-builder-tbody';
        
        // Inserting elements in the document and hiding the original one
        parentElement.insertBefore(formBuilderToolbar, element);
        parentElement.insertBefore(formBuilderTable, element);
        element.style.display = 'none';

        // Iterating through registered fog fields
        FogFieldText.createFogBuilderControls(elementId);
        
        console.log(this.structure);
    }

    static deleteItem(elementId, position) {
        if(confirm(this.dictionary['structure.table.message.delete'].replace('<position>', position+1)))
        {
            this.structure[elementId].splice(position, 1);
            this.updateView(elementId);
        }
    }

    static editItem(elementId, position) {
        this.structure[elementId][position].showEditControl(elementId, position);
    }

    static moveItem(elementId, position, offset) {
        if (position+offset >= this.structure[elementId].length || position+offset < 0) return;
        let currentItem = this.structure[elementId][position];
        let movedItem = this.structure[elementId][position+offset];
        this.structure[elementId][position+offset] = currentItem;
        this.structure[elementId][position] = movedItem;
        this.updateView(elementId);
    }

    static updateView(elementId) {
        // Updating form control
        document.getElementById(elementId).value = JSON.stringify(this.structure[elementId]);
        // Updating table
        let tbody = document.getElementById(elementId + '-fog-builder-tbody');
        while (tbody.rows.length > 0) tbody.deleteRow(-1);
        for (let j = 0; j < this.structure[elementId].length; j++)
        {
            let tr = tbody.insertRow(-1);
            tr.insertCell(-1).innerHTML = j+1;
            tr.insertCell(-1).innerHTML = this.dictionary['item.' + this.structure[elementId][j].type];
            tr.insertCell(-1).innerHTML = this.structure[elementId][j].description;
            tr.insertCell(-1).innerHTML = this.structure[elementId][j].customattribute;
            tr.insertCell(-1).innerHTML = (this.structure[elementId][j].mandatory) ? '&#8226;' : '';
            tr.insertCell(-1).innerHTML = `<button type="button" style="background-color:Transparent;border:none;outline:none;" onclick="Fog.moveItem('${elementId}', ${j}, -1)">${this.upButton}</button>`;
            tr.insertCell(-1).innerHTML = `<button type="button" style="background-color:Transparent;border:none;outline:none;" onclick="Fog.moveItem('${elementId}', ${j}, +1)">${this.downButton}</button>`;
            tr.insertCell(-1).innerHTML = `<button type="button" style="background-color:Transparent;border:none;outline:none;" onclick="Fog.editItem('${elementId}', ${j})">${this.editButton}</button>`;
            tr.insertCell(-1).innerHTML = `<button type="button" style="background-color:Transparent;border:none;outline:none;" onclick="Fog.deleteItem('${elementId}', ${j})">${this.deleteButton}</button>`;
            tr.childNodes[3].style.textAlign = 'center';
            tr.childNodes[4].style.textAlign = 'center';
            
        }
    }

    static structure = {};


    // Resources
    static editButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>';
    static deleteButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>';
    static downButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>';
    static upButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>';

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
        "structure.table.message.delete": "Are you sure you want to delete item at position <position>?"
    };
}


class FogField { 
    type = null;
    description = '';
    customattribute = '';
    mandatory = false;
    spec = null;
}

class FogFieldText extends FogField {

    type = 'text';

    static createFogBuilderControls(elementId) {
        let toolbar = document.getElementById(elementId + '-fog-builder-toolbar');
        let button = document.createElement('button');
        button.type = 'button';
        button.id = toolbar.id + '-button-txt';
        button.innerHTML = Fog.dictionary["structure.table.button.add.text"];
        button.addEventListener("click", function() {
            Fog.structure[elementId].push(new FogFieldText());
            Fog.updateView(elementId);
        });
        toolbar.appendChild(button);
    }

    showEditControl(elementId, position) {
        let tbody = document.getElementById(elementId + '-fog-builder-tbody');

        let tr = tbody.insertRow(position + 1);
        let td = tr.insertCell(-1);
        let mandatoryChecked = Fog.structure[elementId][position].mandatory ? "checked" : ""; 
        td.colSpan = 9;
        td.innerHTML = `<div style="padding: 1rem; display: grid; grid-gap: 0.55rem; grid-template-columns: 1fr 1fr;">
		<label for="tex_des_${elementId}">${Fog.dictionary['item.description']}</label>
        <input  id="tex_des_${elementId}" type="text" value="${Fog.structure[elementId][position].description}"/>
        <label for="tex_cat_${elementId}">${Fog.dictionary['item.customattribute']}</label>
        <input  id="tex_cat_${elementId}" type="text" value="${Fog.structure[elementId][position].customattribute}"/>
        <span style="grid-column-start: 1; grid-column-end: 3;">
        <input  id="tex_man_${elementId}" type="checkbox" ${mandatoryChecked}/>
        <label for="tex_man_${elementId}">${Fog.dictionary['item.mandatory']}</label>
        </span>
        </div>`;
        
        console.log(td.firstChild);
        let buttonSave = document.createElement('button');
        buttonSave.type = 'button';
        buttonSave.innerHTML = Fog.dictionary['item.action.save'];
        buttonSave.addEventListener("click", function() {
            Fog.structure[elementId][position].description = document.getElementById(`tex_des_${elementId}`).value;
            Fog.structure[elementId][position].customattribute = document.getElementById(`tex_cat_${elementId}`).value;
            Fog.structure[elementId][position].mandatory = document.getElementById(`tex_man_${elementId}`).checked;
            tbody.deleteRow(position + 1);
            Fog.updateView(elementId);
        });
        td.firstChild.appendChild(buttonSave);

        let buttonCancel = document.createElement('button');
        buttonCancel.type = 'button';
        buttonCancel.innerHTML = Fog.dictionary['item.action.cancel'];
        buttonCancel.addEventListener("click", function() {
            tbody.deleteRow(position + 1);
            tbody.rows[position].cells[7].firstChild.style.setProperty("display", "block", "important");
        });
        td.firstChild.appendChild(buttonCancel);

        tbody.rows[position].cells[7].firstChild.style.setProperty("display", "none", "important");
    }
}
