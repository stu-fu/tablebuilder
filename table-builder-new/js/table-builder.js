$(function(){


    // ** CONSTANTS ** //

    var builderWrap = $('.table-builder-wrap'),
        tablePrompt = $('<div class="table-prompt"></div>'),
        tablePathStepOne = $('<div class="table-path step-one"></div>'),
        tablePathStepTwo = $('<div class="table-path step-two"></div>');

    var drake = dragula({
        isContainer: function (el) {
            return false; // only elements in drake.containers will be taken into account
        },
        direction: 'vertical' 
    });


    // ** ADD COLUMN ** //

    function addColumn() {
        var rowControl = builderWrap.find('.row');

        var colCount = $('.column').length + 1,
            rowCount = rowControl.length;

        var column = '<th class="column" id="col' + colCount + '"><input type="text" data-col="' + colCount + '" placeholder="Column ' + colCount + '" /></th>';

        $('.columns').append(column);

        rowControl.each(function () {
            var $this = $(this),
                rowid = $this.attr('id').replace('row', '');

            $this.append('<td class="cell" data-col="' + colCount + '" data-row="' + rowid + '"><div class="cell-content"></div><textarea></textarea></td>');
        });
    }


    // ** ADD ROW ** //

    function addRow() {
        var columnControl = $('.column');

        var rowCount = $('.row').length + 1;

        var row = '<tr class="row" id="row' + rowCount + '" data-tree="1" data-group="row' + rowCount + '"></tr>';

        $('.rows').append(row);

        var currowCount = columnControl.length;

        drake.containers.push(document.querySelector('#rows'));

        $('#row' + rowCount).append('<td class="number-set"><input type="number" value="1" min="1" max="8" /></td>');
        for (var i = 0; i < currowCount; i++) {
            var colnum = i + 1;
            var colName = $('.column input[data-col="' + colnum + '"]').val();
            var input = $('<td class="cell"' + ' data-col="' + colnum + '" data-row="' + rowCount + '"><div class="cell-content"></div><textarea></textarea></td>');
            
            $('#row' + rowCount).append(input);
        }
    }


    // ** TABLE WIZARD ** //

    function tableWizard() {
        $('.steptwo').addClass('active');
        $('.table-step h1').text("Set table properties");

        var tableWizard = $('<div class="table-wizard"></div>');
        var tableProperties = '<div class="table-properties"><h2>Table Properties</h2><ul>' +
                                    '<li><input type="checkbox" id="has-row-headers" checked /> <label id="has-row-headers">Row Headers</label></li>' +
                                    '<li><input type="checkbox" id="has-col-headers" checked /> <label for="has-col-headers">Column Headers</label></li>' +
                                    '<li><input type="number" min="1" value="1" id="starting-cols" /> <label for="starting-cols">Starting Columns</li>' +
                                    '<li><input type="number" min="1" value="1" id="staring-rows" /> <label for="starting-rows">Starting Rows</li></ul></div>' +
                              '</ul></div>';

        tableWizard.append('<h2>Table Title</h2><input class="table-title" type="text" />' +
                           '<h2>Table Summary</h2><input class="table-summary" type="text" />' +
                           tableProperties +
                           '<button class="button start-table"><svg class="icon icon-arrow-right2"><use xlink:href="#icon-arrow-right2"></use></svg> Generate Table</button>');

        builderWrap.append(tableWizard);

        $('.start-table').on('click', function(){
            var tableTitle = $('.table-title').val();
            var colNums = Number($('#starting-cols').val()) + 1;
            var rowNums = Number($('#staring-rows').val()) + 1;

            builderWrap.empty();

            tableBuild({title: tableTitle, columnNumbers: colNums, rowNumbers: rowNums});
        });
    }


    // ** TABLE BUILD ** //

    function tableBuild(opt) {

        var defaults = {
            title: '',
            columnNumbers: 1,
            rowNumbers: 1
        };

        var options = $.extend(defaults, opt);

        $('.stepthree').addClass('active');
        $('.table-step h1').text("Create table");

        var tableBuilder = $('<div class="table-builder"></div>');
        var rows = $('.rows');
        var columns = $('.columns');


        var tableControls = '<div class="main-controls"><h2>Table Controls</h2>' + 
                                '<button class="add-col button"><svg class="icon icon-arrow-right2"><use xlink:href="#icon-arrow-right2"></use></svg> Add Column</button>' + 
                                '<button class="add-row button"><svg class="icon icon-arrow-down2"><use xlink:href="#icon-arrow-down2"></use></svg> Add Row</button>' + 
                            '</div>';

        var customControls = '<div class="custom-controls">' +
                                '<div class="column-controls"><h2>Columns</h2><button class="button merge-group">Merge Column Cells</button></div>' +
                                '<div class="row-controls"><h2>Rows</h2><button class="button merge-across">Merge Row Cells</button></div>' +
                                '<div class="cell-controls"><h2>Cell Controls</h2><button class="button footnote-to-cell"><svg class="icon icon-pushpin"><use xlink:href="#icon-pushpin"></use></svg><span class="name"> icon-pushpin</span> Add Footnote to Cell</button><div class="footnote-group"><ol></ol></div></div>' +
                             '</div>'

        /***** Create Table Builder *****/

        tableBuilder.append('<div class="table-controls">' + tableControls + customControls + '</div>' +
                            '<div class="table-construct">' + 
                                '<div class="title-edit"><input class="table-title" type="text" placeholder="Table Title" /></div>' + 
                                '<table cellspacing="0" cellpadding="0"><thead><tr class="columns"></tr></thead><tbody id="rows" class="rows"></tbody></table>' +
                            '</div>' + 
                            '<button class="add-footnotes button"><svg class="icon icon-pushpin"><use xlink:href="#icon-pushpin"></use></svg><span class="name"> icon-pushpin</span> Add Footnotes</button>' + 
                            '<div class="footnote-list"></div>' + 
                            '<br /><br /><button class="save button"><svg class="icon icon-floppy-disk"><use xlink:href="#icon-floppy-disk"></use></svg><span class="name"> icon-floppy-disk</span> Save</button>');
          
        builderWrap.append(tableBuilder);


        

        /***** CREATE CUSTOM ITEMS FROM WIZARD *****/

        $('.table-title').val(options.title).attr('disabled', 'disabled');
        $('.columns').append('<th style="background:transparent"></th>');
        for (var i = 1; i < options.columnNumbers; i++) { addColumn(i); console.log('column') }
        for (var i = 1; i < options.rowNumbers; i++) { addRow(i); console.log('row') }


        builderWrap.on('change', '.number-set input', function(){
            var $this = $(this),
                val = $this.val(),
                tr = $this.closest('tr'),
                prevTr = tr.prev(),
                topRow = tr.prevUntil('tr[data-tree="1"]'),
                topGroup = topRow.data('group'),
                prevTrTree = prevTr.data('tree'),
                prevTrId = prevTr.data('group');

            tr.attr('data-tree', val);

            if (Number(prevTrTree) < Number(val) && Number(prevTrTree) != 1) {
                console.log('previous is less than this but not 1');
                console.log(topGroup);
                tr.attr('data-group', topGroup);
            } else if (Number(prevTrTree) == 1) {
                console.log('previous is 1');
                tr.attr('data-group', prevTrId);
            } else {
                console.log('something else');
            }
        });

        /***** FOOTNOTES *****/

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


        /***** SHOW FOOTNOTES TO ADD *****/
        
        $('.table-builder').on('click', '.footnote-to-cell', function(){
            $('.footnote-group').show();
        });


        /***** ADD FOOTNOTE TO CELL *****/

        $('.table-builder').on('click', '.add-footnote-to-cell', function() {
            var $this = $(this),
                currentHighlight = $('.cur-highlight'),
                text = $this.prev().text(),
                pos = $this.parent().index() + 1,
                thisrowNum = currentHighlight.data('row'),
                thiscolNum = currentHighlight.data('col'),
                matchingTD = $('td[data-col="' + thiscolNum + '"][data-row="' + thisrowNum + '"]');

            currentHighlight.append('<div class="footnote-number">' + pos + '</div>');
            matchingTD.append('<div class="footnote-number">' + pos + '</div>')
                      .append('<div class="footnote-content">' + text + '</div>');
        });

        function removeAllRanges() {
            var range = window.getSelection().getRangeAt(0);
            var node = $(range.commonAncestorContainer)
            var nodeChild = node.find('strong');
            if (node.parent().is('strong')) {
                node.unwrap();
            }
        }

        function surroundSelection() {
            var span = document.createElement("strong");

            if (window.getSelection) {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var range = sel.getRangeAt(0).cloneRange();
                    range.surroundContents(span);
                    removeAllRanges();
                    sel.addRange(range);
                }
            }
        }

        /***** RIGHT CLICK FUNCTIONALITY *****/

        var isMouseDown = false,
            initialColPos, initialRowPos;


        $('.boldtext').on('click', function () {
            surroundSelection();
        });

        $('.removeboldtext').on('click', function () {
            removeAllRanges();
        });

        $('.rows').on('mousedown', '.cell', function () {
            var $this = $(this);

            $('.highlight-focus').removeClass('highlight-focus');
            $('.highlighted').removeClass("highlighted");
            $('.highlightable').removeClass('highlightable');
            $('.merge-row').removeClass('merge-row');
            $('.hidden').removeClass('hidden');
            $('.cur-highlight').removeClass('cur-highlight');
            $('.cell-controls').hide();
            $('.column-controls').hide();
            $('.row-controls').hide();

            if (!$this.is(':focus')) {
                $this.attr('contenteditable', 'true');
                $this.focus();
            }

            switch (event.which) {
                case 1:

                    //$('.cell-content').blur().attr('contenteditable', 'false');

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
                    break;
                case 2:
                    break;
                case 3:
                    $this.addClass('cur-highlight');
                    $this.addClass("highlighted");
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
                    //$('.cell-content').blur().attr('contenteditable', 'false');
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



    /***** BUTTON CLICKS *****/
    
    // Add Col
    builderWrap.on('click', '.add-col', function(e) {
        addColumn();
    }); 
        
    // Add Row
    builderWrap.on('click', '.add-row', function(e) {
        addRow();
    });
    
    // Save Table
    $('.save').on('click', function(){
        tableJSON.push(columnParent, rowParent);
        var JSONoutput = JSON.stringify(tableJSON);
        $('.json-output').html(JSONoutput);
    });

    // Show instructions
    $('.show-instructions').on('click', function(e) {
        $('.instructions').toggle();
    });
});