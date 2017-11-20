// following code cribbed from chrome://browser/content/pageInfo.js

//******** define a js object to implement nsITreeView
function pageInfoTreeView(columnids, copycol)
{
  // columnids is an array of strings indicating the names of the columns, in order
  this.columnids = columnids;
  this.colcount = columnids.length

  // copycol is the index number for the column that we want to add to 
  // the copy-n-paste buffer when the user hits accel-c
  this.copycol = copycol;
  this.rows = 0;
  this.tree = null;
  this.data = new Array;
  this.selection = null;
  this.sortcol = null;
  this.sortdir = 0;
}

pageInfoTreeView.prototype = {
  set rowCount(c) { throw "rowCount is a readonly property"; },
  get rowCount() { return this.rows; },

  setTree: function(tree) 
  {
    this.tree = tree;
  },

  getCellText: function(row, column)
  {
    // row can be null, but js arrays are 0-indexed.
    // colidx cannot be null, but can be larger than the number
    // of columns in the array (when column is a string not in 
    // this.columnids.) In this case it's the fault of
    // whoever typoed while calling this function.
    return this.data[row][column.index] || "";
  },

  setCellValue: function(row, column, value) 
  {
  },

  setCellText: function(row, column, value) 
  {
    this.data[row][column.index] = value;
  },

  addRow: function(row)
  {
    this.rows = this.data.push(row);
    this.rowCountChanged(this.rows - 1, 1);
  },

  addRows: function(rows)
  {
    var length = rows.length;
    for(var i = 0; i < length; i++)
      this.rows = this.data.push(rows[i]);
    this.rowCountChanged(this.rows - length, length);
  },

  rowCountChanged: function(index, count)
  {
    this.tree.rowCountChanged(index, count);
  },

  invalidate: function()
  {
    this.tree.invalidate();
  },

  clear: function()
  {
    this.data = new Array;
    this.rows = 0;
  },

  handleCopy: function(row)
  {
    return (row < 0 || this.copycol < 0) ? "" : (this.data[row][this.copycol] || "");
  },

  performActionOnRow: function(action, row)
  {
    if (action == "copy")
    {
      var data = this.handleCopy(row)
      this.tree.treeBody.parentNode.setAttribute("copybuffer", data);
    }
  },

  getRowProperties: function(row, prop) { },
  getCellProperties: function(row, column, prop) { },
  getColumnProperties: function(column, prop) { },
  isContainer: function(index) { return false; },
  isContainerOpen: function(index) { return false; },
  isSeparator: function(index) { return false; },
  isSorted: function() { },
  canDrop: function(index, orientation) { return false; },
  drop: function(row, orientation) { return false; },
  getParentIndex: function(index) { return 0; },
  hasNextSibling: function(index, after) { return false; },
  getLevel: function(index) { return 0; },
  getImageSrc: function(row, column) { },
  getProgressMode: function(row, column) { },
  getCellValue: function(row, column) { },
  toggleOpenState: function(index) { },
  cycleHeader: function(col) { },
  selectionChanged: function() { },
  cycleCell: function(row, column) { },
  isEditable: function(row, column) { return false; },
  performAction: function(action) { },
  performActionOnCell: function(action, row, column) { }
};


function doCopy(event)
{
  if (!gClipboardHelper) 
    return;

  var elem = event.originalTarget;
  if (elem && "treeBoxObject" in elem)
    elem.treeBoxObject.view.performActionOnRow("copy", elem.currentIndex);

  var text = elem.getAttribute("copybuffer");
  if (text) 
    gClipboardHelper.copyString(text);
}


// clipboard helper
try
{
	const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
}
catch(e)
{
  // do nothing, later code will handle the error
}

// end of cribbed script