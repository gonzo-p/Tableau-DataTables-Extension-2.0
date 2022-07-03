'use strict';

(function () {
  // Updated .ready() deprecated
  $(function () {
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      worksheet.getUnderlyingTablesAsync().then(function(t) {
        table = t;
        const logicalTableId = t[0].id;
        
        worksheet.getUnderlyingTableDataAsync(logicalTableId).then(function(underlying) {
          var worksheetColumns = underlying.columns;
          const worksheetData = underlying.data;
          console.log(worksheetColumns);
          //console.log(worksheetData);

          var tableData = makeArray(underlying.columns.length,underlying.totalRowCount);
          for (var i = 0; i < tableData.length; i++) {
            for (var j = 0; j < tableData[i].length; j++) {
              // you can get the value or formatted value
              // https://tableau.github.io/extensions-api/docs/interfaces/datavalue.html
              tableData[i][j] = worksheetData[i][j].formattedValue;
            }
          }
          console.log(tableData);
                
        });
      });
    });
  });

  function makeArray(d1, d2) {
    var arr = new Array(d2), i, l;
    for(i = 0, l = d2; i < l; i++) {
        arr[i] = new Array(d1);
    }
    return arr;
  }

})();