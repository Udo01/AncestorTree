/*----XMLDataController.js
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
var xmlObj=null;
    
XMLDataController = function (page) {
	this.config = {
			val1:null,
	}

	this.page = page;
	this.content=$(page).find("div[role='main']")
	this.dataContainer=null;
}

XMLDataController.prototype.setObjRef=function(objRef)
{
	xmlObj=objRef;
}

XMLDataController.prototype.show=function()
{
    this.showUI();
}

XMLDataController.prototype.showUI=function()
{
    var dataContainer=xmlObj.dataContainer;
    var content=xmlObj.content;
	var code;
	content.empty();
	if(dataContainer!=null && dataContainer.xmlData!=null)code=$(dataContainer.xmlData).html();
	else code="";
    
    var contentStr='<div data-role="fieldcontain">'+
    '<hr/>'+
    '<textarea id="SXD_xmlDataTA" cols="40" rows="20" >'+code+'</textarea>'+
    '<a id="SXD_updateDataBtn" href="#" class="ui-btn" data-ajax="false">'+ctr.getPageResource("showXmlDataDlg","updateData")+'</a>'+  
    '<a href="#" class="ui-btn" data-rel="back" data-ajax="false">'+ctr.getPageResource("global","cancel")+'</a>'+  
    '<br/><hr/>'+
    '</div>'; 
    $(content).append(contentStr);
    $(content).find("textarea").textinput();
    
    //add event listener
    $("#SXD_updateDataBtn").on( "tap", function( event, data ){
      	if(ctr.dataContainer==null)ctr.addEmptyDataContainer(); 
    	ctr.replaceXmlData($("#SXD_xmlDataTA").val());
       	 ctr.showStartView();
    });
}





