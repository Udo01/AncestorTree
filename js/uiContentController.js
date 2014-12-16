/*----uiContentController.js
|--------------------------------------------------------------------------------------------
| (c) 2011 Udo Lang
|     
|                                                                            
|					   
|     Last updated: June 20, 2011
|     Version: 1.0
\------------------------------------------------------------------------------------------*/


//constants

//global variables

uiContentController= function () {
}

uiContentController.prototype.addHeader=function(container){
    if(container=="#treePage")$(container).prepend('<div data-role="header" data-position="fixed"><a href="#startPage" class="ui-btn ui-btn-left ui-icon-home ui-btn-icon-notext ui-corner-all">'+ctr.getPageResource("global","home")+'</a><h1>'+ctr.getPageResource("home","header")+'</h1><a href="#treeConfigPanel" class="ui-btn ui-btn-right ui-icon-gear ui-btn-icon-notext ui-corner-all">'+ctr.getPageResource("global","settings")+'</a></div>');
    else $(container).prepend('<div data-role="header" data-position="fixed"><a href="#startPage" class="ui-btn ui-btn-left ui-icon-home ui-btn-icon-notext ui-corner-all">'+ctr.getPageResource("global","home")+'</a><h1>'+ctr.getPageResource("home","header")+'</h1><a href="#contactPage" class="ui-btn ui-btn-right ui-icon-info ui-btn-icon-notext ui-corner-all">'+ctr.getPageResource("global","contact")+'</a></div>');
}

uiContentController.prototype.addTextHeader=function(container,text){
	$(container).prepend('<div data-role="header"><a href="#" data-rel="back" class="ui-btn ui-btn-left ui-icon-arrow-l ui-btn-icon-notext ui-corner-all">back</a><h1>'+text+'</h1></div>');
}

uiContentController.prototype.addMenu=function(container){
    var headerStr='<div data-role="navbar" class="mainNavbar" role="navigation">'+
			'<ul>'+
				'<li><a onclick="ctr.showListView()" href="#" class="listBtn" data-icon="custom">'+ctr.getPageResource("global","list")+'</a></li>'+
				'<li><a onclick="ctr.showTreeView(\'anc\')" href="#" class="ancBtn" data-icon="custom">'+ctr.getPageResource("global","ancestor")+'</a></li>'+
				'<li><a onclick="ctr.showTreeView(\'desc\')" href="#" class="descBtn" data-icon="custom">'+ctr.getPageResource("global","descendant")+'</a></li>'+
				'<li><a onclick="ctr.showFamilyView()" href="#" class="famBtn" data-icon="custom">'+ctr.getPageResource("global","family")+'</a></li>'+
				'<li><a onclick="ctr.showPersonView()" href="#" class="persBtn" data-icon="custom">'+ctr.getPageResource("global","person")+'</a></li>'+
			'</ul>'+
		'</div>';

	var header=$(container).find("div[data-role='header']");
	header.append($(headerStr));
}

uiContentController.prototype.addFooter=function(container){
    $(container).find("div[role='main']").after($("<div/>", {
        "data-role": "footer",
            //"data-position": "fixed",
            "data-theme": "a",
            "data-id":"footer"
    }).append($('<div data-role="navbar"><ul><li>YODA-Soft</li><li><select name="langISOSel" data-native-menu="false" data-mini="true" class="langISOSel" onchange="ctr.setLangISO(this.value)"><option value="en">EN</option><option value="de">DE</option></select></li></ul></div>')));
    $("#langISOSel").val(ctr.langISO );
}






uiContentController.prototype.addContactContent=function(container)
{
	var contentStr=''+
    		 'Contakt:'+
    		 '<ul data-role="listview" data-inset="true">'+
             '<li>Udo Lang</li>'+
             '<li>ud.lang@gmx.net</li>'+
             '</ul>'+
             'Documentation:'+
             '<ul data-role="listview" data-inset="true">'+
             '<li><a href="http://ancestor-webapp.appspot.com">http://ancestor-webapp.appspot.com</a></li>'+
             '</ul>';
	$(container).find("div[data-role='content']").html(contentStr);
	$(container).page();
}


uiContentController.prototype.blockUI=function()
{
	$.mobile.loading("show");
}

uiContentController.prototype.unblockUI=function()
{
	$.mobile.loading("hide");
}












