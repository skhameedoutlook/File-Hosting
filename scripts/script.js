var currentOpenFolder="root";
var currentDirectoryTracker = ["root"];
var goback = function(event) {
    preventformdefault(event);
    if(currentDirectoryTracker.length == 1) {
        return;
    }
    currentDirectoryTracker.pop();
    displayFolderContents();
}
var openFileFolder = function(event, type) {
    if(type == "file") {
        alert("File. testing ." + event.currentTarget.id);
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
var AFile = function(filename="0",  fileloc="0", filesize="0", content="") {
    this.filename = filename;
    this.filesize = filesize;
    this.fileloc = fileloc;
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
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" onclick="openFileFolder(event, \'file\')">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" onclick="openFileFolder(event, \'folder\')"">';
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
                            rowHTML += '<div id="' + i + '-' + j + '" class="center-hz col-sm-inner" onclick="openFileFolder(event, \'file\')">';
                            rowHTML += '<img src="icons/the-file.png" class="center-hz" style= "width: 90px; height: 90px;">';
                            rowHTML += '<p class="center-text">' + theItem.item.filename + '</p>';
                        }
                        else {
                            rowHTML += '<div id="' + i + '-' + j  + '" class="center-hz col-sm-inner" onclick="openFileFolder(event, \'folder\')">';
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