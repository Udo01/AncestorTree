/*----UiStartView.js
|--------------------------------------------------------------------------------------------
| (c) 2012 Udo Lang
|     
|                                                                            
|	created:: Dezember 14, 2012				   
|     Last updated: Dezember 14, 2012
|     Version: 1.0
\------------------------------------------------------------------------------------------*/

//constants
//global variables
var startViewObj=null;
    
UiStartView = function (page) {
	this.config = {
			val1:null,
	}

	this.page = page;
	this.content=$(page).find("div[role='main']")
	this.dataContainer=null;
}

UiStartView.prototype.setObjRef=function(objRef)
{
	startViewObj=objRef;
}

UiStartView.prototype.show=function()
{
	$(this.content).empty();  
	var contentStr= '';
	if(this.dataContainer!=null){
		$(this.content).append($(this.addDataContainerHeader(this.dataContainer)));
		$("#gedXDataLV").listview();
	}
	contentStr+='<h1>Data</h1>'+
  		'<div class="ui-grid-a ui-responsive">'+
  			'<div class="ui-block-a"><div class="button-wrap" style="margin:5px"><button style="height:100px" class="ui-shadow ui-btn ui-corner-all ui-mini" id="SkydriveBtn">Skydrive</button></div></div>'+
  			'<div class="ui-block-b"><div class="button-wrap" style="margin:5px"><button style="height:100px" class="ui-shadow ui-btn ui-corner-all ui-mini" id="GAEBtn">Google Cloud</button></div></div>'+
  			'<div class="ui-block-a"><div class="button-wrap" style="margin:5px"><button style="height:100px" class="ui-shadow ui-btn ui-corner-all ui-mini" id="XMLBtn">XML</button></div></div>'+
  			'<div class="ui-block-b"><div class="button-wrap" style="margin:5px"><button style="height:100px" class="ui-shadow ui-btn ui-corner-all ui-mini" id="GedcomBtn">Gedcom</button></div></div>'+
  			'<div class="ui-block-a"><div class="button-wrap" style="margin:5px"><button style="height:100px" class="ui-shadow ui-btn ui-corner-all ui-mini" id="NewBtn">New</button></div></div>'+
  			'<div class="ui-block-b"><div class="button-wrap" style="margin:5px"></div></div>'+
    ' </div>';
	
	$(this.content).append($(contentStr));
	
    $('#GAEBtn').bind('click',function(event, ui){
    	ctr.showGAEView();
    });
    $('#NewBtn').bind('click',function(event, ui){
        ctr.loadDefaultData();
    });
    $('#XMLBtn').bind('click',function(event, ui){
        ctr.showXMLView();
    });
    $('#GedcomBtn').bind('click',function(event, ui){
        ctr.showGedcomView();
    });
}


UiStartView.prototype.addDataContainerHeader=function()
{
    var dataContainer=startViewObj.dataContainer;
	var str='<ul data-role="listview" id="gedXDataLV" data-split-icon="gear" data-theme="c">'+
    '<li onclick="ctr.showListView()"><a href="#">'+
	'<h3>'+dataContainer.name+'</h3>'+
	'<p><strong>'+dataContainer.description+'</strong></p>'+
	'<p>'+dataContainer.owner+'</p>'+
	'<p>'+dataContainer.created+'</p>'+
	'<p>'+dataContainer.accessType+'</p>';
	if(dataContainer.lastUser!="" && dataContainer.lastChanged!="")str+='<p class="ui-li-aside"><br/><strong>'+ctr.getPageResource("global","saved")+':</strong><br/>'+dataContainer.lastUser+'<br/>'+dataContainer.lastChanged+'</p>';
	str+='</a>'+
	'</li>'+
	'</ul>'+
	'<hr/>';
	return str;
}

