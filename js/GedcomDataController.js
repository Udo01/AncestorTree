/*----GedcomDataController.js
|--------------------------------------------------------------------------------------------
| (c) 2012 Udo Lang
|     
|                                                                            
|	created:: Dezember 16, 2012				   
|     Last updated: Dezember 16, 2012
|     Version: 1.0
\------------------------------------------------------------------------------------------*/

//constants
//global variables
var gedcomObj=null;
    
GedcomDataController = function (page) {
	this.config = {
			val1:null,
	}

	this.page = page;
	this.content=$(page).find("div[data-role='content']")
	this.dataContainer=null;
}

GedcomDataController.prototype.setObjRef=function(objRef)
{
	gedcomObj=objRef;
}

GedcomDataController.prototype.show=function()
{
    this.showUI();
}

GedcomDataController.prototype.showUI=function()
{
    var content=gedcomObj.content;

    var contentStr='<div data-role="fieldcontain">'+
    '<hr/>'+
    '<form id="importGedcomForm" action="/gedcomservice" method="post" enctype="multipart/form-data" data-ajax="false">'+
    '<input type="hidden" name="MAX_FILE_SIZE" value="500000">'+
    '<input type="file" name="datei" size="40" maxlength="500000">'+
    '<input type="submit" name="Submit" value="'+ctr.getPageResource("importGedcomDlg","import")+'">'+
    '</form>'+
    '<a href="#" data-role="button" data-rel="back" data-ajax="false" data-theme="c">'+ctr.getPageResource("global","cancel")+'</a>'+  
    '<br/><hr/>'+
    '</div>';
    $(content).html(contentStr);
    
	var options = { 
		    url:        '/gedcomservice',
		    dataType: "xml",
		    async:"false",
		    success:    function(result, statusText, xhr, $form) {
		    	if($(result).find("gedx").length>0)
		    		{
					var xmlDoc=$.parseXML('<xml></xml>');
			    	$(xmlDoc).find("xml").append($("<root>"+(new XMLSerializer()).serializeToString(result)+"</root>"));
			    	
			    	var xmlData=$(xmlDoc).find("data");
			        var fileName= $(xmlDoc).find("filename").text();
			        
			      	ctr.addEmptyDataContainer(); 
			    	ctr.dataContainer.xmlData=xmlData;
			    	ctr.dataContainer.name=fileName;
			       	 ctr.showStartView();
		    		}
		    	else alert(ctr.getPageResource("importGedcomDlg","couldNotImport"));
		    },
		    error:function(){alert(ctr.getPageResource("importGedcomDlg","couldNotImport"));}
		}; 
    $('#importGedcomForm').ajaxForm(options); 
}




