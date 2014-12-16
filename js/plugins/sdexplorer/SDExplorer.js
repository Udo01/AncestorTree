/*----sd_explorer.js
|--------------------------------------------------------------------------------------------
| (c) 2012 Udo Lang
|     
|                                                                            
|					   
|     Last updated: July 07, 2012
|     Version: 1.0
\------------------------------------------------------------------------------------------*/

//constants

//global variables
var thisObj=null;
    
SDExplorer = function (container) {
	this.config = {
			APP_CLIENT_ID:null,
			REDIRECT_URL:null,
			Init_files_path:null,
			FileTypes:['file','audio','video','photo'],
			FolderTypes:['album','folder'],
			SDFileClickEventHandler:null
	}
	this.status={
	    value1:0
	}
	
	this.version = "1.0";
	this.Session;
	this.container = container;
}

SDExplorer.prototype.setObjRef=function(objRef)
{
	thisObj=objRef;
}

SDExplorer.prototype.start=function()
{
	this.initUI();
	this.initEvents();
	this.initSD();
	this.loginSD();
}

SDExplorer.prototype.initUI=function()
{
	var uiContentStr= '<div data-role="content">'+
//	    '<a href="#" data-role="button" id="getFilesBtn">get files</a> '+
//	    '<textarea rows="" cols="" id="infoTxt"></textarea>'+
	    '<div data-role="fieldcontain" id="listContainer"></div>'+
	 ' </div>';
	  this.container.html(uiContentStr);
}

SDExplorer.prototype.initEvents=function()
{
$('#getFilesBtn').on('click', function(event) {
	thisObj.initSD();
	thisObj.loginSD();
});


$('#uploadFileBtn').on('click', function (event) {
	thisObj.uploadAjaxPost();
});
}

SDExplorer.prototype.initSD=function()
{
	WL.init({ client_id: this.config.APP_CLIENT_ID, redirect_uri: this.config.REDIRECT_URL });	
}

SDExplorer.prototype.loginSD=function()
{
  WL.login(
   { "scope": "wl.skydrive" },
   function (response) {
       if (response.status == "connected") {
    	   thisObj.Session = response.session;
    	   thisObj.createFileList(thisObj.config.Init_files_path);
       }
       else {
           this.log("Could not connect, status = " + response.status);
       }
   });
}

SDExplorer.prototype.createFileList=function(files_path) {
	if(thisObj.Session!=null)
		{
  		WL.api({ path: files_path, method: "GET" }, function(response){
  		    if (response.error) {
  		    	thisObj.log("Cannot get files and folders: " + JSON.stringify(response.error).replace(/,/g, ",\n"));
  		    }
  		    else {
  		        var items = response.data;
  		        thisObj.log(JSON.stringify(response.data));
  		      	thisObj.createFileListControl(items)
  		    }  			
  		});
		}
}

SDExplorer.prototype.getParentFolder=function(folder_id) {
	if(thisObj.Session!=null)
		{
  		WL.api({ path: folder_id, method: "GET" }, function(response){
  		    if (response.error) {
  		    	thisObj.log("Cannot get parent folder: " + JSON.stringify(response.error).replace(/,/g, ",\n"));
  		    }
  		    else {
  		    	thisObj.createFileList(response.parent_id+"/files")
  		    }  			
  		});
		}
}

SDExplorer.prototype.getPhotoItems=function(id) {
	if(thisObj.Session!=null)
		{
  		WL.api({ path: id, method: "GET" }, function(response){
  		    if (response.error) {
  		    	thisObj.log("Cannot get parent folder: " + JSON.stringify(response.error).replace(/,/g, ",\n"));
  		    }
  		    else {
  		    	thisObj.createImageItemsControl(response);
  		    }  			
  		});
		}
}

SDExplorer.prototype.getFile=function(file_id) {
	if(thisObj.Session!=null)
		{
  		WL.api({ path: file_id+"/content", method: "GET" }, function(response){
  		    if (response.error) {
  		    	thisObj.log("Cannot get file: " + JSON.stringify(response.error).replace(/,/g, ",\n"));
  		    }
  		    else {
  		    	thisObj.log(JSON.stringify(response));
  		    	window.open(response.location, "width=800,height=600,scrollbars=yes");
  		        // document.location=response.location;
  		    }  			
  		});
		}
}

SDExplorer.prototype.createFileListControl=function(fileList)
{
   	if(fileList.length>0)
	{
	var listContainer=this.container.find("#listContainer");
  
  var contentStr='<hr/><br/>'+
  '<ul data-role="listview" data-filter="false" id="FilesListLV" data-split-icon="gear" data-theme="c"></ul>';
  $(listContainer).html(contentStr);
  $("#FilesListLV").listview()

   // add list items
   var filesLV=$("#FilesListLV");  
   var str =""; 
   	// create navigation to parent

		   if(this.config.ShowSubfolder)
		   {
   			var parentFolder=fileList[0].parent_id;
			str+='<li><a onclick="thisObj.parentFolderClicked(\''+parentFolder+'\')" href="#">..</a></li>';  
		   }
	   
   // create list
   for(var i=0;i<fileList.length;i++)
   {
	   switch(fileList[i].type)
	   {
	   case "file":
	   case "audio":
	   case "video":
		   if($.inArray(fileList[i].type,this.config.FileTypes)>-1)
			   {
			   str+='<li><a onclick="thisObj.fileClicked(\''+fileList[i].source+'\')" href="#">'+fileList[i].name+'</a></li>';
			   }
	     break;
	   case "photo":
		   if($.inArray(fileList[i].type,this.config.FileTypes)>-1)
			   {
			   str+='<li><a onclick="thisObj.photoClicked(\''+fileList[i].source+'\',\''+fileList[i].picture+'\')" href="#"><img src="'+fileList[i].picture+'" alt="picture"  \>'+fileList[i].name+'</a></li>';
				}			   
	    break;
	   case "album":
	   case "folder":
		   if($.inArray(fileList[i].type,this.config.FolderTypes)>-1)
		   {
		   str+='<li><a onclick="thisObj.folderClicked(\''+fileList[i].id+'\')" href="#">'+fileList[i].name+'</a></li>'; 
		   }
	   default:		   
		}
   }
   filesLV.append(str);
   filesLV.listview("refresh"); 
	}
   	}

SDExplorer.prototype.fileClicked=function(source)
{
    if(thisObj.config.SDFileClickEventHandler!=null)
    {
        eval(thisObj.config.SDFileClickEventHandler)(source,null);
    }
}

SDExplorer.prototype.photoClicked=function(source,thumbnail)
{
	if(thisObj.config.SDFileClickEventHandler!=null)
    {
        eval(thisObj.config.SDFileClickEventHandler)(source,thumbnail);
    }
}

SDExplorer.prototype.folderClicked=function(id)
{
	this.createFileList(id+"/files");
}
SDExplorer.prototype.parentFolderClicked=function(id)
{
	this.getParentFolder(id);
}

SDExplorer.prototype.log=function(message) {
	$("#infoTxt").text(message);
}

// upload not used because not allowed in Browser
SDExplorer.prototype.uploadAjaxPost=function() {
  if (thisObj.Session != null && thisObj.Session.access_token != null) {
      $.ajax({
          type: 'POST',
          contentType: "multipart/form-data; boundary=A300x",
          processData: false,
          url: 'https://apis.live.net/v5.0/me/skydrive/files?access_token=' + thisObj.Session.access_token,
          data: thisObj.createUploadRequestBody(),
          success: function () { alert('Success!'); },
          error: function () { alert('error'); },
      });
  }
}

SDExplorer.prototype.createUploadRequestBody=function() {
  var body = "--A300x\r\n"
              + "Content-Disposition: form-data; name=\"file\"; filename=\"sample.txt\"\r\n"
              + "Content-Type: application/octet-stream\r\n"
              + "\r\n"
              + "This is some content\r\n"
              + "\r\n"
              + "--A300x--\r\n";
  return body;
}



