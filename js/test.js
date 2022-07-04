'use strict';

$(function () {
  // Need to initialize the tableau extension with a call to initializeAsync
  tableau.extensions.initializeAsync().then(function () {
    // Calls a function to show the table.
    renderDataTable();
    
  }, function (err) { 
    // Something went wrong in initialization.
    console.log('Error while Initializing: ' + err.toString());
  });
});

function renderDataTable() {
  var title_column_names = [];
  var columnName = [];
  var table;

  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  var worksheet = worksheets.find(function (sheet) {
    return sheet.name;
  });
  
  worksheet.getUnderlyingTablesAsync().then(function(t) {
    table = t;
    const logicalTableId = t[0].id;
    
    worksheet.getUnderlyingTableDataAsync(logicalTableId).then(function(underlying) {
      const worksheetData = underlying.data;
      var worksheetColumns = underlying.columns;
      
      for (var i = 0; i < worksheetColumns.length; i++ ) {
        title_column_names.push({ title: worksheetColumns[i].fieldName });
        columnName.push(worksheetColumns[i].fieldName);
      }
      
      // Put the underlying data into a multidimensional array
      var tableData = makeArray(underlying.columns.length,underlying.totalRowCount);
      for (var i = 0; i < tableData.length; i++) {
        for (var j = 0; j < tableData[i].length; j++) {
          tableData[i][j] = worksheetData[i][j].formattedValue;
        }
      }
      
      // Add search boxes in each column
      $('#example tfoot th').each(function () {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
      })
      
      /*
      var $tfoot = $("#example tfoot tr");
      for (var i = 0, len = title_column_names.length; i < len ; i++){
        $tfoot.append("<th>");
      }
      */
      // Create the data table
      $('#example').DataTable({
        dom: 'Bfrtip',
        data: tableData,
        lengthMenu: [
          [ 10, 25, 50, -1 ],
          [ '10 rows', '25 rows', '50 rows', 'Show All' ]
        ],
        columns: title_column_names,
        buttons: [
          'copy',
          'csv',
          'excel',
          'pdf',
          'print',
          'searchBuilder',
          'pageLength'
        ],
        // Add logic to the search boxes to enable regex search
        initComplete: function () {
          // Apply the search
          this.api()
          .columns()
          .every(function () {
            var that = this;
   
            $('input', this.footer()).on('keyup change clear', function () {
              if (that.search() !== this.value) {
                that.search($(this).val(),$(this)).draw();
              }
            });
          });
        }
      });

    });
    
  });
  
}

function makeArray(d1, d2) {
  var arr = new Array(d2), i, l;
  for(i = 0, l = d2; i < l; i++) {
      arr[i] = new Array(d1);
  }
  return arr;
}