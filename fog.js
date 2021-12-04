class FogField { 
    constructor(json = null) {
        if (json) {
            this.type = json.type;
            this.description = json.description;
            this.customattribute = json.customattribute;
            this.mandatory = json.mandatory;
            this.spec = json.spec;
            this.value = json.value;
        } else {
            this.type = null;
            this.description = '';
            this.customattribute = '';
            this.mandatory = false;
            this.spec = null;
            this.value = null;
        }
    }

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
        return editControl;
    }

    generateHelperText() {
        let restrictions = [];
        if (this.mandatory) restrictions.push(Fog.dictionary['form.field.helper.text.mandatory']);
        return (restrictions.length == 0) ? 
            '' :
            Fog.dictionary['form.field.helper.text'].replace('{{helper-text}}',
            restrictions.join(Fog.dictionary['form.field.helper.text.separator']));
    }
}

class FogFieldChoice extends FogField {
    constructor(json = null) {
        super(json);
        if (!json) {
            this.value = '0';
        }
        this.type = 'choice';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');    
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        let iptHidden = document.createElement('input');
        iptHidden.type = 'hidden';
        iptHidden.value = '0';
        iptHidden.name = `${fog.id}[${position}]`;
        let iptCheck = document.createElement('input');
        iptCheck.type = 'checkbox';
        iptCheck.disabled = fog.disabled;
        iptCheck.id = `${fog.id}[${position}]`;
        iptCheck.name = `${fog.id}[${position}]`;
        iptCheck.value = '1';
        iptCheck.checked = parseInt(this.value);
        iptCheck.onchange = () => {this.value = iptCheck.checked ? "1" : "0"};
        formField.appendChild(iptHidden);
        formField.appendChild(iptCheck);
        formField.appendChild(lblFormField);
        return formField;
    }

    getFormattedValue() {
            return parseInt(this.value) ? Fog.dictionary['item.choice.yes'] : Fog.dictionary['item.choice.no'];
    }
}

class FogFieldFile extends FogField {
    constructor(json = null) {
        super(json);
        if (!json) {
            this.spec = {file_types:[], max_size:0};
        }
        this.type = 'file';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // Max file size field
        let lblMaxSize = document.createElement('label');
        lblMaxSize.htmlFor = 'fog-builder-file-max-size';
        lblMaxSize.textContent = Fog.dictionary['item.file.spec.maxsize'];
        let iptMaxSize = document.createElement('input');
        iptMaxSize.type = 'number';
        iptMaxSize.min = 0;
        iptMaxSize.step = 0.1;
        iptMaxSize.id = 'fog-builder-file-max-size';
        iptMaxSize.value = this.spec.max_size;
        iptMaxSize.onchange = () => {this.spec.max_size = iptMaxSize.value; builderUpdateCallback();};
        editControl.appendChild(lblMaxSize);
        editControl.appendChild(iptMaxSize);
        // File types field
        let lblFileTypes = document.createElement('label');
        lblFileTypes.textContent = Fog.dictionary['item.file.spec.filetypes'];
        let divFileTypes = document.createElement('div');
        for (const [fileType, properties] of Object.entries(Fog.supportedFileTypes)) {
            let divFileType = document.createElement('div');
            let cbxFileType = document.createElement('input');
            cbxFileType.id = `fog-builder-filetype-${fileType}`;
            cbxFileType.type = 'checkbox';
            cbxFileType.checked = this.spec.file_types.indexOf(fileType) > -1;
            cbxFileType.onchange = () => {
                if (cbxFileType.checked) this.spec.file_types.push(fileType);
                else this.spec.file_types.splice(this.spec.file_types.indexOf(fileType),1);  
            };
            let lblFileType = document.createElement('label');
            lblFileType.htmlFor = `fog-builder-filetype-${fileType}`;
            lblFileType.textContent = properties.extensions[0];
            divFileType.appendChild(cbxFileType);
            divFileType.appendChild(lblFileType);
            divFileTypes.appendChild(divFileType);
            console.log(`${fileType}: ${properties.extensions[0]}`);
        }
        editControl.appendChild(lblFileTypes);
        editControl.appendChild(divFileTypes);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');    
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        // TODO
        formField.appendChild(lblFormField);
        return formField;
    }

    getFormattedValue() {
            return value || '';
    }
}

class FogFieldGroupedText extends FogField {
    constructor(json = null) {
        super(json);
        if (!json) {
            this.spec = {items:[]};
            this.value = [];
        }
        this.type = 'groupedtext';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // Items field
        let lblItems = document.createElement('label');
        lblItems.htmlFor = 'fog-builder-field-items';
        lblItems.innerHTML = `${Fog.dictionary['item.groupedtext.spec.items']}
        <br/><small>${Fog.dictionary['item.groupedtext.spec.items.help']}</small>`;
        let txaItems = document.createElement('textarea');
        txaItems.id = 'fog-builder-field-items';
        txaItems.value = this.spec.items.join('\n');
        txaItems.onchange = () => {this.spec.items = txaItems.value.split('\n'); this.value = Array(this.spec.items.length).fill(''); builderUpdateCallback();};
        editControl.appendChild(lblItems);
        editControl.appendChild(txaItems);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');    
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let formGroup = document.createElement('span');
        this.spec.items.forEach((element, index) => {
            let check = document.createElement('span');
            let lblCheck = document.createElement('label');
            lblCheck.htmlFor = `${fog.id}[${position}][${index}]`;
            lblCheck.textContent = element;
            let iptCheck = document.createElement('input');
            iptCheck.type = 'text';
            iptCheck.disabled = fog.disabled;
            iptCheck.id = `${fog.id}[${position}][${index}]`;
            iptCheck.name = `${fog.id}[${position}][${index}]`;
            iptCheck.value = this.value[index];
            iptCheck.onchange = () => {this.value[index] = iptCheck.value};
            check.appendChild(lblCheck);
            check.appendChild(iptCheck);
            formGroup.appendChild(check);
        });
        formField.appendChild(lblFormField);
        formField.appendChild(formGroup);
        return formField;
    }

    getFormattedValue() {
        return this.value;
    }
}

class FogFieldMultipleChoice extends FogField {
    constructor(json = null) {
        super(json);
        if (!json) {
            this.spec = {items:[]};
            this.value = [];
        }
        this.type = 'multiplechoice';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // Items field
        let lblItems = document.createElement('label');
        lblItems.htmlFor = 'fog-builder-field-items';
        lblItems.innerHTML = `${Fog.dictionary['item.multiplechoice.spec.items']}
        <br/><small>${Fog.dictionary['item.multiplechoice.spec.items.help']}</small>`;
        let txaItems = document.createElement('textarea');
        txaItems.id = 'fog-builder-field-items';
        txaItems.value = this.spec.items.join('\n');
        txaItems.onchange = () => {this.spec.items = txaItems.value.split('\n'); this.value = Array(this.spec.items.length).fill(0); builderUpdateCallback();};
        editControl.appendChild(lblItems);
        editControl.appendChild(txaItems);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');    
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let formGroup = document.createElement('span');
        this.spec.items.forEach((element, index) => {
            let check = document.createElement('span');
            let iptHidden = document.createElement('input');
            iptHidden.type = 'hidden';
            iptHidden.value = '0';
            iptHidden.name = `${fog.id}[${position}][${index}]`;
            let iptCheck = document.createElement('input');
            iptCheck.type = 'checkbox';
            iptCheck.disabled = fog.disabled;
            iptCheck.id = `${fog.id}[${position}][${index}]`;
            iptCheck.name = `${fog.id}[${position}][${index}]`;
            iptCheck.value = '1';
            iptCheck.checked = parseInt(this.value[index]);
            iptCheck.onchange = () => {this.value[index] = iptCheck.checked ? "1" : "0"};
            let lblCheck = document.createElement('label');
            lblCheck.htmlFor = `${fog.id}[${position}][${index}]`;
            lblCheck.textContent = element;
            check.appendChild(iptHidden);
            check.appendChild(iptCheck);
            check.appendChild(lblCheck);
            formGroup.appendChild(check);
        });
        formField.appendChild(lblFormField);
        formField.appendChild(formGroup);
        return formField;
    }

    getFormattedValue() {
        return this.value.map((x) => {
            return parseInt(x) ? Fog.dictionary['item.choice.yes'] : Fog.dictionary['item.choice.no']; 
        });
    }
}

class FogFieldSingleChoice extends FogField {
    constructor(json = null) {
        super(json);
        if (!json) {
            this.spec = {items:[]};
        }
        this.type = 'singlechoice';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // Items field
        let lblItems = document.createElement('label');
        lblItems.htmlFor = 'fog-builder-field-items';
        lblItems.innerHTML = `${Fog.dictionary['item.singlechoice.spec.items']}
        <br/><small>${Fog.dictionary['item.singlechoice.spec.items.help']}</small>`;
        let txaItems = document.createElement('textarea');
        txaItems.id = 'fog-builder-field-items';
        txaItems.value = this.spec.items.join('\n');
        txaItems.onchange = () => {this.spec.items = txaItems.value.split('\n'); builderUpdateCallback();};
        editControl.appendChild(lblItems);
        editControl.appendChild(txaItems);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let iptFormField = document.createElement('select');
        iptFormField.disabled = fog.disabled;
        iptFormField.id = `${fog.id}[${position}]`;
        iptFormField.name = `${fog.id}[${position}]`;
        this.spec.items.forEach((element, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = element;
            iptFormField.appendChild(option);
        });
        iptFormField.value = this.value;
        iptFormField.onchange = () => {this.value = iptFormField.value};
        formField.appendChild(lblFormField);
        formField.appendChild(iptFormField);
        return formField;
    }

    getFormattedValue() {
        return this.spec.items[this.value];
    }
}

class FogFieldText extends FogField {
    constructor(json = null) {
        super(json);
        this.type = 'text';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // No extra fields
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let iptFormField = document.createElement('input');
        iptFormField.disabled = fog.disabled;
        iptFormField.id = `${fog.id}[${position}]`;
        iptFormField.name = `${fog.id}[${position}]`;
        iptFormField.type = 'text';
        iptFormField.value = this.value;
        iptFormField.onchange = () => {this.value = iptFormField.value};
        formField.appendChild(lblFormField);
        formField.appendChild(iptFormField);
        return formField;
    }

    getFormattedValue() {
        return this.value;
    }
}

class FogFieldTextArea extends FogField {
    constructor(json = null) {
        super(json);
        if (!json) {
            this.spec = {
                length: {
                    measure: 'no', // Can also be 'bycharacter' or 'byword'
                    min: 0, // nonnegative integer values
                    max: 0, // nonnegative integer values
                },
            };
        }
        this.type = 'textarea';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // Length measure field
        let lblLengthMeasure = document.createElement('label');
        lblLengthMeasure.htmlFor = 'fog-builder-length-measure';
        lblLengthMeasure.textContent = Fog.dictionary['item.textarea.spec.length.measure'];
        let optLengthMeasureByCharacter = document.createElement('option');
        optLengthMeasureByCharacter.value = 'bycharacter';
        optLengthMeasureByCharacter.textContent = Fog.dictionary['item.textarea.spec.length.measure.bycharacter'];
        let optLengthMeasureByWord = document.createElement('option');
        optLengthMeasureByWord.value = 'byword';
        optLengthMeasureByWord.textContent = Fog.dictionary['item.textarea.spec.length.measure.byword'];
        let optLengthMeasureNo = document.createElement('option');
        optLengthMeasureNo.value = 'no';
        optLengthMeasureNo.textContent = Fog.dictionary['item.textarea.spec.length.measure.no'];
        let selLengthMeasure = document.createElement('select');
        selLengthMeasure.id = 'fog-builder-length-measure';
        selLengthMeasure.appendChild(optLengthMeasureByCharacter);
        selLengthMeasure.appendChild(optLengthMeasureByWord);
        selLengthMeasure.appendChild(optLengthMeasureNo);
        selLengthMeasure.value = this.spec.length.measure;
        selLengthMeasure.onchange = () => {this.spec.length.measure = selLengthMeasure.value; builderUpdateCallback();};
        editControl.appendChild(lblLengthMeasure);
        editControl.appendChild(selLengthMeasure);
        // Length min field
        let lblLengthMin = document.createElement('label');
        lblLengthMin.htmlFor = 'fog-builder-length-min';
        lblLengthMin.textContent = Fog.dictionary['item.textarea.spec.length.min'];
        let iptLengthMin = document.createElement('input');
        iptLengthMin.type = 'number';
        iptLengthMin.min = 0;
        iptLengthMin.step = 1;
        iptLengthMin.id = 'fog-builder-length-min';
        iptLengthMin.value = this.spec.length.min;
        iptLengthMin.onchange = () => {this.spec.length.min = iptLengthMin.value; builderUpdateCallback();};
        editControl.appendChild(lblLengthMin);
        editControl.appendChild(iptLengthMin);
        // Length max field
        let lblLengthMax = document.createElement('label');
        lblLengthMax.htmlFor = 'fog-builder-length-max';
        lblLengthMax.textContent = Fog.dictionary['item.textarea.spec.length.max'];
        let iptLengthMax = document.createElement('input');
        iptLengthMax.type = 'number';
        iptLengthMax.min = 0;
        iptLengthMax.step = 1;
        iptLengthMax.id = 'fog-builder-length-min';
        iptLengthMax.value = this.spec.length.max;
        iptLengthMax.onchange = () => {this.spec.length.max = iptLengthMax.value; builderUpdateCallback();};
        editControl.appendChild(lblLengthMax);
        editControl.appendChild(iptLengthMax);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        let lblFormField = document.createElement('label');
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let spnCounter = document.createElement('span');
        let iptFormField = document.createElement('textarea');
        iptFormField.disabled = fog.disabled;
        iptFormField.id = `${fog.id}[${position}]`;
        iptFormField.name = `${fog.id}[${position}]`;
        iptFormField.value = this.value;
        iptFormField.onchange = () => {this.value = iptFormField.value};
        iptFormField.onkeyup = () => {
            switch (this.spec.length.measure) {
                case 'bycharacter':
                    let characters = iptFormField.value;
                    spnCounter.textContent = Fog.dictionary['item.textarea.character.count'].replace('{{chars}}', characters.length);
                    if (characters.length < this.spec.length.min || characters.length > this.spec.length.max)
                        spnCounter.setAttribute('role', 'alert');
                    else
                        spnCounter.removeAttribute('role');
                    break;
                case 'byword':
                    let words = iptFormField.value.match(/\S+/g) || [];
                    spnCounter.textContent = Fog.dictionary['item.textarea.word.count'].replace('{{words}}', words.length);
                    if (words.length < this.spec.length.min || words.length > this.spec.length.max)
                        spnCounter.setAttribute('role', 'alert');
                    else
                        spnCounter.removeAttribute('role');
                    break;
                default:
                    break;
            }
        };
        iptFormField.onkeyup();
        formField.appendChild(lblFormField);
        formField.appendChild(spnCounter);
        formField.appendChild(iptFormField);
        return formField;
    }

    getFormattedValue() {
        return this.value;
    }

    generateHelperText() {
        let restrictions = [];
        if (this.mandatory) restrictions.push(Fog.dictionary['form.field.helper.text.mandatory']);
        if (this.spec.length.measure == 'byword')
            restrictions.push(Fog.dictionary['form.field.helper.text.length.by.word'].replace('{{min}}', this.spec.length.min).replace('{{max}}', this.spec.length.max));
        if (this.spec.length.measure == 'bycharacter')
            restrictions.push(Fog.dictionary['form.field.helper.text.length.by.character'].replace('{{min}}', this.spec.length.min).replace('{{max}}', this.spec.length.max));
        return (restrictions.length == 0) ? 
            '' :
            Fog.dictionary['form.field.helper.text'].replace('{{helper-text}}',
            restrictions.join(Fog.dictionary['form.field.helper.text.separator']));
    }
}

class Fog {
    constructor(id, structure = null, disabled = false) {
        if (id) this.id = id;
        else throw new Error('Id is mandatory');
        this.structureImport(structure || []);
        this.disabled = disabled;
    }

    /**
     * Creates the Fog Builder element to be added in the page.
     */
    builderGet() {
        if (!this.builder) {
            // Creating builder element
            this.builder = document.createElement('div');
            this.builder.id = this.id + '-fog-builder';       

            // Creating toolbar
            let formBuilderToolbar = document.createElement('div');
            this.builder.appendChild(formBuilderToolbar);

            // Inserting add buttons to the toolbar 
            for (const [type, classs] of Object.entries(Fog.registeredClasses)) {
                let toolbar = formBuilderToolbar;
                let button = document.createElement('button');
                button.disabled = this.disabled;
                button.type = 'button';
                button.innerHTML = Fog.dictionary[`structure.table.button.add.${type}`];
                button.onclick = () => {this.structure.push(new classs()); this.builderUpdate();};
                toolbar.appendChild(button);
            }

            // Creating table
            let formBuilderTable = document.createElement('table');
            let formBuilderTHead = document.createElement('thead');
            let formBuilderTBody = document.createElement('tbody');
            formBuilderTHead.insertRow(-1).innerHTML = `
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
        }
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
        if (this.closePreviousEditor) this.closePreviousEditor();
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
            this.closePreviousEditor = null;
            tbody.deleteRow(position + 1);
            tbody.rows[position].cells[5].firstChild.style.visibility = 'visible';
            tbody.rows[position].cells[6].firstChild.style.visibility = 'visible';
            tbody.rows[position].cells[7].firstChild.style.visibility = 'visible';
            tbody.rows[position].cells[8].firstChild.style.visibility = 'visible';
            this.builderUpdate();
        };
        this.closePreviousEditor = btnClose.onclick;
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
            btnMoveUp.disabled = this.disabled;
            btnMoveUp.type = 'button';
            btnMoveUp.style.backgroundColor = 'Transparent';
            btnMoveUp.style.border = 'none';
            btnMoveUp.style.outline = 'none';
            btnMoveUp.innerHTML = Fog.upButton;
            btnMoveUp.onclick = () => this.builderMoveItem(i, -1);
            tr.insertCell(-1).appendChild(btnMoveUp);

            let btnMoveDown = document.createElement('button');
            btnMoveDown.disabled = this.disabled;
            btnMoveDown.type = 'button';
            btnMoveDown.style.backgroundColor = 'Transparent';
            btnMoveDown.style.border = 'none';
            btnMoveDown.style.outline = 'none';
            btnMoveDown.innerHTML = Fog.downButton;
            btnMoveDown.onclick = () => this.builderMoveItem(i, +1);
            tr.insertCell(-1).appendChild(btnMoveDown);

            let btnEdit = document.createElement('button');
            btnEdit.disabled = this.disabled;
            btnEdit.type = 'button';
            btnEdit.style.backgroundColor = 'Transparent';
            btnEdit.style.border = 'none';
            btnEdit.style.outline = 'none';
            btnEdit.innerHTML = Fog.editButton;
            btnEdit.onclick = () => this.builderEditItem(i);
            tr.insertCell(-1).appendChild(btnEdit);
            
            let btnDelete = document.createElement('button');
            btnDelete.disabled = this.disabled;
            btnDelete.type = 'button';
            btnDelete.style.backgroundColor = 'Transparent';
            btnDelete.style.border = 'none';
            btnDelete.style.outline = 'none';
            btnDelete.innerHTML = Fog.deleteButton;
            btnDelete.onclick = () => this.builderDeleteItem(i);
            tr.insertCell(-1).appendChild(btnDelete);
        });
    }

    formGet() {
        if (!this.form) {
            this.form = document.createElement('form');
            this.form.id = this.id + '-fog-form';     
            this.formUpdate();
        }
        return this.form;
    }

    formUpdate() {
        while (this.form.firstChild) this.form.removeChild(this.form.firstChild);
        this.structure.forEach((element, index) => {
            this.form.appendChild(element.formFieldCreate(this, index));
        });
    }

    structureExport() {
        return(JSON.parse(JSON.stringify(this.structure)));
    }

    structureImport(structure) {
        this.structure = [];
        structure.forEach(element => {
            let classs = Fog.registeredClasses[element.type];
            if (classs) this.structure.push(new classs(element));
        });
        if (this.builder) this.builderUpdate();
        if (this.form) this.formUpdate();
    }

    // Resources
    static registeredClasses = {
        'choice': FogFieldChoice,
        'file': FogFieldFile,
        'groupedtext': FogFieldGroupedText,
        'multiplechoice': FogFieldMultipleChoice,
        'singlechoice': FogFieldSingleChoice,
        'text': FogFieldText,
        'textarea': FogFieldTextArea,
    };
    static supportedFileTypes = {
        'application/pdf' : {extensions:['pdf']},
        'image/png' : {extensions:['png']},
        'image/jpeg': {extensions:['jpeg','jpg','jpe']},
        'image/bmp': {extensions:['bmp']},
        'application/msword': {extensions:['doc']},
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {extensions:['docx']},
        'application/vnd.ms-excel': {extensions:['xls']},
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {extensions:['xlsx']},
        'application/vnd.ms-powerpoint': {extensions:['ppt']},
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': {extensions:['pptx']},
    }
    static editButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>';
    static deleteButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser" viewBox="0 0 16 16"><path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/></svg>';
    static downButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>';
    static upButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>';
    static dictionary = {
        "control.action.change": "Change",
        "control.restriction.filetypes": "File types: ",
        "control.restriction.filetypes.all": "all ",
        "control.restriction.maxsize": "Maximum size: ",
        "control.restriction.maxsize.megabytes": " MB",
        "control.singlechoice.null": "&gt;&gt; Select", //TODO!
        "form.field.helper.text":" <small>({{helper-text}})</small>",
        "form.field.helper.text.mandatory": "mandatory",
        "form.field.helper.text.separator": ", ",
        "form.field.helper.text.length.by.word": "min. words: {{min}}, max. words: {{max}}",
        "form.field.helper.text.length.by.character": "min. characters: {{min}}, max. characters: {{max}}",
        "item.action.close": "Close",
        "item.textarea": "Text area",
        "item.textarea.spec.length.measure": "Restrict length",
        "item.textarea.spec.length.measure.bycharacter": "By character",
        "item.textarea.spec.length.measure.byword": "By word",
        "item.textarea.spec.length.measure.no": "No",
        "item.textarea.spec.length.max": "Maximum length",
        "item.textarea.spec.length.min": "Minimum length",
        "item.textarea.character.count": "{{chars}} characters",
        "item.textarea.word.count": "{{words}} words",
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
        "structure.table.button.add.textarea": "+ Text area",
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