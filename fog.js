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
        editControl.style.gridTemplateColumns = 'min-content auto';
        editControl.style.whiteSpace = 'nowrap';
        editControl.style.alignItems = 'center';
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
        editControl.appendChild(lblMandatory);
        editControl.appendChild(iptMandatory);
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
        formField.classList.add('fog-field-choice');
        fog.applyStyle('fieldChoice', formField);
        let lblFormField = document.createElement('label');    
        fog.applyStyle('fieldChoiceLabel', lblFormField);
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        let iptHidden = document.createElement('input');
        iptHidden.type = 'hidden';
        iptHidden.value = '0';
        iptHidden.name = `${fog.id}[${position}]`;
        let iptCheck = document.createElement('input');
        fog.applyStyle('fieldChoiceCheckbox', iptCheck);
        iptCheck.type = 'checkbox';
        iptCheck.disabled = fog.options.disabled || false;
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
            this.spec = {
                file_types:[], // array containing mimetypes
                max_size:0 // nonnegative float values
            };
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
                builderUpdateCallback();
            };
            let lblFileType = document.createElement('label');
            lblFileType.htmlFor = `fog-builder-filetype-${fileType}`;
            lblFileType.textContent = properties.extensions[0];
            divFileType.appendChild(cbxFileType);
            divFileType.appendChild(lblFileType);
            divFileTypes.appendChild(divFileType);
        }
        editControl.appendChild(lblFileTypes);
        editControl.appendChild(divFileTypes);
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        formField.classList.add('fog-field-file');
        fog.applyStyle('fieldFile', formField);
        let lblFormField = document.createElement('label');
        fog.applyStyle('fieldFileLabel', lblFormField);   
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        formField.appendChild(lblFormField);
        if (this.value === null) {
            let iptFile = document.createElement('input');
            iptFile.type = 'file'; // TODO IMPLEMENT ONCHANGE BEHAVIOUR
            fog.applyStyle('fieldFileInput', iptFile);
            iptFile.id = `${fog.id}[${position}]`;
            iptFile.name = `${fog.id}[${position}]`;
            formField.appendChild(iptFile);
        } else {
            let spnFile = document.createElement('span');
            fog.applyStyle('fieldFileInfo', spnFile);
            let lnkFile = document.createElement('a'); 
            fog.applyStyle('fieldFileLink', lnkFile);
            lnkFile.textContent = this.value; // TODO IMPLEMENT PROPER DISPLAY
            lnkFile.href = 'https://google.com';  // TODO IMPLEMENT PROPER LINK
            let btnClear = document.createElement('button');  // TODO IMPLEMENT CLEAR BEHAVIOUR
            fog.applyStyle('fieldFileClear', btnClear);
            btnClear.innerHTML = Fog.deleteButton;
            spnFile.appendChild(lnkFile);
            spnFile.appendChild(btnClear);
            formField.appendChild(spnFile);
        }        
        return formField;
    }

    generateHelperText() {
        let restrictions = [];
        if (this.mandatory) restrictions.push(Fog.dictionary['form.field.helper.text.mandatory']);
        if (this.spec.max_size > 0)
            restrictions.push(Fog.dictionary['item.file.help.maxsize'].replace('{{size}}', this.spec.max_size));
        if (this.spec.file_types.length > 0)
            restrictions.push(Fog.dictionary['item.file.help.filetypes'].replace('{{file-types}}', 
                this.spec.file_types
                    .map((x) => Fog.supportedFileTypes[x].extensions[0])
                    .join(Fog.dictionary['form.field.helper.text.separator'])
                )
            );
        else
            restrictions.push(Fog.dictionary['item.file.help.filetypes'].replace('{{file-types}}', Fog.dictionary['item.file.help.filetypes.all']));
    
        return (restrictions.length == 0) ? 
            '' :
            Fog.dictionary['form.field.helper.text'].replace('{{helper-text}}',
            restrictions.join(Fog.dictionary['form.field.helper.text.separator']));
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
        formField.classList.add('fog-field-groupedtext');
        fog.applyStyle('fieldGroupedtext', formField);
        let lblFormField = document.createElement('label');
        fog.applyStyle('fieldGroupedtextLabel', lblFormField);
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let formGroup = document.createElement('span');
        fog.applyStyle('fieldGroupedtextGroup', formGroup);
        this.spec.items.forEach((element, index) => {
            let item = document.createElement('span');
            fog.applyStyle('fieldGroupedtextItem', item);
            let lblCheck = document.createElement('label');
            fog.applyStyle('fieldGroupedtextItemLabel', lblCheck);
            lblCheck.htmlFor = `${fog.id}[${position}][${index}]`;
            lblCheck.textContent = element;
            let iptCheck = document.createElement('input');
            fog.applyStyle('fieldGroupedtextItemInput', iptCheck);
            iptCheck.type = 'text';
            iptCheck.disabled = fog.options.disabled || false;
            iptCheck.id = `${fog.id}[${position}][${index}]`;
            iptCheck.name = `${fog.id}[${position}][${index}]`;
            iptCheck.value = this.value[index];
            iptCheck.onchange = () => {this.value[index] = iptCheck.value};
            item.appendChild(lblCheck);
            item.appendChild(iptCheck);
            formGroup.appendChild(item);
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
        formField.classList.add('fog-field-multiplechoice');
        fog.applyStyle('fieldMultiplechoice', formField);
        let lblFormField = document.createElement('label');
        fog.applyStyle('fieldMultiplechoiceLabel', lblFormField);    
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let formGroup = document.createElement('span');
        fog.applyStyle('fieldMultiplechoiceGroup', formGroup);
        this.spec.items.forEach((element, index) => {
            let item = document.createElement('span');
            fog.applyStyle('fieldMultiplechoiceItem', item);
            let iptHidden = document.createElement('input');
            iptHidden.type = 'hidden';
            iptHidden.value = '0';
            iptHidden.name = `${fog.id}[${position}][${index}]`;
            let iptCheck = document.createElement('input');
            fog.applyStyle('fieldMultiplechoiceItemInput', iptCheck);
            iptCheck.type = 'checkbox';
            iptCheck.disabled = fog.options.disabled || false;
            iptCheck.id = `${fog.id}[${position}][${index}]`;
            iptCheck.name = `${fog.id}[${position}][${index}]`;
            iptCheck.value = '1';
            iptCheck.checked = parseInt(this.value[index]);
            iptCheck.onchange = () => {this.value[index] = iptCheck.checked ? "1" : "0"};
            let lblCheck = document.createElement('label');
            fog.applyStyle('fieldMultiplechoiceItemLabel', lblCheck);
            lblCheck.htmlFor = `${fog.id}[${position}][${index}]`;
            lblCheck.textContent = element;
            item.appendChild(iptHidden);
            item.appendChild(iptCheck);
            item.appendChild(lblCheck);
            formGroup.appendChild(item);
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
        formField.classList.add('fog-field-singlechoice');
        fog.applyStyle('fieldSinglechoice', formField);
        let lblFormField = document.createElement('label');
        fog.applyStyle('fieldSinglechoiceLabel', lblFormField);
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let iptFormField = document.createElement('select');
        fog.applyStyle('fieldSinglechoiceSelect', iptFormField);
        iptFormField.disabled = fog.options.disabled || false;
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
        if (!json) {
            this.value = '';
        }
        this.type = 'text';
    }

    builderEditorCreate(builderUpdateCallback) {
        let editControl = super.builderEditorCreate(builderUpdateCallback);
        // No extra fields
        return editControl;
    }

    formFieldCreate(fog, position) {
        let formField = document.createElement('div');
        formField.classList.add('fog-field-text');
        fog.applyStyle('fieldText', formField);
        let lblFormField = document.createElement('label');
        fog.applyStyle('fieldTextLabel', lblFormField);
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let iptFormField = document.createElement('input');
        fog.applyStyle('fieldTextInput', iptFormField);
        iptFormField.disabled = fog.options.disabled || false;
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
            this.value = '';
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
        formField.classList.add('fog-field-textarea');
        fog.applyStyle('fieldTextarea', formField);
        let lblFormField = document.createElement('label');
        fog.applyStyle('fieldTextareaLabel', lblFormField);
        lblFormField.htmlFor = `${fog.id}[${position}]`;
        lblFormField.innerHTML = `${this.description}${this.generateHelperText()}`;
        let spnCounter = document.createElement('span');
        fog.applyStyle('fieldTextareaInfo', spnCounter);
        let iptFormField = document.createElement('textarea');
        fog.applyStyle('fieldTextareaInput', iptFormField);
        iptFormField.disabled = fog.options.disabled || false;
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
    constructor(id, structure = null, style = null, options = null) {
        if (id) this.id = id;
        else throw new Error('Id is mandatory');
        this.structureImport(structure || []);
        this.style = style || {};
        this.options = options || {};
    }

    applyStyle(styleKey, element) {
        if (this.style[styleKey]) {
            if (this.style[styleKey].classList)
                this.style[styleKey].classList.forEach(x =>element.classList.add(x));
            if (this.style[styleKey].style)
                for (const [key, value] of Object.entries(this.style[styleKey].style))
                    element.style[`${key}`] = value;
        }
    }

    /**
     * Creates the Fog Builder element to be added in the page.
     */
    builderGet() {
        if (!this.builder) {
            // Creating builder element
            this.builder = document.createElement('div');
            this.builder.classList.add('fog-builder');
            this.applyStyle('builder', this.builder);

            // Creating toolbar
            this.builderToolbar = document.createElement('div');
            this.builderToolbar.classList.add('fog-builder-toolbar');
            this.applyStyle('builderToolbar', this.builderToolbar);

            // Inserting add buttons to the toolbar 
            for (const [type, classs] of Object.entries(Fog.registeredClasses)) {
                let button = document.createElement('button');
                this.applyStyle('builderToolbarButton', button);
                button.disabled = this.options.disabled || false;
                button.type = 'button';
                button.innerHTML = Fog.dictionary[`builder.button.add.${type}`];
                button.onclick = () => {
                    this.structure.push(new classs());
                    this.builderUpdate();
                    if (this.options.onStructureChange) this.options.onStructureChange();
                };
                this.builderToolbar.appendChild(button);
            }

            // Creating table
            let builderTable = document.createElement('table');
            let builderTBody = document.createElement('tbody');
            builderTable.classList.add('fog-builder-table');
            this.applyStyle('builderTable', builderTable);
            builderTable.appendChild(builderTBody);
            this.builder.appendChild(builderTable);
            this.builderUpdate();
        }
        return this.builder;
    }

    builderDeleteItem(position) {
        if(confirm(Fog.dictionary['builder.message.delete'].replace('{{position}}', position+1)))
        {
            this.structure.splice(position, 1);
            this.builderUpdate();
            if (this.options.onStructureChange) this.options.onStructureChange();
        }
    }

    builderMoveItem(position, offset) {
        if (position+offset >= this.structure.length || position+offset < 0) return;
        let currentItem = this.structure[position];
        let movedItem = this.structure[position+offset];
        this.structure[position+offset] = currentItem;
        this.structure[position] = movedItem;
        this.builderUpdate();
        if (this.options.onStructureChange) this.options.onStructureChange();
    }

    builderUpdate() {
        let tbody = this.builder.children[0].children[0];
        while (tbody.rows.length > 0) tbody.deleteRow(-1);
        this.structure.forEach((element, i) => {
            let tr = tbody.insertRow(-1);

            let mainTd = tr.insertCell(-1);
            mainTd.appendChild(element.formFieldCreate(this, i));

            let btnEdit = document.createElement('button');
            btnEdit.disabled = this.options.disabled || false;
            btnEdit.type = 'button';
            btnEdit.style.backgroundColor = 'Transparent';
            btnEdit.style.border = 'none';
            btnEdit.style.outline = 'none';
            btnEdit.innerHTML = Fog.editButton;
            
            let btnEditFinish = document.createElement('button');
            btnEditFinish.disabled = this.options.disabled || false;
            btnEditFinish.type = 'button';
            btnEditFinish.style.backgroundColor = 'Transparent';
            btnEditFinish.style.border = 'none';
            btnEditFinish.style.outline = 'none';
            btnEditFinish.style.display = 'none';
            btnEditFinish.innerHTML = Fog.okButton;

            btnEdit.onclick = () => {
                let editor = this.structure[i].builderEditorCreate(() => {
                    mainTd.replaceChild(this.structure[i].formFieldCreate(this, i), mainTd.children[0]);
                    if (this.options.onStructureChange) this.options.onStructureChange();
                });
                mainTd.appendChild(editor);
                btnEdit.style.display = 'none';
                btnEditFinish.style.display = 'inline-block';
            };
            btnEditFinish.onclick = () => {
                mainTd.removeChild(mainTd.lastChild);
                btnEdit.style.display = 'inline-block';
                btnEditFinish.style.display = 'none';
            }            

            let editTd = tr.insertCell(-1);
            editTd.appendChild(btnEdit);
            editTd.appendChild(btnEditFinish);

            let btnMoveUp = document.createElement('button');
            btnMoveUp.disabled = this.options.disabled || false;
            btnMoveUp.type = 'button';
            btnMoveUp.style.backgroundColor = 'Transparent';
            btnMoveUp.style.border = 'none';
            btnMoveUp.style.outline = 'none';
            btnMoveUp.innerHTML = Fog.upButton;
            btnMoveUp.onclick = () => this.builderMoveItem(i, -1);
            tr.insertCell(-1).appendChild(btnMoveUp);

            let btnMoveDown = document.createElement('button');
            btnMoveDown.disabled = this.options.disabled || false;
            btnMoveDown.type = 'button';
            btnMoveDown.style.backgroundColor = 'Transparent';
            btnMoveDown.style.border = 'none';
            btnMoveDown.style.outline = 'none';
            btnMoveDown.innerHTML = Fog.downButton;
            btnMoveDown.onclick = () => this.builderMoveItem(i, +1);
            tr.insertCell(-1).appendChild(btnMoveDown);
            
            let btnDelete = document.createElement('button');
            btnDelete.disabled = this.options.disabled || false;
            btnDelete.type = 'button';
            btnDelete.style.backgroundColor = 'Transparent';
            btnDelete.style.border = 'none';
            btnDelete.style.outline = 'none';
            btnDelete.innerHTML = Fog.deleteButton;
            btnDelete.onclick = () => this.builderDeleteItem(i);
            tr.insertCell(-1).appendChild(btnDelete);
        });
        let lastRow = tbody.insertRow(-1).insertCell(-1);
        lastRow.colSpan = 5;
        lastRow.appendChild(this.builderToolbar);
    }

    formGet() {
        if (!this.form) {
            this.form = document.createElement('form');
            this.form.id = this.id;
            this.form.classList.add('fog-form');
            this.applyStyle('form', this.form);
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
        'image/gif' : {extensions:['gif']},
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
    static okButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>';
    static upButton = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>';
    static dictionary = {
        "item.file.help.filetypes": "file types: {{file-types}}",
        "item.file.help.filetypes.all": "all ",
        "item.file.help.maxsize": "maximum size: {{size}} MB",
        "item.singlechoice.value.null": "&gt;&gt; Select", //TODO!
        "form.field.helper.text":" <small>({{helper-text}})</small>",
        "form.field.helper.text.mandatory": "mandatory",
        "form.field.helper.text.separator": ", ",
        "form.field.helper.text.length.by.word": "min. words: {{min}}, max. words: {{max}}",
        "form.field.helper.text.length.by.character": "min. characters: {{min}}, max. characters: {{max}}",
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
        "builder.button.add.textarea": "+ Text area",
        "builder.button.add.choice": "+ Choice",
        "builder.button.add.file": "+ File",
        "builder.button.add.groupedtext": "+ Grouped text",
        "builder.button.add.multiplechoice": "+ Multiple choice",
        "builder.button.add.singlechoice": "+ Single choice",
        "builder.button.add.text": "+ Text",
        "builder.message.delete": "Are you sure you want to delete item at position {{position}}?"
    };
}