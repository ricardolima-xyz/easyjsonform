class FogField { 
    type = null;
    description = '';
    customattribute = '';
    mandatory = false;
    spec = null;
    value = null;

    constructor(json = null) {
        if (json) {
            this.description = json.description;
            this.customattribute = json.customattribute;
            this.mandatory = json.mandatory;
            this.spec = json.spec;
            this.value = json.value;
        }
    }
}

class FogFieldText extends FogField {
    type = 'text';

    builderEditorCreate(builderUpdateCallback) {
        // Creating edit control
        let editControl = document.createElement('div');
        editControl.style.padding = '1rem';
        editControl.style.display = 'grid';
        editControl.style.gridGap = '0.55rem';
        editControl.style.gridTemplateColumns = '1fr 1fr';
        // Description field
        let lblDescription = document.createElement('label');
        lblDescription.htmlFor = 'fog-builder-field-description';
        lblDescription.textContent = Fog.dictionary['item.description'];
        let iptDescription = document.createElement('input');
        iptDescription.id = 'fog-builder-field-description';
        iptDescription.type = 'text';
        iptDescription.value = this.description;
        iptDescription.onchange = () => {this.description = iptDescription.value; builderUpdateCallback();};
        editControl.appendChild(lblDescription);
        editControl.appendChild(iptDescription);
        // Custom attribute field
        let lblCustomAttribute = document.createElement('label');
        lblCustomAttribute.htmlFor = 'fog-builder-field-customattribute';
        lblCustomAttribute.textContent = Fog.dictionary['item.customattribute'];
        let iptCustomAttribute = document.createElement('input');
        iptCustomAttribute.id = 'fog-builder-field-customattribute';
        iptCustomAttribute.type = 'text';
        iptCustomAttribute.value = this.customattribute;
        iptCustomAttribute.onchange = () => {this.customattribute = iptCustomAttribute.value; builderUpdateCallback();};
        editControl.appendChild(lblCustomAttribute);
        editControl.appendChild(iptCustomAttribute);
        // Mandatory field
        let lblMandatory = document.createElement('label');
        lblMandatory.htmlFor = 'fog-builder-field-mandatory';
        lblMandatory.textContent = Fog.dictionary['item.mandatory'];
        let iptMandatory = document.createElement('input');
        iptMandatory.id = 'fog-builder-field-mandatory';
        iptMandatory.type = 'checkbox';
        iptMandatory.checked = this.mandatory;
        iptMandatory.onchange = () => {this.mandatory = iptMandatory.checked; builderUpdateCallback();};
        let spnMandatory = document.createElement('span');
        spnMandatory.style.gridColumnStart = '1';
        spnMandatory.style.gridColumnEnd = '3';
        spnMandatory.appendChild(iptMandatory);
        spnMandatory.appendChild(lblMandatory);
        editControl.appendChild(spnMandatory);
        // Returning edit control
        return editControl;
    }

    formFieldCreate() {
        // TODO under construction...
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');
        lblFormField.htmlFor = 'fog-builder-field-customattribute';
        lblFormField.textContent = Fog.dictionary['item.customattribute'];
        let iptFormField = document.createElement('input');
        iptFormField.id = 'fog-builder-field-customattribute';
        iptFormField.type = 'text';
        iptFormField.value = this.value;
        formField.appendChild(lblFormField);
        formField.appendChild(iptFormField);
        return formField;
/* 

        $result = "
        <label for=\"{$htmlName}[{$index}]\">{$this->description}";
        if ($this->mandatory) $result .= "<small>".DynamicFormHelper::_('control.restriction.start').DynamicFormHelper::_('control.restriction.mandatory').DynamicFormHelper::_('control.restriction.end')."</small>";
        $result .= "</label>
        <input type=\"text\" name=\"{$htmlName}[{$index}]\" id=\"{$htmlName}[{$index}]\"";
        $result .= "value=\"".htmlentities($this->content, ENT_QUOTES, 'utf-8')."\"";
        $result .= ($active) ? "" : " disabled=\"disabled\"";
        $result .= " />";
        return $result; */
    }
}

class Fog {

    constructor(id, structure = null) {
        if (id) this.id = id;
        else throw new Error('Id is mandatory');
        
        if (structure) this.structure = this.loadStructure(structure);
        else this.structure = [];
    }

    // TODO: READ SAVED VALUES IN structure
    loadStructure(structure) {
        let fogStructure = [];
        structure.forEach(element => {
            let classs = Fog.registeredClasses[element.type];
            if(classs) fogStructure.push(new classs(element));
        });
        return fogStructure;
    }

    /**
     * Creates the Fog Builder element to be added in the page.
     */
    builderCreate() {
        // Creating builder element
        this.builder = document.createElement('div');
        this.builder.id = this.id + '-fog-builder';       

        // Creating toolbar
        let formBuilderToolbar = document.createElement('div');
        formBuilderToolbar.id = this.id + '-fog-builder-toolbar';
        this.builder.appendChild(formBuilderToolbar);

        // Inserting add buttons to the toolbar 
        for (const [type, classs] of Object.entries(Fog.registeredClasses)) {
            let toolbar = formBuilderToolbar;
            let button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = Fog.dictionary[`structure.table.button.add.${type}`];
            button.onclick = () => {this.structure.push(new classs()); this.builderUpdate();};
            toolbar.appendChild(button);
        }

        // Creating table
        let formBuilderTable = document.createElement('table');
        let formBuilderTHead = document.createElement('thead');
        let formBuilderTBody = document.createElement('tbody');
        formBuilderTBody.id = this.id + '-fog-builder-tbody';
        formBuilderTHead.innerHTML = `
        <th>${Fog.dictionary['structure.table.header.position']}</th>
        <th>${Fog.dictionary['structure.table.header.type']}</th>
        <th>${Fog.dictionary['structure.table.header.description']}</th>
        <th>${Fog.dictionary['structure.table.header.customattribute']}</th>
        <th>${Fog.dictionary['structure.table.header.mandatory']}</th>
        <th colspan="4">${Fog.dictionary['structure.table.header.options']}</th>`;
        formBuilderTable.appendChild(formBuilderTHead);
        formBuilderTable.appendChild(formBuilderTBody);
        this.builder.appendChild(formBuilderTable);
        this.builderUpdate();

        return this.builder;
    }

    builderDeleteItem(position) {
        if(confirm(Fog.dictionary['structure.table.message.delete'].replace('<position>', position+1)))
        {
            this.structure.splice(position, 1);
            this.builderUpdate();
        }
    }

    builderEditItem(position) {
        let tbody = this.builder.children[1].children[1];
        let tr = tbody.insertRow(position + 1);
        let td = tr.insertCell(-1);
        td.colSpan = 9;
        let editor = this.structure[position].builderEditorCreate(() => {
            let currentRow = this.builder.children[1].children[1].children[position];
            currentRow.children[2].textContent = this.structure[position].description;
            currentRow.children[3].textContent = this.structure[position].customattribute;
            currentRow.children[4].innerHTML = this.structure[position].mandatory ? 
                '<div style=\'text-align: center\'>&#8226;</div>': '';
        });
        let btnClose = document.createElement('button');
        btnClose.textContent = Fog.dictionary['item.action.close'];
        editor.appendChild(document.createElement('span')); // Empty space on grid
        editor.appendChild(btnClose);
        td.appendChild(editor);
        tbody.rows[position].cells[5].firstChild.style.visibility = 'hidden';
        tbody.rows[position].cells[6].firstChild.style.visibility = 'hidden';
        tbody.rows[position].cells[7].firstChild.style.visibility = 'hidden';
        tbody.rows[position].cells[8].firstChild.style.visibility = 'hidden';
        btnClose.onclick = () => {
            tbody.deleteRow(position + 1);
            tbody.rows[position].cells[5].firstChild.style.visibility = 'visible';
            tbody.rows[position].cells[6].firstChild.style.visibility = 'visible';
            tbody.rows[position].cells[7].firstChild.style.visibility = 'visible';
            tbody.rows[position].cells[8].firstChild.style.visibility = 'visible';
            this.builderUpdate();
        };
    }

    builderMoveItem(position, offset) {
        if (position+offset >= this.structure.length || position+offset < 0) return;
        let currentItem = this.structure[position];
        let movedItem = this.structure[position+offset];
        this.structure[position+offset] = currentItem;
        this.structure[position] = movedItem;
        this.builderUpdate();
    }

    builderUpdate() {
        let tbody = this.builder.children[1].children[1];
        while (tbody.rows.length > 0) tbody.deleteRow(-1);
        this.structure.forEach((element, i) => {
            let tr = tbody.insertRow(-1);
            tr.insertCell(-1).textContent = i+1;
            tr.insertCell(-1).textContent = Fog.dictionary['item.' + element.type];
            tr.insertCell(-1).textContent = element.description;
            tr.insertCell(-1).textContent = element.customattribute;
            tr.insertCell(-1).innerHTML = element.mandatory ? '<div style=\'text-align: center\'>&#8226;</div>': '';

            let btnMoveUp = document.createElement('button');
            btnMoveUp.type = 'button';
            btnMoveUp.style.backgroundColor = 'Transparent';
            btnMoveUp.style.border = 'none';
            btnMoveUp.style.outline = 'none';
            btnMoveUp.innerHTML = Fog.upButton;
            btnMoveUp.onclick = () => this.builderMoveItem(i, -1);
            tr.insertCell(-1).appendChild(btnMoveUp);

            let btnMoveDown = document.createElement('button');
            btnMoveDown.type = 'button';
            btnMoveDown.style.backgroundColor = 'Transparent';
            btnMoveDown.style.border = 'none';
            btnMoveDown.style.outline = 'none';
            btnMoveDown.innerHTML = Fog.downButton;
            btnMoveDown.onclick = () => this.builderMoveItem(i, +1);
            tr.insertCell(-1).appendChild(btnMoveDown);

            let btnEdit = document.createElement('button');
            btnEdit.type = 'button';
            btnEdit.style.backgroundColor = 'Transparent';
            btnEdit.style.border = 'none';
            btnEdit.style.outline = 'none';
            btnEdit.innerHTML = Fog.editButton;
            btnEdit.onclick = () => this.builderEditItem(i);
            tr.insertCell(-1).appendChild(btnEdit);
            
            let btnDelete = document.createElement('button');
            btnDelete.type = 'button';
            btnDelete.style.backgroundColor = 'Transparent';
            btnDelete.style.border = 'none';
            btnDelete.style.outline = 'none';
            btnDelete.innerHTML = Fog.deleteButton;
            btnDelete.onclick = () => this.builderDeleteItem(i);
            tr.insertCell(-1).appendChild(btnDelete);
        });
    }

    // Resources
    static registeredClasses = {
        'text': FogFieldText,
    };
    static editButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>';
    static deleteButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser" viewBox="0 0 16 16"><path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/></svg>';
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
        "item.action.close": "Close",
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
        "structure.table.message.delete": "Are you sure you want to delete item at position <position>?"
    };
}