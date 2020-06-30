var currentOpenFolder="root";
var currentDirectoryTracker = ["root"];
var currentFolderIndex = 0;
var currentFileIndex = -1;
var selectmode = false;
var selectedList = [];
var currentViewMode = "grid";
var goback = function(event) {
    preventformdefault(event);
    if(currentDirectoryTracker.length == 1) {
        return;
    }
    selectedList = [];
    currentDirectoryTracker.pop();
    displayFolderContents();
}
var openFileFolder = function(event, type) {
    if(type == "file") {
        // alert("File. testing ." + event.currentTarget.id);
        var temp = event.currentTarget.id.split("-");
        currentFolderIndex = temp[0];
        currentFileIndex = temp[1];
        // alert(temp[0] + " " + temp[1] + folderList[folderIndex].itemlist[fileIndex].item.content);
        document.getElementById("TheCTextArea").value = folderList[currentFolderIndex].itemlist[currentFileIndex].item.content;
        EditFileWithContent();
    }
    else {
        var tempstr = event.currentTarget.id.split('-')
        var folderIndex = tempstr[0];
        var itemIndex = tempstr[1];
        // alert(folderList[folderIndex].itemlist[itemIndex].item.foldername);
        currentOpenFolder = folderList[folderIndex].itemlist[itemIndex].item.foldername;
        currentDirectoryTracker.push(currentOpenFolder);
        displayFolderContents();
    }
}
var AFile = function(filename,  fileloc, filesize, content) {
    this.filename = filename;
    this.fileloc = fileloc;
    this.filesize = filesize;
    this.content = content;
}
var AFolder = function(foldername="0", itemlist=[]) {
    this.foldername = foldername;
    this.itemlist = itemlist;
    this.addItem = function(item) {
        if(this.itemlist.length == 0) {
            this.itemlist = [item];
        }
        else this.itemlist.push(item);
    }
}
var folderList = [new AFolder(currentOpenFolder, [])];
var Item = function(item, type) {
    this.item = item;
    this.type = type;
}
var uploadFile = function(event) {
    preventformdefault(event);
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    console.log('Uploaded ' + document.getElementById('file').value);
    if(document.getElementById('file').value == "") {
        alert("Please select a file");
        return;
    }
    // itemArray.push(new Item(new AFile(document.getElementById('file').value), 'file') );
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder) {
            var tempstr = document.getElementById('file').value.split('\\');
            var filename = tempstr[tempstr.length-1];
            tempstr.pop();
            console.log(filename);
            folderList[i].addItem(new Item(new AFile(filename, tempstr.join('\\')), 'file' ));
            break;
        }
    }
    document.getElementById('file').value = "";
    displayFolderContents();
}
var createFolder = function(event) {
    preventformdefault(event);
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    console.log("Created a new folder " + document.getElementById('folder-name').value);
    if(document.getElementById('folder-name').value == "") {
        alert("Please enter a folder name");
        return;
    }
    for(var i = 0; i < folderList.length; i++) {
        
        if(folderList[i].foldername == currentOpenFolder) {
            // console.log(folderList[i]);
            var theFolder = new AFolder(document.getElementById('folder-name').value);
            var theItem = new Item(theFolder);
            folderList[i].addItem(theItem);
            folderList.push(theFolder);
            // console.log(folderList[i]);
            break;
        }
    }
    document.getElementById('folder-name').value = "";
    displayFolderContents();
}
var displayFolderContents = function() {
    if(selectmode) {
        displayFolderContentsSelect();
        return;
    }
    if(currentViewMode == "list") {
        displayFolderContentsList();
    }
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder) {
            var theFolder = folderList[i];
            if(theFolder.itemlist.length > 0) {
                for(var j = 0; j < theFolder.itemlist.length; j++) {
                    console.log(theFolder);
                    var theItem = theFolder.itemlist[j];
                    if(j % 3 == 0) {
                        rowHTML = '<div class="row row-spacing"><div class="col-sm">';
                        if(theItem.type == "file") {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'file\')">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;" >';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'folder\')"">';
                            rowHTML += '<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            // alert('<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">');
                            rowHTML += '<p class="center-text">' + theItem.item.foldername + '</p>';
                        }
                        if(j == theFolder.itemlist.length-1) {
                            rowHTML += '</div></div></div>';
                        }
                        else {
                            rowHTML += '</div></div>';
                        }
                        totalHTML += rowHTML;
                    }
                    else {
                        rowHTML = '<div class="col-sm">';
                        if(theItem.type == "file") {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'file\')">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j  + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'folder\')">';
                            rowHTML += '<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.foldername + '</p>';
                        }
                        if(j == theFolder.itemlist.length-1) {
                            rowHTML += '</div></div></div>';
                        }
                        else {
                            if(j % 3 == 2) {
                                rowHTML += '</div></div></div>';
                            }
                            else {
                                rowHTML += '</div></div>';
                            }
                        }
                        totalHTML += rowHTML;
                    }
                }
            }
            break;
        }
    }
    document.getElementById('main-content').innerHTML = totalHTML;
    var theNavContents = "";
    for(var i = 0; i < currentDirectoryTracker.length; i++) {
        if(i == currentDirectoryTracker.length-1) {
            theNavContents += currentDirectoryTracker[i];
        }
        else {
            theNavContents += currentDirectoryTracker[i] + " > ";
        }
    }
    // console.log(theNavContents);
    document.getElementById('loc-nav-body').innerHTML = theNavContents;
}

var preventformdefault = function(event) {
    event.preventDefault();
}


var CreateFileWithContent = function(event) {
    preventformdefault(event);
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    console.log("Creating a new file with content ");
    var theFileName = document.getElementById("TheCFName").value;
    var theFileContent = document.getElementById("TheCCTextArea").value;
    if(theFileName.length == 0) {
        alert("File name should not be empty");
        return;
    }
    var tempstr = currentDirectoryTracker;
    // alert(theFileContent);
    for(var i = 0; i < folderList.length; i++) {
        
        if(folderList[i].foldername == currentOpenFolder) {
            // console.log(folderList[i]);
            // var theFolder = new AFile(document.getElementById('folder-name').value);
            // var theItem = new Item(theFolder);
            // folderList[i].addItem(theItem);
            // folderList.push(theFolder);
            // console.log(folderList[i]);
            var temp1 = theFileContent.length;
            var temp2 = theFileContent;
            folderList[i].addItem(new Item(new AFile( theFileName, tempstr.join('/'), temp1, temp2), 'file'));
            // alert(temp1+ " : " + temp2);
            break;
        }
    }
    document.getElementById("TheCFName").value = "";
    document.getElementById("TheCCTextArea").value = "";
    document.getElementById('folder-name').value = "";
    $('#FileCreateModel').modal('toggle');
    displayFolderContents();
}


var EditFileWithContent = function() {
    console.log("Editing file with content ");
    // alert(theFileContent);
    $('#FileEditModel').modal('toggle');
    // alert("Done!");
}

var SaveFileWithContent = function() {
    preventformdefault(event);
    folderList[currentFolderIndex].itemlist[currentFileIndex].item.content = document.getElementById("TheCTextArea").value;
    document.getElementById("TheCTextArea").value = "";
    $('#FileEditModel').modal('toggle');
    displayFolderContents();
}


var toggleselectmode = function() {
    var theElement = document.getElementById("selectmodebutton");
    if(!selectmode) {
        theElement.classList.remove("btn-dark");
        theElement.classList.add("btn-success");
        theElement.innerHTML = "Select File Mode: On";
    }
    else {
        theElement.classList.remove("btn-success");
        theElement.classList.add("btn-dark");
        theElement.innerHTML = "Select File Mode: Off";
    }
    selectmode = !selectmode;
    if(!selectmode) {
        selectedList = [];
        document.getElementById("deletebutton").style.display = "none";
    }
    else {
        document.getElementById("deletebutton").style.display = "block";
    }
    displayFolderContents();
}

var displayFolderContentsSelect = function() {
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder) {
            var theFolder = folderList[i];
            if(theFolder.itemlist.length > 0) {
                for(var j = 0; j < theFolder.itemlist.length; j++) {
                    console.log(theFolder);
                    var theItem = theFolder.itemlist[j];
                    if(j % 3 == 0) {
                        rowHTML = '<div class="row row-spacing"><div class="col-sm">';
                        if(theItem.type == "file") {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="selectFileFolder(event)">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;" >';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="selectFileFolder(event)"">';
                            rowHTML += '<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            // alert('<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">');
                            rowHTML += '<p class="center-text">' + theItem.item.foldername + '</p>';
                        }
                        if(j == theFolder.itemlist.length-1) {
                            rowHTML += '</div></div></div>';
                        }
                        else {
                            rowHTML += '</div></div>';
                        }
                        totalHTML += rowHTML;
                    }
                    else {
                        rowHTML = '<div class="col-sm">';
                        if(theItem.type == "file") {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="selectFileFolder(event)">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j  + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="selectFileFolder(event)">';
                            rowHTML += '<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.foldername + '</p>';
                        }
                        if(j == theFolder.itemlist.length-1) {
                            rowHTML += '</div></div></div>';
                        }
                        else {
                            if(j % 3 == 2) {
                                rowHTML += '</div></div></div>';
                            }
                            else {
                                rowHTML += '</div></div>';
                            }
                        }
                        totalHTML += rowHTML;
                    }
                }
            }
            break;
        }
    }
    document.getElementById('main-content').innerHTML = totalHTML;
    var theNavContents = "";
    for(var i = 0; i < currentDirectoryTracker.length; i++) {
        if(i == currentDirectoryTracker.length-1) {
            theNavContents += currentDirectoryTracker[i];
        }
        else {
            theNavContents += currentDirectoryTracker[i] + " > ";
        }
    }
    // console.log(theNavContents);
    document.getElementById('loc-nav-body').innerHTML = theNavContents;
}

var selectFileFolder = function(event) {
    // alert("Selected " + event.currentTarget.id);
    var found = false;
    for(var i = 0; i < selectedList.length; i++) {
        if(selectedList[i] == event.currentTarget.id) {
            found = true;
            selectedList.splice(i, 1);
            document.getElementById(event.currentTarget.id).classList.remove("col-sm-inner-hover");
            document.getElementById(event.currentTarget.id).classList.add("col-sm-inner");
            break;
        }
    }
    if(!found) {
        selectedList.push(event.currentTarget.id);
        document.getElementById(event.currentTarget.id).classList.remove("col-sm-inner");
        document.getElementById(event.currentTarget.id).classList.add("col-sm-inner-hover");
    }
}

var deleteselected = function() {
    var currentDirectory = currentDirectoryTracker[currentDirectoryTracker.length-1];
    for(var i = 0; i < selectedList.length; i++) {
        var temp = selectedList[i].split("-");
        var folderIndex = temp[0];
        var fileIndex = temp[1];
        if(folderList[folderIndex].itemlist[fileIndex].type == "file") {
            folderList[folderIndex].itemlist[fileIndex].item.filename = "-1";
        }
        else {
            folderList[folderIndex].itemlist[fileIndex].item.foldername = "-1";
        }
    }
    deleteminus1s(currentDirectory);
}

var deleteminus1s = function(currentDirectory) {
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == "-1") {
            folderList.splice(i, 1);
            i--;
        }
    }
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentDirectory) {
            for(var j = 0; j < folderList[i].itemlist.length; j++) {
                if(folderList[i].itemlist[j].type == "file") {
                    if(folderList[i].itemlist[j].item.filename == "-1") {
                        folderList[i].itemlist.splice(j, 1);
                        // j--;
                    }
                }
                else {
                    if(folderList[i].itemlist[j].item.foldername == "-1") {
                        folderList[i].itemlist.splice(j, 1);
                        // j--;
                    }
                }
            }
            break;
        }
    }
    selectedList = [];
    displayFolderContents();
}

var displayFolderContents = function() {
    if(selectmode) {
        displayFolderContentsSelect();
        return;
    }
    if(currentViewMode == "list") {
        displayFolderContentsList();
    }
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder) {
            var theFolder = folderList[i];
            if(theFolder.itemlist.length > 0) {
                for(var j = 0; j < theFolder.itemlist.length; j++) {
                    console.log(theFolder);
                    var theItem = theFolder.itemlist[j];
                    if(j % 3 == 0) {
                        rowHTML = '<div class="row row-spacing"><div class="col-sm">';
                        if(theItem.type == "file") {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'file\')">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;" >';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'folder\')"">';
                            rowHTML += '<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            // alert('<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">');
                            rowHTML += '<p class="center-text">' + theItem.item.foldername + '</p>';
                        }
                        if(j == theFolder.itemlist.length-1) {
                            rowHTML += '</div></div></div>';
                        }
                        else {
                            rowHTML += '</div></div>';
                        }
                        totalHTML += rowHTML;
                    }
                    else {
                        rowHTML = '<div class="col-sm">';
                        if(theItem.type == "file") {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'file\')">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j  + '" class="center-hz col-sm-inner" data-toggle="tooltip" data-html="true" data-placement="top" title="<h1>Test</h1>Tooltip on top" onclick="openFileFolder(event, \'folder\')">';
                            rowHTML += '<img src="icons/the-folder.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.foldername + '</p>';
                        }
                        if(j == theFolder.itemlist.length-1) {
                            rowHTML += '</div></div></div>';
                        }
                        else {
                            if(j % 3 == 2) {
                                rowHTML += '</div></div></div>';
                            }
                            else {
                                rowHTML += '</div></div>';
                            }
                        }
                        totalHTML += rowHTML;
                    }
                }
            }
            break;
        }
    }
    document.getElementById('main-content').innerHTML = totalHTML;
    var theNavContents = "";
    for(var i = 0; i < currentDirectoryTracker.length; i++) {
        if(i == currentDirectoryTracker.length-1) {
            theNavContents += currentDirectoryTracker[i];
        }
        else {
            theNavContents += currentDirectoryTracker[i] + " > ";
        }
    }
    // console.log(theNavContents);
    document.getElementById('loc-nav-body').innerHTML = theNavContents;
}
