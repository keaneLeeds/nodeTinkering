var focusedText;    // Textbox with focus
var keyArray;       // Array for values of keys
var selectedRange;  // Used for text changes at cursor position
var capClicked;
var shiftClicked;
var LOWER_CASE;
var UPPER_CASE;
var KEY_PRESSED;
var KEY_RELEASED;
var KEY_HEIGHT;
var KEY_SPACEBAR_SPAN;
var startPos;
var endPos;
var keysUS;
var keysDvorak;
var keysList;
var keyIntervalID;
var KEY_INTERVAL;
var currentKey;
var labelText;
var tabIndex;
var tabArray;
var browserName;
var IE;

function buildKeyboard(tblId, objName)
{
  // get element by ID
  var obj = document.getElementById(objName);
  
  initVals(obj);
  var mainTable = document.getElementById(tblId);
  var mainBody = document.createElement("tbody");

  // Random down shift
  var randomVertShift = document.createElement("tr");
  var randomVertCell = document.createElement("td");
  var randomVertVal = Math.floor(Math.random()*9);
  randomVertCell.style.height = randomVertVal;
  randomVertShift.appendChild(randomVertCell);
  mainBody.appendChild(randomVertShift);

  // Random right shift
  var mainRow = document.createElement("tr");
  var randomHorCol = document.createElement("td");
  var randomHorVal = Math.floor(Math.random()*11);
  randomHorCol.style.paddingLeft = randomHorVal;
  mainRow.appendChild(randomHorCol);

  // Keyboard
  var keyCol = document.createElement("td");
  var keyTable = document.createElement("table");
  keyTable.id = "mainKeyTable";
  keyTable.style.borderTop = "2px outset";
  keyTable.style.borderBottom = "2px outset #9f9f9f";
  keyTable.style.borderRight = "2px outset #999999";
  keyTable.style.borderTop = "2px solid #AAAAAA";
  keyTable.style.borderLeft = "2px solid #AAAAAA";
  keyTable.style.backgroundColor = "#bbbbbb";
  keyTable.style.textAlign = "center";
  createUtilRow(keyTable);
  createKeyboard(keyTable);
  
  // Append elements
  keyCol.appendChild(keyTable);
  mainRow.appendChild(keyCol);
  mainBody.appendChild(mainRow);
  mainTable.appendChild(mainBody);
  createLabels(mainTable);
}

function initVals(obj)
{
  if (obj != null)
    focusedText = obj;

  capClicked = false;
  shiftClicked = false;
  UPPER_CASE = 1;
  LOWER_CASE = 0;
  KEY_PRESSED = "gray";
  KEY_RELEASED = "#f2f3f5";
  KEY_HEIGHT = "15";
  KEY_SPACEBAR_SPAN = "7";
  startPos = endPos = null;
  KEY_INTERVAL = 2000;
  tabIndex = 0;
  IE = "msie";

  keysUS = [ // US Standard Keyboard
	    [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
	    [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["[", "{"], ["]", "}"], ["\\", "|"]],
	    [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], [";", ":"], ["'", '"'], ["Enter", "Enter"]],
	    [["Shift", "Shift"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	    [[" ", " "]]
    ];

  keysDvorak = [ // Dvorak Keyboard
	        [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["[", "{"], ["]", "}"], ["Bksp", "Bksp"]],
	        [["Tab", "Tab"],["'", '"'], [",", "<"], [".", ">"], ["p", "P"], ["y", "Y"], ["f", "F"], ["g", "G"], ["c", "C"], ["r", "R"], ["l", "L"], ["/", "?"], ["=", "+"], ["\\", "|"]],
	        [["Caps", "Caps"], ["a", "A"], ["o", "O"], ["e", "E"], ["u", "U"], ["i", "I"], ["d", "D"], ["h", "H"], ["t", "T"], ["n", "N"], ["s", "S"], ["-", "_"], ["Enter", "Enter"]],
	        [["Shift", "Shift"], [";", ":"], ["q", "Q"], ["j", "J"], ["k", "K"], ["x", "X"], ["b", "B"], ["m", "M"], ["w", "W"], ["v", "V"], ["z", "Z"], ["Shift", "Shift"]],
	        [[" ", " "]]
    ];
  keysList = ["US", "Dvorak"];
  resetKeyArray("US");
  
  // Remove the label for now
  // labelText = "The virtual keyboard can be used in conjunction with your keyboard.  The value of the key will be entered by clicking on a key or when the cursor is over the key for 2 seconds.";
  labelText = "";
  
  getBrowser();
}

function getBrowser()
{
  var ua = navigator.userAgent.toLowerCase();
  if ( ua.indexOf( "opera" ) != -1 )
  {
    browserName = "opera";
  }
  else if ( ua.indexOf( "msie" ) != -1 )
  {
    browserName = "msie";
  }
  else if ( ua.indexOf( "safari" ) != -1 )
  {
    browserName = "safari";
  }
  else if ( ua.indexOf( "mozilla" ) != -1 )
  {
    if ( ua.indexOf( "firefox" ) != -1 )
    {
      browserName = "firefox";
    }
    else
    {
      browserName = "mozilla";
    }
  }
}

function configElement(elName)
{
  var index = -1;
  
  // Use standard to avoid error in FireFox 
  // var tempSize = document.all.length;
  var elementCollection = document.getElementsByTagName("*");
  var tempSize = elementCollection.length;
  
  for (var itemp=0; itemp<tempSize; itemp++)
  {
    // var element = document.all[itemp];
    //if (element.name == elName)
   
    var element = elementCollection[itemp];

	// check element ID first; if null, use name
    var tmpName = element.id;
    if (tmpName == null) {
    	tmpName = element.name;
    }
    
    if (tmpName != null && tmpName == elName)
    {
      index = itemp;
      // init onclick and onkeyup functions
      if ((element.type == "text") || (element.type == "password"))
      {
        initInput(element);
      }
      break;
    }
  }
  return index;
}

function initInput(inputElement)
{
  // set id only if it's not provided
  if (inputElement.id == null) {
  		inputElement.id = inputElement.name;
  }
  inputElement.onclick = (function(a) { return function() {setCursor(a); };})(inputElement);
  inputElement.onkeyup = (function(a) { return function() {setCursor(a); };})(inputElement);
}

function getTabElementIndex(elName)
{
  var index = -1;  
  for (var ind=0; ind<tabArray.length; ind++)
  {
    var elementName = tabArray[ind][1];    
    if (elementName == elName)
    {
      index = ind;
    }
  }
  return index;
}

function configVkElements(indexArr)
{
  tabArray = new Array();
  var arrCounter = 0;  
  for (var ind=0; ind<indexArr.length; ind++)
  {
    var elementName = indexArr[ind];    
    var elementIndex = configElement(elementName);
    if (elementIndex != -1)
    {
      tabArray[arrCounter] = new Array();
      tabArray[arrCounter][0] = elementIndex;
      tabArray[arrCounter][1] = elementName;
      arrCounter++;
    }
  }
}

function createUtilRow(keyTable)
{
  // Header Row
  var headerBody = document.createElement("tbody");
  headerBody.id = "headerBody";
  headerBody.style.textAlign = "right";
  {
    var headerRow = document.createElement("tr");
    {
      var headerCell = document.createElement("td");
      {
        var headerTable = document.createElement("table");
        {
          var utilBody = document.createElement("tbody");
          {
            var utilRow = document.createElement("tr");
            {
              /*
                // Empty Cell
                var emptyCell = document.createElement("td");
                emptyCell.id = "emptyCell";
                utilRow.appendChild(emptyCell);
              */

              var selectCell = document.createElement("th");
              createKeyboardSelect(selectCell);
              utilRow.appendChild(selectCell);

              // Clear Cell
              var clearCell = document.createElement("td");
              clearCell.id = "clearCell";
              clearCell.style.padding = "1px 4px";
              clearCell.style.font = "bold 11px Arial, sans-serif";
              clearCell.style.border = "1px outset #aaaaaa";
              clearCell.style.backgroundColor = "#cccccc";
              clearCell.style.cursor = "pointer";
              {
                var clearKey = document.createTextNode("Clear");
                clearCell.onclick =  (function(a) { return function() {keyClicked(a); };})(clearKey);
                clearCell.onselectstart = function() { return false; };
              }
              clearCell.appendChild(clearKey);
              utilRow.appendChild(clearCell);

            }
          }
          utilBody.appendChild(utilRow);
        }
      }
      headerTable.appendChild(utilBody);
      headerCell.appendChild(headerTable);
      headerRow.appendChild(headerCell);
    }
  }
  headerBody.appendChild(headerRow);
  keyTable.appendChild(headerBody);
}

function createKeyboardSelect(selectCell)
{
	var keyboardSelect = document.createElement("select");
	var keyListLen = keysList.length;
	for (var i=0; i<keyListLen; i++)
	{
	  var keyOpt = document.createElement("option");
	  var keyLayoutName = keysList[i];
	  keyOpt.appendChild(document.createTextNode(keyLayoutName));
	  keyOpt.value = keyLayoutName;
	  keyboardSelect.appendChild(keyOpt);
	}
	keyboardSelect.onchange = function()
	{
	  resetKeyArray(keyboardSelect.value);
	  changeKeyboard();
	};
	keyboardSelect.id = "KeyboardSelect";
	keyboardSelect.style.font = "normal 11px Verdana, Geneva, Arial, Helvetica, sans-serif";
	keyboardSelect.style.color = "#000000";
	selectCell.appendChild(keyboardSelect);
}

function createKeyboard(keyTable)
{
  var rowCnt = keyArray.length;
  for(var i=0;i<rowCnt;i++)
  {
    var innerTbody = document.createElement("tbody");
    var innerRow = document.createElement("tr");
    var innerCol = document.createElement("td");
    var innerTable = document.createElement("table");
    innerTable.id="keyTables";
    innerTable.cellSpacing = innerTable.cellPadding = innerTable.border = "0";
    var tableBody = document.createElement("tbody");
    var keyRow = document.createElement("tr");
    var keys = keyArray[i];
    var colCnt = keys.length;
    for (var j=0;j<colCnt;j++)
    {
      var keyCell = document.createElement("td");
      var key = document.createTextNode(keys[j][0]);
      keyCell.appendChild(key);
      keyCell.style.borderTop = "1px solid #cccccc";
      keyCell.style.borderRight = "2px outset #cccccc";
      keyCell.style.borderBottom = "2px outset #cccccc";
      keyCell.style.borderLeft = "1px solid #cccccc";
      keyCell.style.width = "100%";
      keyCell.style.backgroundColor = "#f2f3f5";
      keyCell.style.cursor = "default";
      keyCell.style.whiteSpace = "pre";
      keyCell.style.padding = "2px 5px 1px 5px";
      keyCell.style.font = "normal 11px 'Lucida Sans Typewriter', 'Lucida Console', monospace";
      keyCell.style.textAlign = "center";
      if (key.nodeValue == " ")
	setupSpace(keyCell);
      keyCell.onclick =  (function(a) { return function() {keyClicked(a); };})(key);
      if (browserName == IE)
      {
        keyCell.ondblclick = (function(a) { return function() {keyClicked(a); };})(key);
      }

      keyCell.onmouseover = (function(a) { return function() {keyMouseOver(a); };})(keyCell);
      keyCell.onmouseout = (function(a) { return function() {keyMouseOut(a); };})(keyCell);
      keyCell.onselectstart= function() { return false; };
      keyRow.appendChild(keyCell);
    }

    tableBody.appendChild(keyRow);
    innerTable.appendChild(tableBody);
    innerCol.appendChild(innerTable);
    innerRow.appendChild(innerCol);
    innerTbody.appendChild(innerRow);
    keyTable.appendChild(innerTbody);
  }
}

function keyClicked(key)
{
  if (focusedText == null)
    return;
    
  var textVal = focusedText.value;
  var keyVal = key.nodeValue;

  switch(keyVal)
  {
    case "Bksp":
      if (focusedText.value.length == 0)
        break;

      if ((startPos != null) || (endPos != null))
      {
        focusedText.focus();
        var prevStartPos = startPos;
        focusedText.value = textVal.substr(0, startPos-1) + textVal.substr(endPos);
        startPos = endPos = prevStartPos - 1;
        focusedText.setSelectionRange(startPos, startPos);
      }
      else if (selectedRange != null)
      {
        if (selectedRange.text == "")
          selectedRange.moveStart('character', -1);
        else
          selectedRange.moveStart('character', 0);
        selectedRange.text = "";
        selectedRange.select();
      }
      else
      {
        focusedText.focus();
      	focusedText.value=textVal+keyVal;
        var textLen = textVal.length;
        focusedText.value = textVal.substr(0, textLen-1);
      }
      break;
    case "Tab":
      // FAFSA fix: Need to skip hidden fields
      do {
        if (shiftClicked)
        {
          tabIndex--;
          if (tabIndex < 0)
          {
            tabIndex = tabArray.length-1;
          }
        }
        else
        {
          tabIndex++;
          if (tabIndex >= tabArray.length)
            tabIndex = 0;          
        }
      
        var temp = tabArray[tabIndex][0];
      
        // Use standard to avoid error in FireFox 
        // document.all[temp].focus();
        // setCursor(document.all[temp])
        var elementCollection = document.getElementsByTagName("*");
      } while (!$(elementCollection[temp]).is(":visible"));      
      elementCollection[temp].focus(); 
      setCursor(elementCollection[temp]);
      
      break;
    case "Caps":
      capClicked = !capClicked;
      capChange();
      break;
    case "Shift":
      shiftClicked = !shiftClicked;
      shiftChange();
      break;
    case "Enter":
      virtualKeyboardEnter();
      break;
    case "Clear":
      virtualKeyboardClear();
      break;
    default:
      // FAFSA functionality - for now, the keyboard is only used on numeric fields
      if (keyVal.match(/^\d+$/) == null)
        return;

      if ((focusedText.type != "text") && (focusedText.type != "password"))
      {
        break;
      }
      if ((startPos != null) || (endPos != null))
      {
        // FAFSA fix: don't allow more characters than the maxlength
        if ((startPos == endPos) && (textVal.length >= $(focusedText).attr("maxlength"))) {
          break;
        }
        focusedText.focus();
        var prevStartPos = startPos;
        focusedText.value = textVal.substr(0, startPos) + keyVal + textVal.substr(endPos);
        startPos = endPos = prevStartPos + keyVal.length;
        focusedText.setSelectionRange(startPos, startPos);
      }
      else if (selectedRange != null)
      {
        selectedRange.moveStart('character', 0);
        selectedRange.text = keyVal;
        selectedRange.select();
      }
      else
      {
        // FAFSA fix: don't allow more characters than the maxlength
        if (textVal.length >= $(focusedText).attr("maxlength")) {
          break;
        }
      	focusedText.focus();
        focusedText.value=textVal+keyVal;
      }
      if (shiftClicked == true)
      {
        shiftClicked = false;
        shiftChange();
      }
      break;
  }
  if (keyIntervalID != null)
    clearTimeout(keyIntervalID);
}

function virtualKeyboardClear()
{
  focusedText.value = '';
}

function setupSpace(keyCell)
{
  keyCell.style.paddingLeft = keyCell.style.paddingRight = "55px";
  keyCell.height = KEY_HEIGHT;
}

function keyMouseOver(key)
{
  key.style.borderColor="#666666";
  key.style.backgroundColor="#fcfdff";
  key.style.color="#222222";
  currentKey = key;
  keyIntervalID = setTimeout( 'keyIntervalReached()', KEY_INTERVAL );
}

function keyIntervalReached()
{
  if (currentKey != null)
    keyClicked(currentKey.firstChild);
}

function keyMouseOut(key)
{
  key.style.borderColor="#cccccc";
  var keyValue = key.firstChild.nodeValue;
  switch(keyValue)
  {
    case "Caps":
      if (capClicked == true)
        key.style.backgroundColor = KEY_PRESSED;
      else
        key.style.backgroundColor = KEY_RELEASED;
      break;
    case "Shift":
      if (shiftClicked == true)
        key.style.backgroundColor = KEY_PRESSED;
      else
        key.style.backgroundColor = KEY_RELEASED;
      break;
    default:
      key.style.backgroundColor=KEY_RELEASED;
      break;
  }
  clearTimeout(keyIntervalID);
}

function setCursor(textbox)
{
  focusedText = textbox;
  if (focusedText.setSelectionRange)
  {
    startPos = focusedText.selectionStart;
    endPos = focusedText.selectionEnd;
  }
  else
  {
    selectedRange = document.selection.createRange();
    startPos = endPos = null;
  }
  
  // use the element id instead
  var tempIndex = getTabElementIndex(textbox.id); // getTabElementIndex(textbox.name);
  tabIndex = tempIndex;
}

function capChange()
{
  var arrElement;
  if (shiftClicked == true)
  {
    if (capClicked == true)	
      arrElement = LOWER_CASE;
    else
      arrElement = UPPER_CASE;
  }
  else
  {
    if (capClicked == true)
      arrElement = UPPER_CASE;
    else
      arrElement = LOWER_CASE;
  }
  var keyTable = document.getElementById('mainKeyTable');
  var tables = keyTable.getElementsByTagName('TABLE');
  var tableCnt = tables.length;
  for(var cnt=2; cnt<tableCnt; cnt++)
  {
    var rows = tables[cnt].getElementsByTagName('TR');
    var endRow = rows.length;
    for (var i=0; i<endRow; i++)
    {
      var cells = rows[i].getElementsByTagName('TD');
      var keys = keyArray[cnt-1];
      var endCell = cells.length;
      for (var j=0; j<endCell; j++)
      {
        if (cells[j].firstChild.nodeValue == "Caps")
        {
          if (capClicked == true)
            cells[j].style.background = KEY_PRESSED;
          else
            cells[j].style.background = KEY_RELEASED;
        }
        cells[j].firstChild.nodeValue = keys[j][arrElement];
      }
    }
  }
}

function shiftChange()
{
  var arrElement;
  if (capClicked == true)
  {
    if (shiftClicked == true)
    {
      arrElement = LOWER_CASE;
      numeric = UPPER_CASE;
    }
    else
    {
      arrElement = UPPER_CASE;
      numeric = LOWER_CASE;
    }
  }
  else
  {
    if (shiftClicked == true)
    {
      arrElement = UPPER_CASE;
      numeric = UPPER_CASE;
    }
    else
    {
      arrElement = LOWER_CASE;
      numeric = LOWER_CASE;
    }
  }

  var keyTable = document.getElementById('mainKeyTable');
  var tables = keyTable.getElementsByTagName('TABLE');
  var tableCnt = tables.length;
  for(var cnt=1; cnt<tableCnt; cnt++)
  {
    var rows = tables[cnt].getElementsByTagName('TR');
    var endRow = rows.length;
    for (var i=0; i<endRow; i++)
    {
      var cells = rows[i].getElementsByTagName('TD');
      var keys = keyArray[cnt-1];
      var endCell = cells.length;
      if (cnt==1)
      {
        for (var j=0; j<endCell; j++)
          cells[j].firstChild.nodeValue = keys[j][numeric];
      }
      else
      {
        for (var j=0; j<endCell; j++)
        {
          if (cells[j].firstChild.nodeValue == "Shift")
          {
            if (shiftClicked == true)
              cells[j].style.background = KEY_PRESSED;
            else
              cells[j].style.background = KEY_RELEASED;
          }
          cells[j].firstChild.nodeValue = keys[j][arrElement];
        }
      }
    }
  }
}

function resetKeyArray(keyLayoutName)
{
  keyArray = new Array();
  switch(keyLayoutName)
  {
    case "US":
      keyArray = keysUS;
      break;
    case "Dvorak":
      keyArray = keysDvorak;
      break;
  }
}

function changeKeyboard()
{
  capClicked = false;
  shiftClicked = false;
  var keyTable = document.getElementById('mainKeyTable');
  var tables = keyTable.getElementsByTagName('TABLE');
  var tableCnt = tables.length;
  for(var cnt=1; cnt<tableCnt; cnt++)
  {
    var rows = tables[cnt].getElementsByTagName('TR');
    var endRow = rows.length;
    for (var i=0; i<endRow; i++)
    {
      var cells = rows[i].getElementsByTagName('TD');
      var keys = keyArray[cnt-1];
      var endCell = cells.length;
      for (var j=0; j<endCell; j++)
      {
        cells[j].firstChild.nodeValue =	keys[j][0];
        if ((cells[j].firstChild.nodeValue == "Shift") || (cells[j].firstChild.nodeValue == "Caps"))
          cells[j].style.background = KEY_RELEASED;
      }
    }
  }
}

function createLabels(mainTable)
{

  var labelBody = document.createElement("tbody");
  var labelRow = document.createElement("tr");
  var labelCol = document.createElement("td");
  labelCol.colSpan = 2;
  labelCol.appendChild(document.createTextNode(labelText));
  labelRow.appendChild(labelCol);
  labelBody.appendChild(labelRow);
  mainTable.appendChild(labelBody);
}

function setupKeyboard() {
	// setup the PII fields on this page 
	var elemArr = new Array() ;

	// this page may not have all the PII fields
	elemArr[0] = "ssn";
	elemArr[1] = "lastname";
	elemArr[2] = "dateofbirth";

	configVkElements(elemArr);

	// setup initial keyboard focus in the first PII field
	buildKeyboard("keyboard", elemArr[0]);
	document.getElementById(elemArr[0]).focus();
}
        
function virtualKeyboardEnter(){}

setupKeyboard();


