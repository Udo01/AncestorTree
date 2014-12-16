/*----uiFamilyController.js
|--------------------------------------------------------------------------------------------
| (c) 2011 Udo Lang
|     
|                                                                            
|					   
|     Last updated: June 20, 2011
|     Version: 1.0
\------------------------------------------------------------------------------------------*/

//constants

// global variables
var famViewObj = null;

uiFamCtr = function(pageContainer) {
	this.config = {
		orientation : "TopBottom",
		treeNodeEventHandler : null,
		
		boxWidth : 80,
		boxHeight : 90,
		boxGapX : 60,
		boxGapY : 40,
		boxFontSize : 12,
		boxFillOpacity : 0.8,
		boxFillColor : "rgb(230,230,230)",
		boxBorderWidth : 1,
		boxBorderColor : "rgb(50,50,50)",
		boxPadding : 5,
		boxTextMarginLeft : 4,
		boxTextMarginTop : 4,
		
		innerBoxTextMarginLeft : 4,
		innerBoxTextMarginTop : 4,
		innerBoxFontSize : 12,
		innerBoxFillOpacity : 0.8,
		innerBoxFillColor : "rgb(200,190,180)",
		innerBoxBorderWidth : 2,
		innerBoxBorderColor : "rgb(100,90,80)",
		innerBoxSelectFillColor : "rgb(160,150,140)",

		iconSize : 15,
		lineColor : "rgb(99,99,99)",
		lineWidth : 1,
		startPosX : 10,
		startPosY : 150
	}

	this.status = {
		maxX : 0,
		maxY : 0
	}

	this.selectedPerson = {
		id : null
	}

	this.version = "1.0";
	this.container = pageContainer;
	var contentStr=''+
		'<div id="familyContainerWrapper">'+
		'<div id="familyContainer"></div>'+
		'</div>';

	$(contentStr).appendTo(pageContainer.find("div[role='main']"));
	$(pageContainer).append($('<div data-role="popup" id="familyNodePopup" data-overlay-theme="a" data-theme="c" data-dismissible="false" back-btn="false" style="max-width:400px;" class="ui-corner-all"><h1>testereer</h1></div>'));
	this.familyContainer = document.getElementById("familyContainer");
	//$("#familyContainer" ).draggable();
}

uiFamCtr.prototype.setObjRef = function(objRef) {
	famViewObj = objRef;
}

uiFamCtr.prototype.addContent = function() {

	//clear content
	$(this.familyContainer).empty();
	this.selectedPerson.id = null;
	var containerWidth = $(window).width();

	var person = $(this.nodes).find("node[data-role='person']");
	var father = $(this.nodes).find("node[data-role='father']");
	var mother = $(this.nodes).find("node[data-role='mother']");

	var families = $(this.nodes).find("family");
	var childrenCount = 0;

	// father
	var fatherX = this.config.startPosX;
	var fatherY = this.config.startPosY;
	this.drawItem(fatherX, fatherY, father, ctr.getPageResource("global",
			"father"));

	if (fatherX > this.status.maxX)
		this.status.maxX = fatherX;
	if (fatherY > this.status.maxY)
		this.status.maxY = fatherY;

	// mother
	var motherX = this.config.startPosX;
	var motherY = this.config.startPosY + this.config.boxHeight
			+ this.config.boxGapY;
	this.drawItem(motherX, motherY, mother, ctr.getPageResource("global",
			"mother"));
	if (motherX > this.status.maxX)
		this.status.maxX = motherX;
	if (motherY > this.status.maxY)
		this.status.maxY = motherY;

	// person
	var personX = this.config.startPosX + this.config.boxWidth
			+ this.config.boxGapX;
	var personY = this.config.startPosY
			+ (this.config.boxHeight + this.config.boxGapY) / 2;
	this.drawItem(personX, personY, person, ctr.getPageResource("global",
			"person"));
	if (personX > this.status.maxX)
		this.status.maxX = personX;
	if (personY > this.status.maxY)
		this.status.maxY = personY;

	// button to add new family
	var newFamilyButton = this.drawNewFamilyButton(personX,personY + this.config.boxHeight,$(person).attr("data-idMainPerson"));

	// line to father
	this.drawLine(fatherX + this.config.boxWidth, fatherY
			+ this.config.boxHeight / 2, personX, personY
			+ this.config.boxHeight / 2, this.config.lineColor,
			this.config.lineWidth);
	// line to mother
	this.drawLine(motherX + this.config.boxWidth, motherY
			+ this.config.boxHeight / 2, personX, personY
			+ this.config.boxHeight / 2, this.config.lineColor,
			this.config.lineWidth);

	// families
	for ( var f = 0; f < families.length; f++) {
		// draw partner
		var partner = $(families[f]).find("node[data-role='partner']");

		var partnerX = personX;
		var partnerY = personY + (this.config.boxHeight + this.config.boxGapY)
				* (f + 1);
		var childrenNode = {
			x : personX + this.config.boxWidth + (0.2 + f * 0.1)
					* this.config.boxGapX,
			y : (personY + partnerY + this.config.boxHeight) / 2
		}
		this.drawItem(partnerX, partnerY, partner, ctr.getPageResource(
				"global", "partner"));

		// draw line from person to partner
		this.drawLine(childrenNode.x, personY + this.config.boxHeight
				* (1 - (f + 1) / (families.length + 1)), childrenNode.x,
				partnerY + this.config.boxHeight / 2, this.config.lineColor,
				this.config.lineWidth);
		this.drawLine(personX + this.config.boxWidth,
				personY + this.config.boxHeight
						* (1 - (f + 1) / (families.length + 1)),
				childrenNode.x, personY + this.config.boxHeight
						* (1 - (f + 1) / (families.length + 1)),
				this.config.lineColor, this.config.lineWidth);
		this.drawLine(partnerX + this.config.boxWidth, partnerY
				+ this.config.boxHeight / 2, childrenNode.x, partnerY
				+ this.config.boxHeight / 2, this.config.lineColor,
				this.config.lineWidth);

		if (partnerX > this.status.maxX)
			this.status.maxX = partnerX;
		if (partnerY > this.status.maxY)
			this.status.maxY = partnerY;

		// draw children
		var children = $(families[f]).find("node[data-role='child']");
		for ( var c = 0; c < children.length; c++) {
			var childX = personX + this.config.boxWidth + this.config.boxGapX;
			var childY = this.config.startPosY + childrenCount
					* (this.config.boxHeight + this.config.boxGapY);
			this.drawItem(childX, childY, children[c], ctr.getPageResource(
					"global", "child"));
			this.drawLine(childrenNode.x, childrenNode.y, childX, childY
					+ this.config.boxHeight / 2, this.config.lineColor,
					this.config.lineWidth);
			if (childX > this.status.maxX)
				this.status.maxX = childX;
			if (childY > this.status.maxY)
				this.status.maxY = childY;
			childrenCount++;
		}
		// draw icon to add children
		this.drawAddEmptyChildButton(childrenNode.x
				- this.config.iconSize / 2, childrenNode.y
				- this.config.iconSize / 2, $(person).attr(
				"data-idPerson"), f);
	}

	// set size
	this.setContainerSize();
}

uiFamCtr.prototype.setNodesXml = function(nodesXml) {
	this.nodes = nodesXml;
	// this.resetFamView();
}

uiFamCtr.prototype.resetFamView = function() {
	this.centerNode.id = null;
	this.selectedNode.id = null;
	this.familyContainer.style.left = 0 + "px";
	this.familyContainer.style.top = 0 + "px";
}

// draw node
uiFamCtr.prototype.drawItem = function(x, y, node, nodeName) {
	
	// draw outer box
	var outerBox=$("<div/>",{
	    "css" : {
	    	"position":"absolute",
	        "top":y,
	        "left":x,
	    	"z-index": "0",
		    "width":this.config.boxWidth,
		    "height":this.config.boxHeight,
	        "background-color" : this.config.boxFillColor,
	        "border": this.config.boxBorderWidth+"px solid "+this.config.boxBorderColor,
	        "opacity":this.config.boxFillOpacity,
	        "filter": "alpha(opacity = "+this.config.boxFillOpacity+")"
	    },
	    "click" : function(){
	        //alert("you just clicked me!!");
	    },
	    "data" : {
	       "foo" : "bar"
	    }
	});
	
	var outerText=$("<div/>",{
	    "css" : {
	    	"margin-left":this.config.boxTextMarginLeft,
	    	"margin-top":this.config.boxTextMarginTop,
	    	"font-size": this.config.boxFontSize
	    }
	});
	$(outerText).html(nodeName);
	outerText.appendTo(outerBox);	
	outerBox.appendTo(this.familyContainer);
	
	
	// emtpy node
	if ($(node).attr("id") == "-1") {
		// draw button to add new person
		this.drawAddNewPersonButton(x+this.config.boxPadding,y+this.config.boxHeight*1/3, $(node).attr(
						"data-idMainPerson"), $(node).attr("data-role"),
				$(node).attr("data-familyPos"), $(node).attr("data-childPos"));
		// draw button to add existing person
		this.drawAddExistPersonButton(x+this.config.boxPadding,y+this.config.boxHeight*2/3, $(node).attr("data-idMainPerson"),
				$(node).attr("data-role"), $(node).attr("data-familyPos"), $(
						node).attr("data-childPos"));

		// draw remove button for empty partner
		var childLength = $(node).parent().find("node[data-role='child']").length;
		if ($(node).attr("data-role") == "partner" && childLength == 0) {
			this.drawDeleteEmptyFamilyButton(x+this.config.boxWidth-this.config.iconSize-this.config.boxBorderWidth, y+this.config.boxBorderWidth,
					$(node).attr(
					"data-idMainPerson"), $(node).attr("data-familyPos"));
		}
		// add remove button for empty child
		if ($(node).attr("data-role") == "child") {
			this.drawDeleteEmptyChildButton(x+this.config.boxWidth-this.config.iconSize-this.config.boxBorderWidth, y+this.config.boxBorderWidth,
					$(node).attr("data-idMainPerson"), $(node).attr("data-familyPos"), $(node).attr("data-childPos"));
		}
	} 
	else {
		// draw inner box
		var innerBox=$("<div/>",{
		    "id": "fvib" + $(node).attr("data-idPerson"),		    
			"css" : {
		    	"position":"absolute",
		        "top":y+(this.config.boxTextMarginTop+this.config.boxFontSize+this.config.boxPadding),
		        "left":x+this.config.boxPadding,
		    	"z-index": "0",
			    "width":this.config.boxWidth- (this.config.boxPadding * 2),
			    "height":this.config.boxHeight- (this.config.boxPadding + this.config.boxFontSize*2+this.config.boxTextMarginTop),
		        "background-color" : this.config.innerBoxFillColor,
		        "border": this.config.innerBoxBorderWidth+"px solid "+this.config.innerBoxBorderColor,
		        "font-size": this.config.innerBoxFontSize,
		        "opacity":this.config.innerBoxFillOpacity,
		        "filter": "alpha(opacity = "+this.config.innerBoxFillOpacity+")"
		    },
		});
        //add events
		$(innerBox).on('tap', {nodeID: $(node).attr("data-idPerson")}, function(event) {
			var id = event.data.nodeID;
			if (ctr.uiFamCtr.selectedPerson.id != null) {
				$("#fvib" + ctr.uiFamCtr.selectedPerson.id).css("background-color",ctr.uiFamCtr.config.innerBoxFillColor);
			}
			$("#fvib" + id).css("background-color",ctr.uiFamCtr.config.innerBoxSelectFillColor);
			ctr.uiFamCtr.selectedPerson.id = id;
			ctr.selectedPerson=ctr.dataCtr.getPerson($(node).attr("data-idPerson"));
        });
 
		$(innerBox).on('taphold', {nodeID: $(node).attr("data-idPerson")}, function(event) {
			var id = event.data.nodeID;
			ctr.uiFamCtr.openFamilyNodePopup(id);
        });

		// add deleteIcon for person
		this.drawDeletePersonDialogButton(x+this.config.boxWidth-this.config.iconSize-this.config.boxBorderWidth, y+this.config.boxBorderWidth, $(node).attr("data-idMainPerson"), $(node).attr("data-idPerson"), $(node).attr("data-role"));
		
		var t = 0;
		var innerText="";
		while ($(node).attr("Text" + t) != null) {
			innerText+=$(node).attr("Text" + t)+"<br/>";
			t++;
		}
		$(innerBox).html(innerText);
		innerBox.appendTo(this.familyContainer);		
	}

	}

// draw line
uiFamCtr.prototype.drawLine = function(x1, y1, x2, y2, lineColor, lineWidth) {

	var top;
	var left;
	var width;
	var height;

	top=y1;
	left=x1+2;
	height=0;
	
    width = Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1))-2;

    if(x2==x1){
	    if(y2>y1)angle= 90;
	    if(y2<y1)angle= -90;
    }
    else{
    	angle = 180 / 3.14 * Math.atan((y2-y1)/(x2-x1));  
    }
    
	var line=$("<div/>",{
		"css" : {
	    	"position":"absolute",
	        "top":top,
	        "left":left,
	    	"z-index": 0,
		    "width":width,
		    "height":height,
	        "border": lineWidth+"px solid "+lineColor,
	        "-webkit-transform-origin": "top left",
	    	"-moz-transform-origin": "top left",
	    	"-o-transform-origin": "top left",
	    	"-ms-transform-origin": "top left",
	    	"transform-origin": "top left",
	    },
	});

	$(line)
    .css('-webkit-transform', 'rotate(' + angle + 'deg)')
    .css('-moz-transform', 'rotate(' + angle + 'deg)')
    .css('-o-transform', 'rotate(' + angle + 'deg)')
    .css('-ms-transform', 'rotate(' + angle + 'deg)')
    .css('transform', 'rotate(' + angle + 'deg)');

	line.appendTo(this.familyContainer);
}

// button to add new person
uiFamCtr.prototype.drawAddNewPersonButton = function(x, y,idMainPerson, dataRole, familyPos, childPos) {
	var button=$("<span/>",{
		"title":"add new person",
	    "css" : {
	    	"position":"absolute",
	    	"display":"inline",
	        "top":y,
	        "left":x,
	    	"z-index": 1000,
	    	"cursor":"pointer",
	    	"font-size": this.config.boxFontSize
	    },
	    "click" : function(event){
			ctr.showAddNewPersonDialog(idMainPerson, dataRole, familyPos,childPos);
			event.stopPropagation();
	    }
	});	
	$(button).html(ctr.getPageResource("global", "person"));
	
	// draw icon
	var icon=$("<img/>",{
		"src":"/icons/plus.png",
		"alt":"add new person",
		"title":"add new person",
	    "css" : {
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
			"display:":"inline"
	    }
	});	
	icon.appendTo(button);
	button.appendTo(this.familyContainer);
}

// button to add existing person
uiFamCtr.prototype.drawAddExistPersonButton = function(x, y,idMainPerson, dataRole, familyPos, childPos) {
	var button=$("<span/>",{
		"title":"add exist person",
	    "css" : {
	    	"position":"absolute",
	    	"display":"inline",
	        "top":y,
	        "left":x,
	    	"z-index": 1000,
	    	"cursor":"pointer",
	    	"font-size": this.config.boxFontSize
	    },
	    "click" : function(event){
			ctr.showAddExistPersonDialog(idMainPerson, dataRole, familyPos,childPos);
			event.stopPropagation();
	    }
	});	
	$(button).html(ctr.getPageResource("family", "select"));
	
	// draw icon
	var icon=$("<img/>",{
		"src":"/icons/plus.png",
		"alt":"add exist person",
		"title":"add exist person",
	    "css" : {
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
			"display:":"inline"
	    }
	});	
	icon.appendTo(button);
	button.appendTo(this.familyContainer);
}

// button to delete empty family with empty partner
uiFamCtr.prototype.drawDeleteEmptyFamilyButton = function(x, y,idPerson, familyPos) {
	// draw icon
	var icon=$("<img/>",{
		"src":"/icons/delete.png",
		"alt":"",
		"title":"delete person",
	    "css" : {
	    	"position":"absolute",
	        "top":y,
	        "left":x,
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
	    	"cursor":"pointer"
	    },
	    "click" : function(event){
			ctr.deleteEmptyFamily(idPerson, familyPos);
			ctr.showFamilyView();
			event.stopPropagation();
	    }
	});	
	icon.appendTo(this.familyContainer);
}

// button to delete empty child
uiFamCtr.prototype.drawDeleteEmptyChildButton = function(x, y,idMainPerson, familyPos, childPos) {
	var icon=$("<img/>",{
		"src":"/icons/delete.png",
		"alt":"",
		"title":"delete person",
	    "css" : {
	    	"position":"absolute",
	        "top":y,
	        "left":x,
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
	    	"cursor":"pointer"
	    },
	    "click" : function(event){
			ctr.deleteEmptyChild(idMainPerson, familyPos, childPos);
			ctr.showFamilyView();
			event.stopPropagation();
	    }
	});	

	icon.appendTo(this.familyContainer);
}

// button to show dialog to delete or remove person
uiFamCtr.prototype.drawDeletePersonDialogButton = function(x, y,idMainPerson, idPerson, dataRole) {
	// draw icon
	var icon=$("<img/>",{
		"src":"/icons/delete.png",
		"alt":"",
		"title":"delete person",
	    "css" : {
	    	"position":"absolute",
	        "top":y,
	        "left":x,
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
	    	"cursor":"pointer"
	    },
	    "click" : function(event){
			ctr.showRemovePersonDialog(idMainPerson, idPerson, dataRole);
			event.stopPropagation();
	    }
	});	
	icon.appendTo(this.familyContainer);
}

uiFamCtr.prototype.drawAddEmptyChildButton = function(x, y,idMainPerson, familyPos) {
	// draw icon
	var icon=$("<img/>",{
		"src":"/icons/plus.png",
		"alt":"",
		"title":"add person",
	    "css" : {
	    	"position":"absolute",
	        "top":y,
	        "left":x,
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
	    	"cursor":"pointer"
	    },
	    "click" : function(event){
			ctr.addEmptyChild(idMainPerson, familyPos);
			event.stopPropagation();
			ctr.showFamilyView();
			event.stopPropagation();
	    }
	});	
	icon.appendTo(this.familyContainer);
}

uiFamCtr.prototype.drawNewFamilyButton = function(x, y, idMainPerson) {
	var familyBox=$("<div/>",{
	    "css" : {
	    	"position":"absolute",
	        "top":y,
	        "left":x,
	    	"z-index": "0",
		    "width":this.config.boxWidth,
		    "height":this.config.boxHeight/3,
	        "background-color" : this.config.boxFillColor,
	        "border": this.config.boxBorderWidth+"px solid "+this.config.boxBorderColor,
	        "opacity":this.config.boxFillOpacity,
	        "filter": "alpha(opacity = "+this.config.boxFillOpacity+")"
	    }
	});
	
	var button=$("<span/>",{
	    "css" : {
	    	"cursor":"pointer",
	    	"font-size": this.config.boxFontSize
	    },
	    "click" : function(event){
			ctr.addFamily(idMainPerson);
			ctr.showFamilyView();
	    }
	});	
	$(button).html(ctr.getPageResource("global", "family"));
	
	// draw icon
	var icon=$("<img/>",{
		"src":"/icons/plus.png",
		"alt":ctr.getPageResource("global", "family"),
		"title":ctr.getPageResource("global", "family"),
	    "css" : {
	        "width":ctr.uiFamCtr.config.iconSize,
	        "height":ctr.uiFamCtr.config.iconSize,
	    	"z-index": 1000,
			"display:":"inline"
	    }
	});	
	icon.appendTo(button);
	button.appendTo(familyBox);
	familyBox.appendTo(this.familyContainer);	
}

// set the size of the svg-container
uiFamCtr.prototype.setContainerSize = function() {
	var totalWidth = this.status.maxX + this.config.boxWidth
			+ this.config.boxGapY;
	var totalHeight = this.status.maxY + this.config.boxHeight
			+ this.config.boxGapX;
	this.familyContainer.style.width = totalWidth + "px";
	this.familyContainer.style.height = totalHeight + "px";
}

uiFamCtr.prototype.addRemovePersonDialog = function(container,idMainPerson, idPerson,dataRole) {
	var content=$(container).find("div[role='main']");

	var contentStr = '<div data-role="fieldcontain">'
			+ '<div><h3>'
			+ ctr.getPageResource("removePersonDlg", "attention")
			+ '</h3></div>'
			+ '<button id="deletePersonBtn" class="ui-btn">'
			+ ctr.getPageResource("removePersonDlg", "removePerson")
			+ '</button>'
			+ '<button id="deletePersonConnectionBtn" class="ui-btn">'
			+ ctr.getPageResource("removePersonDlg", "removePersonFamily")
			+ '</button>'
			+ '<a href="#" class="ui-btn" data-rel="back">'
			+ ctr.getPageResource("global", "cancel") + '</button>' + '</a>';

	$(content).html(contentStr);
	$(content).enhanceWithin();	

	$('#deletePersonBtn').bind('click', function(event, ui) {
		ctr.deletePerson(idPerson);
		//reset current person if it was deleted
		if (ctr.currentPerson.id == idPerson) {
			ctr.setCurrentPerson(null);
			ctr.showListView();
		} else
			ctr.showFamilyView();
	});
	$('#deletePersonConnectionBtn').bind('click', function(event, ui) {
		ctr.deleteConnection(idMainPerson, idPerson, dataRole);
		//reset current person if it was unconnected
		if (ctr.currentPerson.id == idPerson) {
			ctr.setCurrentPerson(null);
			ctr.showListView();
		} else
			ctr.showFamilyView();
	});
}

uiFamCtr.prototype.addNewPersonDialog = function(container,idMainPerson, dataRole,familyPos, childPos) {
	var person = ctr.getPerson(idMainPerson);
	var newPerson = {};
	var content=$(container).find("div[role='main']");
	content.empty();
	
	if (dataRole == "father")
		newPerson.gender = "m";
	if (dataRole == "mother")
		newPerson.gender = "f";
	if (dataRole == "partner" && person.gender == "m")
		newPerson.gender = "f";
	if (dataRole == "partner" && person.gender == "f")
		newPerson.gender = "m";

	var contentStr = '<div data-role="fieldcontain">'
			+ '<h4>'
			+ ctr.getDataRole(dataRole).text()
			+ ' '
			+ ctr.getPageResource("addPersonDlg", "of")
			+ ' '
			+ person.Name.givn
			+ ' '
			+ person.Name.surn
			+ '</h4>'
			+ '<div data-role="fieldcontain" style="margin-top:0px; padding-top:0px">'
			+ '<label for="NewPerson_Name_givn">'
			+ ctr.getPageResource("global", "nameGvn")
			+ ':</label>'
			+ '<input name="NewPerson_Name_givn" type="text" id="NewPerson_Name_givn" value=""/>'
			+ '<label for="NewPerson_Name_surn">'
			+ ctr.getPageResource("global", "nameSurn")
			+ ':</label>'
			+ '<input name="NewPerson_Name_surn" type="text" id="NewPerson_Name_surn" value="" />'
			+ '<label for="NewPerson_Name_maid">'
			+ ctr.getPageResource("global", "nameMaid")
			+ ':</label>'
			+ '<input name="NewPerson_Name_maid" type="text" id="NewPerson_Name_maid" value="" />'
			+ '</div>' + '<h3>' + ctr.getPageResource("global", "birth")
			+ ':</h3>' + '<div class="ui-grid-b">'
			+ '<div class="ui-block-a" style="padding-right:7px; width:60px">'
			+ '<label for="NewPerson_Birth_day">'
			+ ctr.getPageResource("global", "day") + ':</label>'
			+ '<input type="number" id="NewPerson_Birth_day" value=""/>'
			+ '</div>'
			+ '<div class="ui-block-b" style="padding-right:7px; width:60px">'
			+ '<label for="NewPerson_Birth_month">'
			+ ctr.getPageResource("global", "month") + ':</label>'
			+ '<input type="number" id="NewPerson_Birth_month" value=""/>'
			+ '</div>'
			+ '<div class="ui-block-c" style="padding-right:7px; width:60px">'
			+ '<label for="NewPerson_Birth_year">'
			+ ctr.getPageResource("global", "year") + ':</label>'
			+ '<input type="number" id="NewPerson_Birth_year" value=""/>'
			+ '</div>' + '</div>' + '<h3>'
			+ ctr.getPageResource("global", "gender") + ':</h3>';
 
	contentStr +='<div id="gender_CG_NP" data-role="controlgroup" data-mini="true">'
	+ '<legend>'
	+ ctr.getPageResource("global", "gender")
	+ '</legend>'
	+ '<input id="personGenderMale_NP" name="radio-choice_NP"  value="m" type="radio">'
	+ '<label for="personGenderMale_NP">'
	+ ctr.getPageResource("global", "male")
	+ '</label>'
	+ '<input id="personGenderFemale_NP" name="radio-choice_NP" value="f" type="radio">'
	+ '<label for="personGenderFemale_NP">'
	+ ctr.getPageResource("global", "female")
	+ '</label>';
	contentStr += '<button id="addNewPersonBtn" class="ui-btn">'
		+ ctr.getPageResource("addPersonDlg", "addPerson")
		+ '</button>'
		+ '<a href="#" class="ui-btn" data-rel="back">'
		+ ctr.getPageResource("global", "cancel") + '</a>' + '</div>';
	
	$(content).append(contentStr);
	
	//init gender
	$("#gender_CG_NP").controlgroup({
		defaults : true
	});
	if (dataRole == "child") {
		//$("#gender_CG_NP").val("m");
		$("input#personGenderMale_NP").attr("checked", "checked");
	}
	else {
		if (newPerson.gender == "m") {
			$("input#personGenderMale_NP").attr("checked", "checked");
		}
		if (newPerson.gender == "f") {
			$("input#personGenderFemale_NP").attr("checked", "checked");
		}
		$("input#personGenderMale_NP").attr("disabled", "disabled");
		$("input#personGenderFemale_NP").attr("disabled", "disabled");
	}
	
	//refresh controls
	$("#gender_CG_NP").controlgroup("refresh");
	$(content).find("input").textinput();
	$(content).find("textarea").textinput();

	$('#addNewPersonBtn')
			.bind(
					'click',
					function(event, ui) {
						var newPerson = {
							gender : null,
							Name : {
								givn : null,
								surn : null
							},
							Birth : {
								day : null,
								month : null,
								year : null
							}
						};
						newPerson.gender = $('input[name="NewPerson_gender"]:checked').val();
						newPerson.Name.givn = $("#NewPerson_Name_givn").val();
						newPerson.Name.surn = $("#NewPerson_Name_surn").val();
						newPerson.Name.maid = $("#NewPerson_Name_maid").val();
						newPerson.Birth.day = $("#NewPerson_Birth_day").val();
						newPerson.Birth.month = $("#NewPerson_Birth_month").val();
						newPerson.Birth.year = $("#NewPerson_Birth_year").val();

						ctr.addNewPersonToPerson(newPerson, idMainPerson,
								dataRole, familyPos, childPos);
						ctr.showFamilyView();
					});
}

uiFamCtr.prototype.addExistPersonDialog = function(container,personList,idMainPerson, dataRole, familyPos, childPos) {
	var person = ctr.getPerson(idMainPerson);
	var content=$(container).find("div[role='main']");
	content.empty();

	var contentStr = '<div data-role="fieldcontain">'
			+ '<h4>'
			+ ctr.getDataRole(dataRole).text()
			+ ' '
			+ ctr.getPageResource("global", "of")
			+ ' '
			+ person.Name.givn
			+ ' '
			+ person.Name.surn
			+ '</h4>'
			+ '<div data-role="fieldcontain" style="margin-top:0px; padding-top:0px">'
			+ '</div>'
			+ '<div data-role="fieldcontain">'
			+ '<hr/><br/>'
			+ '<ul data-role="listview" id="addExistPersonListLV" data-split-icon="gear"></ul>';
	if (personList.length == 0) {
		contentStr += '<h3>'
				+ ctr.getPageResource("family", "noPersonAvailable") + '</h3>';
	}
	contentStr += '</div>';
	content.append(contentStr);

	// add list items
	$("#addExistPersonListLV" ).listview({ defaults: true });
	var listContainer = $("#addExistPersonListLV");
	var str = '';

	for ( var i = 0; i < personList.length; i++) {
		var nameStr = '';
		if (personList[i].Name.surn != null && personList[i].Name.surn != '')
			nameStr += personList[i].Name.surn + ' ';
		if (personList[i].Name.maid != null && personList[i].Name.maid != '')
			nameStr += '(' + personList[i].Name.maid + ') ';
		if (personList[i].Name.givn != null && personList[i].Name.givn != '')
			nameStr += personList[i].Name.givn;

		funcStr = "\'" + personList[i].id + "\',\'" + idMainPerson + "\',\'"
				+ dataRole + "\',\'" + familyPos + "\',\'" + childPos + "\'";
		str += '<li><a onclick="ctr.addExistPersonToPerson(' + funcStr
				+ ');ctr.showFamilyView()" href="#" data-id="'
				+ personList[i].id + '">' + nameStr + ' '
				+ personList[i].Birth.Date.year + '</a>' + '</li>';
	}
	listContainer.append(str);
	listContainer.listview("refresh");
}


uiFamCtr.prototype.openFamilyNodePopup=function(nodeID)
{
	var popup= $("#familyNodePopup");
    var contentStr= 
    	'<div data-role="header" class="ui-corner-top">'+
    	'<a href="#" data-rel="back" class="ui-btn ui-btn-left ui-icon-delete ui-btn-icon-notext ui-corner-all">Close</a>'+
    '</div>'+
    '<div  role="main" class="ui-content">'+
    	'<ul id="selActionPerson_LV_FV" data-role="listview" data-inset="true" style="min-width:210px;">'+
    		'<li data-role="divider">'+ctr.getPageResource("treeNodePopup","chooseAction")+'</li>'+
    		'<li><a id="fc_setRootPersonBtn" href="#" class="ui-btn">'+ctr.getPageResource("treeNodePopup","setRoot")+'</a></li>'+
    		'<li><a id="fc_editPersonBtn" href="#" class="ui-btn">'+ctr.getPageResource("treeNodePopup","editPerson")+'</a></li>';
	
	contentStr+='</ul>'+
        '<a href="#" class="ui-btn" data-inline="true" data-rel="back">Cancel</a>'+
    '</div>';

    $(popup).html($(contentStr));
    $(popup).popup({ dismissible:true, history: false, history:false });
    $(popup).popup( "open" );
    $("#selActionPerson_LV_FV").listview();
    
   $("#fc_setRootPersonBtn").on('tap', {nodeID: nodeID}, function(event) {
    	ctr.setCurrentPerson(event.data.nodeID);
		ctr.showFamilyView();   
    	});
    $("#fc_editPersonBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setSelectedPerson(event.data.nodeID);
		ctr.showPersonView();  
    	});   
    
}



// doubletap????
// $('#myDiv').mousedown(function() {
// var d = new Date;
// a = d.getTime();
// });

// $('#myDiv').mouseup(function() {
// var d = new Date;
// b = d.getTime();

// if (b-a > 500) {
// alert('This has been a longtouch!');
// }
// });

