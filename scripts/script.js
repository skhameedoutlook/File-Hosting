var currentOpenFolder="root";
var currentDirectoryTracker = ["root"];
var currentFolderIndex = 0;
var currentFileIndex = -1;
var selectmode = false;
var selectedList = [];
var resultarray = [];
var resultarrayindices = [];
var currentViewMode = "grid";
var toggleoff = '<span id="selectmodeicon">&nbsp;&nbsp;&nbsp;<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-toggle-off" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>/svg></span>';
var toggleon = '<span id="selectmodeicon">&nbsp;&nbsp;&nbsp;<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-toggle-on" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></span>';
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
        document.getElementById("listindropdown").innerHTML = "";
        document.getElementById("query").value = "";
        EditFileWithContent();
    }
    else {
        var tempstr = event.currentTarget.id.split('-')
        var folderIndex = tempstr[0];
        var itemIndex = tempstr[1];
        // alert(folderList[folderIndex].itemlist[itemIndex].item.foldername);
        currentOpenFolder = folderList[folderIndex].itemlist[itemIndex].item.foldername;
        currentDirectoryTracker.push(currentOpenFolder);
        document.getElementById("listindropdown").innerHTML = "";
        document.getElementById("query").value = "";
        displayFolderContents();
    }
}
var AFile = function(filename,  fileloc, filesize, content) {
    this.filename = filename;
    this.fileloc = fileloc;
    this.filesize = filesize;
    this.content = content;
}
var AFolder = function(foldername="0", itemlist=[], folderloc) {
    this.foldername = foldername;
    this.itemlist = itemlist;
    this.folderloc = folderloc
    this.addItem = function(item) {
        if(this.itemlist.length == 0) {
            this.itemlist = [item];
        }
        else this.itemlist.push(item);
    }
}
var folderList = [new AFolder(currentOpenFolder, [], "")];
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
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
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
        
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
            // console.log(folderList[i]);
            var theFolder = new AFolder(document.getElementById('folder-name').value, [], currentDirectoryTracker.join('/'));
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
        return;
    }
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
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
        
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
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
        theElement.innerHTML = "Select Mode" + toggleon;
        // document.getElementById("selectmodeicon").innerHTML = toggleon;
    }
    else {
        theElement.classList.remove("btn-success");
        theElement.classList.add("btn-dark");
        theElement.innerHTML = "Select Mode" + toggleoff;
        // document.getElementById("selectmodeicon").innerHTML = toggleoff;
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
    if(currentViewMode == "list") {
        displayFolderContentsSelectList();
        return;
    }
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
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
    //list-hover-1-hover
    if(currentViewMode == "grid") {
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
    else {
        for(var i = 0; i < selectedList.length; i++) {
            if(selectedList[i] == event.currentTarget.id) {
                found = true;
                selectedList.splice(i, 1);
                document.getElementById(event.currentTarget.id).classList.remove("list-hover-1-hover");
                document.getElementById(event.currentTarget.id).classList.add("list-hover-1");
                break;
            }
        }
        if(!found) {
            selectedList.push(event.currentTarget.id);
            document.getElementById(event.currentTarget.id).classList.remove("list-hover-1");
            document.getElementById(event.currentTarget.id).classList.add("list-hover-1-hover");
        }
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

var displayFolderContentsList = function() {
    if(selectmode) {
        displayFolderContentsSelectList();
        return;
    }
    if(currentViewMode == "grid") {
        displayFolderContents();
    }
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
            var theFolder = folderList[i];
            if(theFolder.itemlist.length > 0) {
                // alert("Here " + theFolder.itemlist.length);
                rowHTML = '<ul class="list-group" style="margin-top: 50px;">';
                for(var j = 0; j < theFolder.itemlist.length; j++) {
                    console.log(theFolder);
                    var theItem = theFolder.itemlist[j];
                    if(theItem.type == "file") {
                        rowHTML += '<li id="' + i + '-' + j + '" class="list-group-item list-hover-1" onclick="openFileFolder(event, \'file\')" ><img src="icons/the-file.png" width="30px" height="30px" />&nbsp;&nbsp;&nbsp;&nbsp;'+ theItem.item.filename+'</li>';
                    }
                    else {
                        rowHTML += '<li id="' + i + '-' + j + '" class="list-group-item list-hover-1" onclick="openFileFolder(event, \'folder\')"><img src="icons/the-folder.png" width="30px" height="30px" />&nbsp;&nbsp;&nbsp;&nbsp;'+ theItem.item.foldername+ '</li>';
                    }
                }
            }
            rowHTML += '</ul>';
            totalHTML = rowHTML;
            // alert(rowHTML);
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

var displayFolderContentsSelectList = function() {
    // if(selectmode) {
    //     displayFolderContentsSelectList();
    //     return;
    // }
    // if(currentViewMode == "grid") {
    //     displayFolderContents();
    // }
    currentOpenFolder = currentDirectoryTracker[currentDirectoryTracker.length-1];
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
            var theFolder = folderList[i];
            if(theFolder.itemlist.length > 0) {
                // alert("Here " + theFolder.itemlist.length);
                rowHTML = '<ul class="list-group" style="margin-top: 50px;">';
                for(var j = 0; j < theFolder.itemlist.length; j++) {
                    console.log(theFolder);
                    var theItem = theFolder.itemlist[j];
                    if(theItem.type == "file") {
                        rowHTML += '<li id="' + i + '-' + j + '" class="list-group-item list-hover-1" onclick="selectFileFolder(event)" ><img src="icons/the-file.png" width="30px" height="30px" />&nbsp;&nbsp;&nbsp;&nbsp;'+ theItem.item.filename+'</li>';
                    }
                    else {
                        rowHTML += '<li id="' + i + '-' + j + '" class="list-group-item list-hover-1" onclick="selectFileFolder(event)"><img src="icons/the-folder.png" width="30px" height="30px" />&nbsp;&nbsp;&nbsp;&nbsp;'+ theItem.item.foldername+ '</li>';
                    }
                }
            }
            rowHTML += '</ul>';
            totalHTML = rowHTML;
            // alert(rowHTML);
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


var setlistview = function() {
    if(currentViewMode == "list") {
        return;
    }
    selectedList = [];
    currentViewMode = "list";
    document.getElementById("listviewbutton").classList.add("grid-or-list-inset");
    document.getElementById("gridviewbutton").classList.remove("grid-or-list-inset");
    displayFolderContents();
}

var setgridview = function() {
    if(currentViewMode == "grid") {
        return;
    }
    selectedList = [];
    currentViewMode = "grid";
    document.getElementById("gridviewbutton").classList.add("grid-or-list-inset");
    document.getElementById("listviewbutton").classList.remove("grid-or-list-inset");
    displayFolderContents();
}

var searchAndDisplayResults = function() {
    resultarray = [];
    resultarrayindices = [];
    var query = document.getElementById("query").value.toUpperCase();
    if(query.length == 0) {
        document.getElementById("listindropdown").innerHTML = "";
        return;
    }
    for(var i = 0; i < folderList.length; i++) {
        if(folderList[i].foldername == currentOpenFolder && folderList[i].folderloc==currentDirectoryTracker.slice(0, currentDirectoryTracker.length-1).join("/")) {
            var theFolder = folderList[i];
            for(var j = 0; j < theFolder.itemlist.length; j++) {
                var theItem = theFolder.itemlist[j];
                if(theItem.type == 'file') {
                    if(theItem.item.filename.toUpperCase().includes(query)) {
                        console.log(theItem.item.filename.toUpperCase() + " includes " + query);
                        resultarray.push(theItem);
                        resultarrayindices.push(i+"-"+j);
                    }
                }
                else {
                    if(theItem.item.foldername.toUpperCase().includes(query)) {
                        console.log(theItem.item.foldername.toUpperCase() + " includes " + query);
                        resultarray.push(theItem);
                        resultarrayindices.push(i+"-"+j);
                    }
                }
                if(resultarray.length >= 5) {
                    break;
                }
            }
            break;
        }
    }
    if(resultarray.length == 0) {
        document.getElementById("listindropdown").innerHTML = "<a>No results found.</a>";
        return;
    }
    var totalHTML = "";
    var rowHTML = "";
    var theFolder;
                // alert("Here " + theFolder.itemlist.length);
    for(var x = 0; x < resultarray.length; x++) {
        console.log(theFolder);
        var theItem = resultarray[x];
        var temp = resultarrayindices[x].split("-");
        var i = temp[0];
        var j = temp[1];
        if(theItem.type == "file") {
            rowHTML += '<li id="' + i + '-' + j + '" class="list-group-item list-hover-1" onclick="openFileFolder(event, \'file\')" ><img src="icons/the-file.png" width="30px" height="30px" />&nbsp;&nbsp;&nbsp;&nbsp;'+ theItem.item.filename+'</li>';
        }
        else {
            rowHTML += '<li id="' + i + '-' + j + '" class="list-group-item list-hover-1" onclick="openFileFolder(event, \'folder\')"><img src="icons/the-folder.png" width="30px" height="30px" />&nbsp;&nbsp;&nbsp;&nbsp;'+ theItem.item.foldername+ '</li>';
        }
    }
    totalHTML = rowHTML;
    // alert(rowHTML);
    document.getElementById("listindropdown").innerHTML = totalHTML;
    // alert(totalHTML);
}

var setqueryempty = function() {
    document.getElementById("query").value = "";
    searchAndDisplayResults();
}