$(function(){


    // ** CONSTANTS ** //
    var builderWrap = $('.table-builder-wrap'),
        tablePrompt = $('<div class="table-prompt"></div>'),
        tablePathStepOne = $('<div class="table-path step-one"></div>'),
        tablePathStepTwo = $('<div class="table-path step-two"></div>');



    // ** TABLE WIZARD ** //
    function tableWizard() {

        $('.steptwo').addClass('active');
        $('.table-step h1').text("Set table properties");

        var tableWizard = $('<div class="table-wizard"></div>');

        tableWizard.append('<h2>Table Title</h2><input class="table-title" type="text" />' +
                            '<div class="table-properties"><input type="checkbox" /><label>Row Header</label><input type="checkbox" /><label>Column Headers</label></div>'+
                            '<button class="button start-table">Start Table</button>');
        builderWrap.append(tableWizard);

        $('.start-table').on('click', function(){
            builderWrap.empty();
            tableBuild();
        })
    }


    // ** TABLE BUILD ** //
    function tableBuild() {
        $('.stepthree').addClass('active');
        $('.table-step h1').text("Create table");
        var tableBuilder = $('<div class="table-builder"></div>');
        var rows = $('.rows');
        var columns = $('.columns');


        /***** Create Table Builder *****/

        tableBuilder.append('<div class="table-controls">' +
                            '<div class="main-controls"><h2>Table Controls</h2><br /><button class="add-col button"><svg class="icon icon-arrow-right2"><use xlink:href="#icon-arrow-right2"></use></svg> Add Column</button><button class="add-row button"><svg class="icon icon-arrow-down2"><use xlink:href="#icon-arrow-down2"></use></svg> Add Row</button></div>' +
                            '<div class="custom-controls">' + 
                            '<div class="column-controls"><h2>Columns</h2><button class="button merge-group">Merge Column Cells</button></div>' +
                            '<div class="row-controls"><h2>Rows</h2><button class="button merge-across">Merge Row Cells</button></div>' +
                            '<div class="cell-controls"><h2>Cell Controls</h2><button class="button footnote-to-cell"><svg class="icon icon-pushpin"><use xlink:href="#icon-pushpin"></use></svg><span class="name"> icon-pushpin</span> Add Footnote to Cell</button><div class="footnote-group"><ol></ol></div></div>' +
                            '</div>' + 
                            '</div>' +
                            '<div class="table-construct"><h2>Workspace</h2><div class="title-edit"><input class="table-title" type="text" placeholder="Table Title" /></div><div class="columns"></div><div class="rows"></div></div>' +
                            '<button class="add-footnotes button"><svg class="icon icon-pushpin"><use xlink:href="#icon-pushpin"></use></svg><span class="name"> icon-pushpin</span> Add Footnotes</button><div class="footnote-list"></div><br /><br /><button class="save button"><svg class="icon icon-floppy-disk"><use xlink:href="#icon-floppy-disk"></use></svg><span class="name"> icon-floppy-disk</span> Save</button>');
          
        builderWrap.append(tableBuilder);
        builderWrap.append('<h2>Preview Table</h2><h4 class="headline-section-sub"></h4><table id="preview-table"><thead><tr></tr></thead><tbody></tbody></table>');


        $('.add-footnotes').on('click', function () {
            $(this).attr('disabled', 'disabled').text('Footnotes');
            $('.footnote-list').append('<ol><li><input type="text" class="footnote" data-footnote="1" /><button class="add-footnote">+</button></li></ol>');
            $('#preview-table').after('<div class="table-notes"><ol></ol></div>');
        });

        tableBuilder.on('click', '.add-footnote', function(){
            var $this = $(this),
                input = $this.prev(),
                inputVal = input.val(),
                lastPos = input.data('footnote'),
                thisPos = lastPos + 1;

            if (inputVal.length > 0) {
                $this.text('-').addClass('remove-footnote').removeClass('add-footnote');
                input.attr('disabled','disabled');
                $('.footnote-list ol').append('<li><input type="text" class="footnote" data-footnote="' + thisPos + '" /><button class="add-footnote">+</button></li>');
                $('.table-notes ol').append('<li class="table-note" data-footnotepos="' + thisPos + '">' + inputVal + '</li>')
                $('.footnote-group ol').append('<li class="table-note" data-footnotepos="' + thisPos + '"><div class="footnote-val">' + inputVal + '</div><button class="add-footnote-to-cell">Add</button></li>')
            }
        });

        tableBuilder.on('click', '.remove-footnote', function () {
            $(this).closest('li').remove();

            $('.footnote-list input').each(function() {
                var pos = $(this).closest('li').index();
                var newPos = pos + 1;

                $(this).attr('data-footnote', newPos)
                $('.table-notes li[data-footnotepos="' + pos + '"]').remove();
            });
        });


        /***** UPDATING COLUMN TEXT *****/

        $('.table-construct').on('keyup', '.table-title', function () {
            var $this = $(this),
                col = $this.data('col'),
                text = $this.val();

            $('.headline-section-sub').text(text);
        });


        /***** UPDATING COLUMN TEXT *****/

        $('.columns').on('keyup', 'input', function () {
            var $this = $(this),
                col = $this.data('col'),
                text = $this.val();

            $('th[data-col="' + col + '"]').text(text);
            $('.row input[data-col="' + col + '"]').attr('placeholder', text)
        });


        /***** UPDATING CELL TEXT *****/

        $('.rows').on('keyup', '.field-edit', function () {
            var $this = $(this),
                row = $this.data('row'),
                col = $this.data('col'),
                val = $this.val();

            $('td[data-col="' + col + '"][data-row="' + row + '"] .cell-content').text(val);
        });


        /***** MAKE FULL ROW *****/

        $('.rows').on('change', '.full', function () {
            var $this = $(this),
                parentRow = $this.closest('.row'),
                rowID = parentRow.attr('id').replace('row', ''),
                colLength = $('.column').length,
                addedRow = $('tr[data-row="' + rowID + '"]');

            if ($this.is(':checked')) {
                addedRow.addClass('full-row');
                addedRow.find('td:not(:first-child)').hide();
                addedRow.find('td:first-child').attr('colspan', colLength);

                parentRow.addClass('full-row');
                parentRow.find('.merge-down').hide();
                parentRow.prev().find('.merge-down').hide();

                $('#row' + rowID + ' .cell:not(:first-child)').hide();

            } else {
                var columnControl = $('.column'),
                    rowControl = $('.row');

                var rowCount = rowControl.length + 1,
                    currowCount = columnControl.length;

                $('#row' + rowID + ' .cell:not(:first-child)').show();
                $('tr[data-row="' + rowID + '"] td:first-child').removeAttr('colspan');

                addedRow.removeClass('full-row');
                addedRow.find('td:not(:first-child)').show();

                parentRow.find('.merge-down').show();
            }
        });


        /***** MERGE DOWN *****/

        $('.rows').on('click', '.merge-down', function (e) {
            e.preventDefault();

            var $this = $(this),
                cellInput = $this.parent().prev(),
                thisRow = $this.closest('.row'),
                nextRow = thisRow.next('.row');

            var colNum = cellInput.data('col'),
                rowNum = cellInput.data('row'),
                rowNumNext = cellInput.data('row') + 1,
                TD = $('td[data-col="' + colNum + '"][data-row="' + rowNum + '"]');

            var nextRowCol = nextRow.find('input[data-col="' + colNum + '"]');

            $('tr[data-row="' + rowNum + '"]').next().find('td[data-col="' + colNum + '"][data-row="' + rowNumNext + '"]').hide();

            var nextMerged = $('td[data-col="' + colNum + '"][data-row="' + rowNumNext + '"]').attr('rowspan');
            var mergedNum = Number(nextMerged) + 1;

            $this.attr('rowspan') ? TD.attr('rowspan', mergedNum) : TD.attr('rowspan', '2');

            thisRow.find('label').hide();
            nextRow.find('label').hide();

            nextRowCol.attr('disabled', 'disabled');
            //nextRowCol.next().hide();

            if (nextRow.length > 0) {
                $this.hide();
            }
        });


        /***** MERGE ACROSS *****/

        $('.row-controls').on('click', '.merge-across', function (e) {
            e.preventDefault();

            var firstitem = $('.highlighted').first();
            var mergedNum = $('.highlighted').length;

            var colNum = firstitem.data('col'),
                rowNum = firstitem.data('row');

            var TD = $('td[data-col="' + colNum + '"][data-row="' + rowNum + '"]');

            $(this).attr('rowspan', mergedNum);

            TD.attr('colspan', mergedNum);

            firstitem.nextUntil('.cell:not(.highlighted)').addClass('cellhidden');

            $('.highlighted.cellhidden').each(function() {
                var $this = $(this),
                    thiscolNum = $this.data('col'),
                    thisrowNum = $this.data('row');

                $('td[data-col="' + thiscolNum + '"][data-row="' + thisrowNum + '"]').hide();
            });
        });


        $('.table-builder').on('click', '.footnote-to-cell', function(){
            $('.footnote-group').show();
        });

        $('.table-builder').on('click', '.add-footnote-to-cell', function () {
            var text = $(this).prev().text();
            var pos = $(this).parent().index() + 1;
            var thisrowNum = $('.cur-highlight').data('row');
            var thiscolNum = $('.cur-highlight').data('col');

            $('.cur-highlight').append('<div class="footnote-number">' + pos + '</div>');
            $('td[data-col="' + thiscolNum + '"][data-row="' + thisrowNum + '"]').append('<div class="footnote-number">' + pos + '</div>');
            $('td[data-col="' + thiscolNum + '"][data-row="' + thisrowNum + '"]').append('<div class="footnote-content">' + text + '</div>');
        });


        /***** RIGHT CLICK FUNCTIONALITY *****/

        var isMouseDown = false,
            initialColPos, initialRowPos;
        $('.rows').on('mousedown', '.cell', function () {
            $('.highlight-focus').removeClass('highlight-focus');
            $('.highlighted').removeClass("highlighted");
            $('.highlightable').removeClass('highlightable');
            $('.merge-row').removeClass('merge-row');
            $('.hidden').removeClass('hidden');
            $('.cur-highlight').removeClass('cur-highlight');
            $('.cell-controls').hide();
            $('.column-controls').hide();
            $('.row-controls').hide();

            switch (event.which) {
                case 1:

                    var $this = $(this);

                    if (event.shiftKey && !$this.hasClass('cellhidden')) {
                        isMouseDown = true;
                        if ($('.highlighted').length === 0) {
                            initialColPos = $this.data('col');
                            initialRowPos = $this.data('row');
                            $this.addClass("highlighted first-highlight");
                        } else {
                            $this.addClass("highlighted");
                        }
                    }
                    return false;
                    break;
                case 2:
                    break;
                case 3:
                    $(this).addClass('cur-highlight');
                    $(this).addClass("highlighted");
                    $('.cell-controls').show();
                    if ($('.footnote-group li').length > 0) {
                        $('.footnote-to-cell').show();
                    }
                    break;
                default:
            }
        }).on('mouseover', '.cell', function() {
            var $this = $(this),
                highlighted = $('.highlighted'),
                previewTable = $('#previewTable');

            if (isMouseDown = true && event.shiftKey && !$this.hasClass('cellhidden')) {
                if (highlighted.length === 1) {
                    $this.addClass("highlighted");

                    var mergeColBtn = $('.merge-group'),
                        mergeRowBtn = $('.merge-across');

                    if ($this.data('col') === initialColPos) {
                        $('.cell[data-col="' + initialColPos + '"]').addClass('highlightable');
                        previewTable.addClass('merge-col');
                        $('.column-controls').show();
                        $('.row-controls').hide();
                    } else if ($this.data('row') === initialRowPos) {
                        $('.cell[data-row="' + initialRowPos + '"]').addClass('highlightable');
                        $('#row' + initialRowPos).addClass('highlighted-row')
                        previewTable.addClass('merge-row');
                        $('.column-controls').hide();
                        $('.row-controls').show();
                    } else { }
                } else if (highlighted.length > 1) {
                    if ($this.hasClass('highlightable')) {
                        $this.addClass("highlighted");
                    }
                } else { }
            }
        }).on('mouseup', function () {
            isMouseDown = false;
        });

        $(document).on('mousedown', function () {
            switch (event.which) {
                case 1:
                    isMouseDown = false;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default:
            }
        });

        function mergeCol() {

        }


        /***** UPDATING CELL TEXT *****/

        $('.rows').on('click', '.cell', function () {
            $(this).find('input').focus();
        });

        $('.table-builder').on('contextmenu', '.highlighted', function (e) {
            e.preventDefault();

            if($('.highlighted').length > 1) {
                $('.table-builder').addClass('highlight-focus');
                $('.controls').show();
            }
        });

        $('.merge-group').on('click', function (e) {
            var highlighted = $(this),
                first = highlighted.first(),
                firstRow = first.data('row'),
                firstCol = first.data('col'),
                highlightedItems = $('.highlighted'),
                allHighlights = $('.highlighted').length;

            var first_iteration = true;

            highlightedItems.each(function () {
                var $this = $(this),
                    thisRow = $this.data('row'),
                    thisCol = $this.data('col'),
                    allCols = [],
                    allRows = [],
                    TD = $('td[data-row="' + thisRow + '"][data-col="' + thisCol + '"]');

                if (first_iteration == true) {
                    $('.cell.highlighted:not(.first-highlight)').addClass('cellhidden')
                    TD.addClass('highlighted').attr('rowspan', allHighlights);
                    allCols.push(thisCol);
                    allRows.push(thisRow);
                    first_iteration = false;
                } else {
                    TD.addClass('highlighted').hide();
                    allCols.push(thisCol);
                    allRows.push(thisRow);
                }
            });
        });
    }



    // ** TABLE BUILD SELECTION ** //
    function tableCreate(type) {
        if(type == "new") {
            builderWrap.empty();
            tableWizard();
        } else if (type == "import") {
            tablePathStepOne.hide();
            tablePathStepTwo.append('<button class="back">Back</button><br />' +
                                    '<h1>Import JSON</h1>' +
                                    '<textarea></textarea><br />' +
                                    '<button class="button import-submit">Import</button>');
            tablePrompt.append(tablePathStepTwo);
        } else {
            console.log("something went wrong!");
        }
    }



    // ** START SCREEN ** //
    function tableStart() {
        $('.stepone').addClass('active');

        tablePathStepOne.append('<button class="button new-table"><svg class="icon icon-table"><use xlink:href="#icon-table"></use></svg> New Table</button>' +
                                '<button class="button import-table"><svg class="icon icon-box-remove"><use xlink:href="#icon-box-remove"></use></svg> Import Table</button>');

        tablePrompt.append(tablePathStepOne);
        builderWrap.append(tablePrompt);

        $('.new-table').on('click', function(){
            tableCreate('new');
        });

        $('.import-table').on('click', function () {
            $('.steptwo').addClass('active');
            $('.table-step h1').text("Import table JSON");
            tableCreate('import');
        });
    }



    // ** BACK BUTTON** //
    $('body').on('click', '.back', function(){
        tablePathStepTwo.empty().remove();
        tablePathStepOne.show();
        $('.table-step h1').text("Create or import a new table");
        $('.steptwo').removeClass('active');
    });



    // ** INIT ** //
    tableStart();

    








 





    

    /***** CONSTANTS *****/

    var addColBtn = $('.add-col'),
        addRowBtn = $('.add-row'),
    
        columnGroup = $('.columns'),
        rowGroup = $('.rows'),
            
        previewTable = $('#preview-table'),
        previewTableHead = previewTable.children('thead'),
        previewTableBody = previewTable.children('tbody');
    
    var tableJSON = [],
        JSONoutput;
    var columnJson = [];
    var rowJson = [];
    var columnParent = { 'Columns': columnJson };
    var rowParent = { 'Rows': rowJson };
    


    /***** ADD COLUMN *****/
    
    builderWrap.on('click', '.add-col', function(e) {

        var columnControl = $('.column'),
            rowControl = $('.row');
        
        var colCount = columnControl.length + 1,
            rowCount = rowControl.length;
        
        var column = '<div class="column" id="col' + colCount + '">' +
                    '<input type="text" data-col="' + colCount + '" placeholder="Column ' + colCount + '" /></div>';
        
        $('.columns').append(column);
        
        var columnJsonItem = { 'column': colCount };
        
        columnJson.push(columnJsonItem)

        
        $('#preview-table thead tr').append('<th data-col="' + colCount + '"></th>');

        $('#preview-table tbody tr:not(.full-row)').each(function() {
            var $this = $(this),
                spot = $this.index() + 1;
            
            $this.append('<td data-col="' + colCount + '" data-row="' + spot + '"><div class="cell-content"></div></td>');
        });

        $('#preview-table tbody tr.full-row').each(function() {
            $(this).find('td').attr('colspan', colCount);
        });
        
        rowControl.each(function() {
            var $this = $(this),
                rowid = $this.attr('id').replace('row', '');

            if(!$this.hasClass('full-row')){
                $this.find('.row-cells').append('<div class="cell"' + ' data-col="' + colCount + '" data-row="' + rowid + '">' +
                            '<input type="text" class="field-edit"' +
                            'data-col="' + colCount + '" data-row="' + rowid + '" placeholder="" />' + 
                            //'<div><a href="#" class="merge-down">Merge Down</a></div>' +
                            '</div>');
            }
        });
    }); 
    
        
    /***** ADD ROW *****/
    
    builderWrap.on('click', '.add-row', function(e) {
        var columnControl = $('.column'),
            rowControl = $('.row');
        
        var rowCount = rowControl.length + 1;
        var row = '<div class="row" id="row' + rowCount + '">' +
                //'<p>Row ' + rowCount + '</p>' +
                //'<div><label><input type="checkbox" class="full" /> Full row</label></div>' +
                '<div class="row-cells"></div></div>';

        $('.rows').append(row);
        
        var rowJsonItem = { 'row': rowCount };
        
        rowJson.push(rowJsonItem)

        var tr = $('<tr data-row="' + rowCount + '"></tr>');
        var currowCount = columnControl.length;
        
        for(var i = 0; i < currowCount; i++) {
            var colnum = i + 1;
            var colName = $('.column input[data-col="' + colnum + '"]').val();
            var input = $('<div class="cell"' + ' data-col="' + colnum + '" data-row="' + rowCount + '">' +
                            '<input type="text" class="field-edit"' +
                            'data-col="' + colnum + '" data-row="' + rowCount + '" placeholder="' + colName + '" />' + 
                            //'<div><a href="#" class="merge-down">Merge Down</a></div>' +
                            '</div>');

            $('#row' + rowCount + ' .row-cells').append(input);

            tr.append('<td data-col="' + colnum + '" data-row="' + rowCount + '"><div class="cell-content"></div></td>');
        }
        
        $('#preview-table tbody').append(tr);
    });
    
    
    $('.save').on('click', function(){
        tableJSON.push(columnParent, rowParent);
        var JSONoutput = JSON.stringify(tableJSON);
        $('.json-output').html(JSONoutput);
    });

    $('.show-instructions').on('click', function(e) {
        $('.instructions').toggle();
    });
});