  $(document).ready(function(){
            
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
            
            addColBtn.on('click', function(e) {
              var columnControl = $('.column'),
                  rowControl = $('.row');
              
              var colCount = columnControl.length + 1,
                  rowCount = rowControl.length;
              
              var column = '<div class="column" id="col' + colCount + '">' +
                           '<p>Column ' + colCount + '</p>' +
                           '<input type="text" data-col="' + colCount + '" /></div>';
              
              columnGroup.append(column);
              
              var columnJsonItem = { 'column': colCount };
                
              columnJson.push(columnJsonItem)

              
              $('#preview-table thead tr').append('<th data-col="' + colCount + '">Column ' + colCount + '</th>');

              $('#preview-table tbody tr:not(.full-row)').each(function() {
                var $this = $(this),
                    spot = $this.index() + 1;
                
                $this.append('<td data-col="' + colCount + '" data-row="' + spot + '">Col ' + colCount + ' - Row ' + spot + '</td>');
              });

              $('#preview-table tbody tr.full-row').each(function() {
                  $(this).find('td').attr('colspan', colCount);
              });
              
              rowControl.each(function() {
                var $this = $(this),
                    rowid = $this.attr('id').replace('row', '');

                if(!$this.hasClass('full-row')){
                  $this.find('.row-cells').append('<div class="cell"' + ' data-col="' + colCount + '" data-row="' + rowid + '">' +
                                '<input type="text" disabled class="field-edit"' +
                                'data-col="' + colCount + '" data-row="' + rowid + '" placeholder="" />' + 
                                //'<div><a href="#" class="merge-down">Merge Down</a></div>' +
                                '</div>');
                }
              });
            }); 
            
             
            /***** ADD ROW *****/
            
            addRowBtn.on('click', function(e) {
              var columnControl = $('.column'),
                  rowControl = $('.row');
              
              var rowCount = rowControl.length + 1;
              var row = '<div class="row" id="row' + rowCount + '">' +
                        //'<p>Row ' + rowCount + '</p>' +
                        //'<div><label><input type="checkbox" class="full" /> Full row</label></div>' +
                        '<div class="row-cells"></div></div>';

              rowGroup.append(row);
              
              var rowJsonItem = { 'row': rowCount };
                
              rowJson.push(rowJsonItem)

              var tr = $('<tr data-row="' + rowCount + '"></tr>');
              var currowCount = columnControl.length;
              
              for(var i = 0; i < currowCount; i++) {
                var colnum = i + 1;
                var colName = $('.column input[data-col="' + colnum + '"]').val();
                var input = $('<div class="cell"' + ' data-col="' + colnum + '" data-row="' + rowCount + '">' +
                              '<input type="text" disabled class="field-edit"' +
                              'data-col="' + colnum + '" data-row="' + rowCount + '" placeholder="' + colName + '" />' + 
                              //'<div><a href="#" class="merge-down">Merge Down</a></div>' +
                              '</div>');

                $('#row' + rowCount + ' .row-cells').append(input);

                tr.append('<td data-col="' + colnum + '" data-row="' + rowCount + '">Col ' + colnum + ' - Row ' + rowCount + '</td>');
              }
              
              previewTableBody.append(tr);
            });
            
            
            $('.save').on('click', function(){
                tableJSON.push(columnParent, rowParent);
                 var JSONoutput = JSON.stringify(tableJSON);
                $('.json-output').html(JSONoutput);
            });

            
            
            /***** UPDATING COLUMN TEXT *****/
            
            columnGroup.on('keyup', 'input', function() {
              var $this = $(this),
                  col = $this.data('col'),
                  text = $this.val();
              
              $('th[data-col="' + col + '"]').text(text);
              $('.row input[data-col="' + col + '"]').attr('placeholder', text)
            });
            


            /***** UPDATING CELL TEXT *****/

            rowGroup.on('keyup', '.field-edit', function() {
              var $this = $(this),
                  row = $this.data('row'),
                  col = $this.data('col'),
                  val = $this.val();
              
              $('td[data-col="' + col + '"][data-row="' + row +'"]').text(val);
            });

            rowGroup.on('dblclick', '.cell', function() {
              $(this).find('input').removeAttr('disabled');
              $(this).find('input').focus();
            });



            /***** MAKE FULL ROW *****/

            rowGroup.on('change', '.full', function() {
              var $this = $(this),
                  parentRow = $this.closest('.row'),
                  rowID = parentRow.attr('id').replace('row', ''),
                  colLength = $('.column').length,
                  addedRow = $('tr[data-row="' + rowID + '"]');

              if($this.is(':checked')){
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
            
            rowGroup.on('click', '.merge-down', function(e) {
              e.preventDefault();

              var $this = $(this),
                  cellInput = $this.parent().prev(),
                  thisRow = $this.closest('.row'),
                  nextRow = thisRow.next('.row');

              var colNum = cellInput.data('col'),
                  rowNum = cellInput.data('row'),
                  rowNumNext = cellInput.data('row') + 1;

              var nextRowCol = nextRow.find('input[data-col="' + colNum + '"]');

              $('tr[data-row="' + rowNum + '"]').next().find('td[data-col="' + colNum + '"][data-row="' + rowNumNext + '"]').hide();

              var nextMerged = $('td[data-col="' + colNum + '"][data-row="' + rowNumNext + '"]').attr('rowspan');
              var mergedNum = Number(nextMerged) + 1;

              if($this.attr('rowspan')){
                  $('td[data-col="' + colNum + '"][data-row="' + rowNum + '"]').attr('rowspan', mergedNum);
              } else {
                  $('td[data-col="' + colNum + '"][data-row="' + rowNum + '"]').attr('rowspan', '2');
              }


              thisRow.find('label').hide();
              nextRow.find('label').hide();

              nextRowCol.attr('disabled', 'disabled');
              //nextRowCol.next().hide();

              if(nextRow.length > 0) {
                $this.hide();
              } 
            });



            /***** RIGHT CLICK FUNCTIONALITY *****/

            var isMouseDown = false,
                initialColPos, initialRowPos;
//
            $('.rows').on('mousedown', '.cell', function () {
              switch (event.which) {
                  case 1:
                    $('.highlight-focus').removeClass('highlight-focus');
                    $('.highlighted').removeClass("highlighted");
                    $('.highlightable').removeClass('highlightable')
                    if(event.shiftKey) {
                        isMouseDown = true;
                        $(this).addClass("highlighted");
                    }
                    return false; 
                    break;
                  case 2:
                      break;
                  case 3:
                      break;
                  default:
              }
            }).on('mouseover', '.cell', function () {
              if (isMouseDown = true && event.shiftKey) {
                    if($('.highlighted').length === 1){
                        console.log('1 hightlighted')
                        $(this).addClass("highlighted");
                        initialColPos = $(this).data('col');
                        initialRowPos = $(this).data('row');

                        console.log(initialColPos);
                        console.log(initialRowPos);
                    } else if ($('.highlighted').length === 2) {
                        $(this).addClass("highlighted");
                        if($(this).data('col') === initialColPos) {
                            $('.cell[data-col="' + initialColPos + '"]').addClass('highlightable');
                            $('#previewTable').addClass('merge-col')
                        } else if($(this).data('row') === initialRowPos){
                            $('.cell[data-row="' + initialRowPos + '"]').addClass('highlightable');
                            $('#previewTable').addClass('merge-row')
                        } else {
                        }
                        console.log('more highlighted')
                    } else if ($('.highlighted').length > 2){
                        if($(this).hasClass('highlightable')){
                            $(this).addClass('highlighted')
                        }
                    } else {
                        console.log('whoops')
                    }
              }
            }).on('mouseup', function () {
              isMouseDown = false;
            });
//
            $(document).on('mousedown', function(){
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
//
            });

            function mergeCol(){

            }

            $('.table-builder').on('contextmenu', '.highlighted', function(e){
              e.preventDefault();

              $('.table-builder').addClass('highlight-focus');
              $('.controls').show();
            });

            $('.merge-group').on('click', function(e){
              var highlighted = $(this),
                  first = highlighted.first(),
                  firstRow = first.data('row'),
                  firstCol = first.data('col'),
                  highlightedItems = $('.highlighted'),
                  allHighlights = $('.highlighted').length;


              var first_iteration = true;
              console.log(allHighlights);

              highlightedItems.each(function(){
                var thisRow = $(this).data('row'),
                    thisCol = $(this).data('col'),
                    allCols = [],
                    allRows = []

                if (first_iteration == true) {
                    $('td[data-row="' + thisRow + '"][data-col="' + thisCol + '"]').addClass('highlighted').attr('rowspan', allHighlights);

                    allCols.push(thisCol);
                    allRows.push(thisRow);
                    first_iteration = false;
                } else {
                  $('td[data-row="' + thisRow + '"][data-col="' + thisCol + '"]').addClass('highlighted').hide();
                    allCols.push(thisCol);
                    allRows.push(thisRow);
                } 

                console.log(allCols)
                console.log(allRows)
              });
            });

          });