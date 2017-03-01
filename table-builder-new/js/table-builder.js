$(function(){

    var builderWrap = $('.table-builder-wrap');
    var tablePrompt = $('<div class="table-prompt"></div>');
    var tablePathStepOne = $('<div class="table-path step-one"></div>');
    var tablePathStepTwo = $('<div class="table-path step-two"></div>');

    function tableBuild() {

    }

    function tableCreate(type) {

        if(type == "new") {
            builderWrap.empty();
            builderWrap.append('New Table')
        } else if (type == "import") {
            tablePathStepOne.hide();
            tablePathStepTwo.append('<button class="back">Back</button><br />')
                            .append('<h1>Import JSON</h1>')
                            .append('<textarea></textarea><br />')
                            .append('<button class="button import-submit">Import</button>');
            tablePrompt.append(tablePathStepTwo);
        } else if (type == "wizard") {
            tablePath.empty();
            tablePath.append('Wizard');
        } else {
            console.log("something went wrong!");
        }
    }

    function tableStart() {

        tablePathStepOne.append('<h1>Create a new table</h1>')
                        .append('<button class="button new-table">New Table</button>')
                        .append('<button class="button import-table">Import Table</button>')
                        .append('<button class="button table-wizard">Table Wizard</button>');

        tablePrompt.append(tablePathStepOne);
        builderWrap.append(tablePrompt);

        $('.new-table').on('click', function(){
            tableCreate('new');
        });

        $('.import-table').on('click', function(){
            tableCreate('import');
        });

        $('.table-wizard').on('click', function(){
            tableCreate('wizard');
        });
    }

    $('body').on('click', '.back', function(){
        tablePathStepTwo.empty().remove();
        tablePathStepOne.show();
    });

    tableStart();

});