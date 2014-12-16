uiPersonController = function(pageContainer) {
	this.container = pageContainer;

	this.editPerson;
	this.editDocPos;
	this.sdExplorer;
	// init events
	$('#personPage').on('pagehide', function(event, ui) {
		if (ctr.dataContainer != null) {
			ctr.uiPersonCtr.savePersonData();
		}
	});
	

	uiPersonController.prototype.addContent = function(person) {
		uiPersonController.editPerson=person;
		var content = $(this.container).find("div[role='main']");
		$(content).empty();
		var contentStr = ''
				
				+ '<div class="ui-field-contain" style="margin-top:0px; padding-top:0px">'
				+ '<label for="Name_givn">'
				+ ctr.getPageResource("global", "nameGvn")
				+ ':</label>'
				+ '<input type="text" id="Name_givn" value=""/>'
				+ '<label for="Name_surn">'
				+ ctr.getPageResource("global", "nameSurn")
				+ ':</label>'
				+ '<input type="text" name="Name_surn" id="Name_surn" value="" />'
				+ '<label for="Name_maid">'
				+ ctr.getPageResource("global", "nameMaid")
				+ ':</label>'
				+ '<input type="text" name="Name_maid" id="Name_maid" value="" />';

		contentStr += '<div id="gender_CG_PV" data-role="controlgroup" data-mini="true">'
				+ '<legend>'
				+ ctr.getPageResource("global", "gender")
				+ '</legend>'
				+ '<input name="radio-choice-v-6" id="personGenderMale" value="m" type="radio">'
				+ '<label for="personGenderMale">'
				+ ctr.getPageResource("global", "male")
				+ '</label>'
				+ '<input name="radio-choice-v-6" id="personGenderFemale" value="f" type="radio">'
				+ '<label for="personGenderFemale">'
				+ ctr.getPageResource("global", "female")
				+ '</label>'
				+ '</div>'
				+'</div>';
		contentStr += '<div id="collapsContainer_PV" data-role="collapsibleset" data-theme="a" data-content-theme="a">'
				+'</div>';

		$(content).append($(contentStr));
		
		// init name
		$(content).find("#Name_givn").val(person.Name.givn);
		$(content).find("#Name_surn").val(person.Name.surn);
		$(content).find("#Name_maid").val(person.Name.maid);
		
		// init gender
		$("#gender_CG_PV").controlgroup({
			defaults : true
		});
		// var gender=person.gender=="m"? "male":"female";
		if (ctr.hasChildren(person.id)) {
			$("input#personGenderMale").attr("disabled", "disabled");
			$("input#personGenderFemale").attr("disabled", "disabled");
		}
		if (person.gender == "m")
			$("input#personGenderMale").attr("checked", "checked");
		if (person.gender == "f")
			$("input#personGenderFemale").attr("checked", "checked");
		$("#gender_CG_PV").controlgroup("refresh");
		//this.editPerson=person;

		$("#collapsContainer_PV").collapsibleset();
		// add events
		this.addEvents(person);
		// add infos
		 this.addInfos(person);
		// add sources
		this.addDocs(person);
		// render media
		//$('.media').media({ width: 200,height:'auto', autoplay: true });
		
		//refresh controls
		$(content).find("input").textinput();
		$(content).find("textarea").textinput();
	}

	uiPersonController.prototype.createNewEventView = function(container,
			person) {
		var types = ctr.getEventTypesList();
		var content = container.find('div[role="main"]');
		content.empty();

		var newEventString = ''
				+ '<div data-role="fieldcontain">'
				+ '<select id="eventTypeSelect" data-native-menu="false" data-theme="c">'
				+ '<option>' + ctr.getPageResource("newEventDlg", "selectType")
				+ '</option>';
		for ( var i = 0; i < types.length; i++) {
			newEventString += '<option value="'
					+ $(types[i]).parent().attr("name") + '">'
					+ $(types[i]).find("name").text() + '</option>';
		}
		newEventString += '</select>'
				+ '</div>'
				+ '<div class="ui-grid-b">'
				+ '<div class="ui-block-a" style="padding-right:7px; width:60px">'
				+ '<label for="newEvent_Date_day">'
				+ ctr.getPageResource("global", "day")
				+ ':</label>'
				+ '<input type="number" id="newEvent_Date_day" value=""/>'
				+ '</div>'
				+ '<div class="ui-block-b" style="padding-right:7px; width:60px">'
				+ '<label for="newEvent_Date_month">'
				+ ctr.getPageResource("global", "month")
				+ ':</label>'
				+ '<input type="number" id="newEvent_Date_month" value=""/>'
				+ '</div>'
				+ '<div class="ui-block-c" style="padding-right:7px; width:60px">'
				+ '<label for="newEvent_Date_year">'
				+ ctr.getPageResource("global", "year")
				+ ':</label>'
				+ '<input type="number" id="newEvent_Date_year" value=""/>'
				+ '</div>'
				+ '</div>'
				+ '<div>'
				+ '<label for="newEvent_Place_street">'
				+ ctr.getPageResource("global", "street")
				+ ':</label>'
				+ '<input type="text" id="newEvent_Place_street" value=""/>'
				+ '</div>'
				+ '<div>'
				+ '<label for="newEvent_Place_zip">'
				+ ctr.getPageResource("global", "zip")
				+ ':</label>'
				+ '<input type="text" id="newEvent_Place_zip" value=""/>'
				+ '</div>'
				+ '<div>'
				+ '<label for="newEvent_Place_city">'
				+ ctr.getPageResource("global", "city")
				+ ':</label>'
				+ '<input type="text" name="place" id="newEvent_Place_city" value=""/>'
				+ '</div>'
				+ '<div>'
				+ '<label for="newEvent_Place_country">'
				+ ctr.getPageResource("global", "country")
				+ ':</label>'
				+ '<input type="text" id="newEvent_Place_country" value=""/>'
				+ '</div>'
				+ '<div>'
				+ '<label for="newEvent_Text">'
				+ ctr.getPageResource("global", "note")
				+ ':</label>'
				+ '<textarea cols="40" rows="8" id="newEvent_Text"></textarea>'
				+ '<a id="saveEventBtn" href="#personPage" class="ui-btn">'
				+ ctr.getPageResource("global", "ok")
				+ '</a>'
				+ '<a href="#personPage" class="ui-btn" data-rel="back">'
				+ ctr.getPageResource("global", "cancel") + '</a>' + '</div>';
		$(content).append(newEventString);
		//refresh controls
		$(content).find("input").textinput();
		$(content).find("textarea").textinput();
		$("#eventTypeSelect").selectmenu();
		
		$('#saveEventBtn').on('tap', function(event, ui) {
			ctr.uiPersonCtr.saveNewEvent();
		});
	}

	uiPersonController.prototype.createNewDocView = function(container, person) {
		var types = ctr.getDocumentTypesList();
		var content = container.find('div[role="main"]');
		content.empty();

		var newDocString = ''
				+ '<div data-role="fieldcontain">'
				+ '<select id="docTypeSelect" data-native-menu="false">'
				+ '<option>' + ctr.getPageResource("newDocDlg", "selectType")
				+ '</option>';
		for ( var i = 0; i < types.length; i++) {
			newDocString += '<option value="'
					+ $(types[i]).parent().attr("name") + '">'
					+ $(types[i]).find("name").text() + '</option>';
		}
		newDocString += '</select>'
				+ '<label for="newDoc_title">'
				+ ctr.getPageResource("person", "docTitle")
				+ ':</label>'
				+ '<input type="text" id="newDoc_title" value=""/>'
				+ '<label for="newDoc_resource">'
				+ ctr.getPageResource("person", "docResource")
				+ ':</label>'
				+ '<input type="text" id="newDoc_resource" value=""/>'
				+ '<label for="newDoc_thumbnail">'
				+ ctr.getPageResource("global", "thumbnail")
				+ ':</label>'
				+ '<input type="text" id="newDoc_thumbnail" value=""/>'
				+' <fieldset class="ui-grid-b">'
				+' <div class="ui-block-a">'
				+ '<label for="newDoc_Date_day">'
				+ ctr.getPageResource("global", "day")
				+ ':</label>'
				+ '<input type="number" id="newDoc_Date_day" value=""/>'
				+' </div>'
				+' <div class="ui-block-b">'
				+ '<label for="newDoc_Date_month">'
				+ ctr.getPageResource("global", "month")
				+ ':</label>'
				+ '<input type="number" id="newDoc_Date_month" value=""/>'
				+' </div>'
				+' <div class="ui-block-c">'
				+ '<label for="newDoc_Date_year">'
				+ ctr.getPageResource("global", "year")
				+ ':</label>'
				+ '<input type="number" id="newDoc_Date_year" value=""/>'
				+' </div>'
				+' </fieldset>'
				+ '<label for="newDoc_Place_street">'
				+ ctr.getPageResource("global", "street")
				+ ':</label>'
				+ '<input type="text" id="newDoc_Place_street" value=""/>'
				+ '<label for="newDoc_Place_zip">'
				+ ctr.getPageResource("global", "zip")
				+ ':</label>'
				+ '<input type="text" id="newDoc_Place_zip" value=""/>'
				+ '<label for="newDoc_Place_city">'
				+ ctr.getPageResource("global", "city")
				+ ':</label>'
				+ '<input type="text" name="place" id="newDoc_Place_city" value=""/>'
				+ '<label for="newDoc_Place_country">'
				+ ctr.getPageResource("global", "country")
				+ ':</label>'
				+ '<input type="text" id="newDoc_Place_country" value=""/>'
				+ '<label for="newDoc_Text">'
				+ ctr.getPageResource("global", "note")
				+ ':</label>'
				+ '<textarea cols="40" rows="8" id="newDoc_Text"></textarea>'
				+ '<a id="saveDocBtn" href="#" class="ui-btn">'
				+ ctr.getPageResource("global", "ok")
				+ '</a>'
				+ '<a href="#personPage" class="ui-btn" data-rel="back">'
				+ ctr.getPageResource("global", "cancel") 
				+ '</a>' 
				+ '</div>';
		$(content).html(newDocString);
		$(container).page("destroy").page();

		$('#saveDocBtn').on('tap', function(event, ui) {
			ctr.uiPersonCtr.saveNewDoc();
		});
		$(".newDocOpenSDBtn")
				.on(
						"tap",
						function(event, data) {

							$("#newDocSDPopupDiv").popup("open");
							ctr.uiPersonCtr.sdExplorer = new SDExplorer(
									$("#newDocSDExplorerContainer"));
							ctr.uiPersonCtr.sdExplorer
									.setObjRef(ctr.uiPersonCtr.sdExplorer);
							ctr.uiPersonCtr.sdExplorer.config.APP_CLIENT_ID = ctr
									.getAppSetting("SD_APP_CLIENT_ID");
							ctr.uiPersonCtr.sdExplorer.config.REDIRECT_URL = ctr
									.getAppSetting("SD_REDIRECT_URL");
							ctr.uiPersonCtr.sdExplorer.config.Init_files_path = "/me/skydrive/files";
							ctr.uiPersonCtr.sdExplorer.config.FileTypes = [
									"file", "audio", "video", "photo" ];
							ctr.uiPersonCtr.sdExplorer.config.FolderTypes = [
									"folder", "album" ];
							ctr.uiPersonCtr.sdExplorer.config.ShowSubfolder = true;
							ctr.uiPersonCtr.sdExplorer.config.SDFileClickEventHandler = "ctr.uiPersonCtr.addResourceFile";

							ctr.uiPersonCtr.sdExplorer.start();
						});
	}

	uiPersonController.prototype.createNewInfoView = function(container, person) {
		var types = ctr.getInfoTypesList();

		var content = container.find('div[role="main"]');
		content.empty();

		var newInfoString = ''
				+ '<div></div>'
				+ '<div data-role="fieldcontain">'
				+ '<select id="infoTypeSelect" data-native-menu="false" data-theme="c">'
				+ '<option>' + ctr.getPageResource("newInfoDlg", "selectType")
				+ '</option>';
		for ( var i = 0; i < types.length; i++) {
			newInfoString += '<option value="'
					+ $(types[i]).parent().attr("name") + '">'
					+ $(types[i]).find("name").text() + '</option>';
		}
		newInfoString += '</select>'
				+ '</div>'
				+ '<div>'
				+ '<textarea cols="40" rows="8" id="newInfo_Text"></textarea>'
				+ '<a id="saveInfoBtn" href="#personPage" data-role="button" data-theme="c">'
				+ ctr.getPageResource("global", "ok")
				+ '</a>'
				+ '<a href="#personPage" data-role="button" data-rel="back" data-theme="c">'
				+ ctr.getPageResource("global", "cancel") + '</a>' + '</div>';

		$(content).html(newInfoString);
		$(container).page("destroy").page();

		$('#saveInfoBtn').on('tap', function(event, ui) {
			ctr.uiPersonCtr.saveNewInfo();
		});
	}


	uiPersonController.prototype.addEvents = function(person) {
		var eventList = person.Events;
		// header for events
		var eventString = '<fieldset data-role="collapsible">'
			+ '<h3>'
			+ ctr.getPageResource("person", "events")
			+ ' ('
			+ eventList.length
			+ ')</h3>'
			+ '<button class="ui-btn" onclick="ctr.createNewEventView(\''
			+ person.id
			+ '\')">'
			+ ctr.getPageResource("person", "newTimeInfo")
			+ '</button>'
				+ '<div id="eventCollapse" data-role="collapsibleset" data-theme="a" data-content-theme="a">'
				+ '</div>'
				+ '</fieldset>';
		$("#collapsContainer_PV").append(eventString).collapsibleset("refresh");
		$("#eventCollapse").collapsibleset();

		// group list by year
		function cmp(x, y) { // generic comparison function
			return x > y ? 1 : x < y ? -1 : 0;
		}
		eventList.sort(function(a, b) {
			return [ cmp(a.Date.year, b.Date.year) ] < [ cmp(b.Date.year,
					a.Date.year) ] ? -1 : 1;
		});

		for ( var i = 0; i < eventList.length; i++) {

			eventString = '<fieldset data-role="collapsible" data-collapsed="true" style="border:solid 1px grey">'
					+ '<h3>'
					+ ctr.getEventType(eventList[i].name).find("name").text()
					+ ':</h3>'
					+' <button class="deleteEvent ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-delete" data-index="'
					+ i
					+ '">'
					+ ctr.getPageResource("global", "delete")
					+ '</button>'
					+' <fieldset class="ui-grid-b">'
					+' <div class="ui-block-a">'
					+ '<label for="Event'
					+ i
					+ '_Date_day">'
					+ ctr.getPageResource("global", "day")
					+ ':</label>'
					+ '<input type="number" id="Event'
					+ i
					+ '_Date_day" value="'
					+ eventList[i].Date.day
					+ '"/>'
					+' </div>'
					+' <div class="ui-block-b">'
					+ '<label for="Event'
					+ i
					+ '_Date_month">'
					+ ctr.getPageResource("global", "month")
					+ ':</label>'
					+ '<input type="number" id="Event'
					+ i
					+ '_Date_month" value="'
					+ eventList[i].Date.month
					+ '"/>'
					+' </div>'
					+' <div class="ui-block-c">'
					+ '<label for="Event'
					+ i
					+ '_Date_year">'
					+ ctr.getPageResource("global", "year")
					+ ':</label>'
					+ '<input type="number" id="Event'
					+ i
					+ '_Date_year" value="'
					+ eventList[i].Date.year
					+ '"/>'
					+' </div>'
					+' </fieldset>'

					+ '<label for="Event'
					+ i
					+ '_Place_street">'
					+ ctr.getPageResource("global", "street")
					+ ':</label>'
					+ '<input type="text" id="Event'
					+ i
					+ '_Place_street" value="'
					+ eventList[i].Place.street
					+ '"/>'
					+ '<label for="Event'
					+ i
					+ '_Place_zip">'
					+ ctr.getPageResource("global", "zip")
					+ ':</label>'
					+ '<input type="text" id="Event'
					+ i
					+ '_Place_zip" value="'
					+ eventList[i].Place.zip
					+ '"/>'
					+ '<label for="Event'
					+ i
					+ '_Place_city">'
					+ ctr.getPageResource("global", "city")
					+ ':</label>'
					+ '<input type="text" name="place" id="Event'
					+ i
					+ '_Place_city" value="'
					+ eventList[i].Place.city
					+ '"/>'
					+ '<label for="Event'
					+ i
					+ '_Place_country">'
					+ ctr.getPageResource("global", "country")
					+ ':</label>'
					+ '<input type="text" id="Event'
					+ i
					+ '_Place_country" value="'
					+ eventList[i].Place.country
					+ '"/>'
					+ '<label for="Event'
					+ i
					+ '_Text">'
					+ ctr.getPageResource("global", "note")
					+ ':</label>'
					+ '<textarea cols="40" rows="8" id="Event'
					+ i
					+ '_Text">'
					+ eventList[i].Text
					+ '</textarea>'
					+ '</fieldset>';

			$("#eventCollapse").append(eventString).collapsibleset("refresh");
		}
		$('.deleteEvent').on('tap', function(event, data) {
			ctr.uiPersonCtr.removeEvent($(this).attr('data-index'));
		});
	}

	uiPersonController.prototype.addInfos = function(person) {
		// header for infos
		var infoString = '<fieldset data-role="collapsible">'
				+ '<h3>'
				+ ctr.getPageResource("person", "infos")
				+ ' ('
				+ person.Infos.length
				+ ')</h3>'
				+ '<button class="ui-btn" onclick="ctr.createNewInfoView(\''
				+ person.id
				+ '\')">'
				+ ctr.getPageResource("person", "newInfo")
				+ '</button>'
				+ '<div id="infoCollapse" data-role="collapsibleset" data-theme="a" data-content-theme="a">'
				+ '</div>'
				+ '</fieldset>';
		
		$("#collapsContainer_PV").append(infoString).collapsibleset("refresh");
		$("#infoCollapse").collapsibleset();

		for ( var i = 0; i < person.Infos.length; i++) {
			infoString = "<fieldset data-role='collapsible' data-collapsed='true' style='border:solid 1px grey'>"
					+ "<h3>"
					+ ctr.getInfoType(person.Infos[i].name).find('name').text()
					+ ":</h3>"
					+' <button class="deleteInfo ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-delete" data-index="'
					+ i
					+ '">'
					+ ctr.getPageResource("global", "delete")
					+ '</button>'
					+ "<textarea cols='40' rows='8' id='Info"
					+ i
					+ "_Text'>"
					+ person.Infos[i].Text
					+ "</textarea>"
					+ "</fieldset>";

			$("#infoCollapse").append(infoString).collapsibleset("refresh");
		}
		$('.deleteInfo').on('tap', function(event, data) {
			ctr.uiPersonCtr.removeInfo($(this).attr('data-index'));
		});
	}

	// todo change
	uiPersonController.prototype.addDocs = function(person) {
		var docList = person.Docs;
		// header for infos
		var docString = '<fieldset data-role="collapsible">'
				+ '<h3>'
				+ ctr.getPageResource("person", "docs")
				+ ' ('
				+ docList.length
				+ ')</h3>'
				+ '<button class="ui-btn" onclick="ctr.createNewDocView(\''
				+ person.id
				+ '\')">'
				+ ctr.getPageResource("person", "newDoc")
				+ '</button>' 
				+ '<div id="docCollapse" data-role="collapsibleset" data-theme="a" data-content-theme="a">'
				+ '</div>'
				+ '</fieldset>';
		$("#collapsContainer_PV").append(docString).collapsibleset("refresh");
		$("#docCollapse").collapsibleset();

		// group list by year
		function cmp(x, y) { // generic comparison function
			return x > y ? 1 : x < y ? -1 : 0;
		}
		docList.sort(function(a, b) {
			return [ cmp(a.Date.year, b.Date.year) ] < [ cmp(b.Date.year,
					a.Date.year) ] ? -1 : 1;
		});

		for ( var i = 0; i < docList.length; i++) {
			docString = '<fieldset data-role="collapsible" data-collapsed="true" style="border:solid 1px grey">'
					+ '<h3>'
					+ ctr.getDocumentType(docList[i].type).find('name').text()
					+ ':</h3>'
					+' <button class="deleteDoc ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-delete" data-index="'
					+ i
					+ '">'
					+ ctr.getPageResource("global", "delete")
					+ '</button>'
					+ '<label for="Doc'
					+ i
					+ '_title">'
					+ ctr.getPageResource("person", "docTitle")
					+ ':</label>'
					+ '<input type="text" id="Doc'
					+ i
					+ '_title" value="'
					+ docList[i].title
					+ '"/>'
					+ '<label for="Doc'
					+ i
					+ '_resource">'
					+ ctr.getPageResource("person", "docResource")
					+ ':</label>'
					+ '<input type="text" id="Doc'
					+ i
					+ '_resource" value="'
					+ docList[i].resource
					+ '"/>'
					+ '<label for="Doc'
					+ i
					+ '_thumbnail">'
					+ ctr.getPageResource("global", "thumbnail")
					+ ':</label>'
					+ '<input type="text" id="Doc'
					+ i
					+ '_thumbnail" value="'
					+ docList[i].thumbnail
					+ '"/>'
					+ '<a class="swipebox" href="'
					+ docList[i].resource
					+ '" title="'
					+ docList[i].title
					+ '">'
					+'<img src="'
					+ docList[i].thumbnail
					+ '" alt="image">'
					+ '</a>'
					+ '<label><h4>'
					+ ctr.getPageResource("global", "properties")
					+ ':</h4></label>'
					
					+' <fieldset class="ui-grid-b">'
					+' <div class="ui-block-a">'
					+ '<label for="Doc'
					+ i
					+ '_Date_day">'
					+ ctr.getPageResource("global", "day")
					+ ':</label>'
					+ '<input type="number" id="Doc'
					+ i
					+ '_Date_day" value="'
					+ docList[i].Date.day
					+ '"/>'
					+' </div>'
					+' <div class="ui-block-b">'
					+ '<label for="Doc'
					+ i
					+ '_Date_month">'
					+ ctr.getPageResource("global", "month")
					+ ':</label>'
					+ '<input type="number" id="Doc'
					+ i
					+ '_Date_month" value="'
					+ docList[i].Date.month
					+ '"/>'
					+' </div>'
					+' <div class="ui-block-c">'
					+ '<label for="Doc'
					+ i
					+ '_Date_year">'
					+ ctr.getPageResource("global", "year")
					+ ':</label>'
					+ '<input type="number" id="Doc'
					+ i
					+ '_Date_year" value="'
					+ docList[i].Date.year
					+ '"/>'
					+' </div>'
					+' </fieldset>'
					
					+ '<label for="Doc'
					+ i
					+ '_Place_street">'
					+ ctr.getPageResource("global", "street")
					+ ':</label>'
					+ '<input type="text" id="Doc'
					+ i
					+ '_Place_street" value="'
					+ docList[i].Place.street
					+ '"/>'
					+ '</div>'
					+ '<div>'
					+ '<label for="Doc'
					+ i
					+ '_Place_zip">'
					+ ctr.getPageResource("global", "zip")
					+ ':</label>'
					+ '<input type="text" id="Doc'
					+ i
					+ '_Place_zip" value="'
					+ docList[i].Place.zip
					+ '"/>'
					+ '</div>'
					+ '<div>'
					+ '<label for="Doc'
					+ i
					+ '_Place_city">'
					+ ctr.getPageResource("global", "city")
					+ ':</label>'
					+ '<input type="text" name="place" id="Doc'
					+ i
					+ '_Place_city" value="'
					+ docList[i].Place.city
					+ '"/>'
					+ '<label for="Doc'
					+ i
					+ '_Place_country">'
					+ ctr.getPageResource("global", "country")
					+ ':</label>'
					+ '<input type="text" id="Doc'
					+ i
					+ '_Place_country" value="'
					+ docList[i].Place.country
					+ '"/>'
					+ '<label for="Doc'
					+ i
					+ '_Text">'
					+ ctr.getPageResource("global", "note")
					+ ':</label>'
					+ '<textarea cols="40" rows="8" id="Doc'
					+ i
					+ '_Text">'
					+ docList[i].Text
					+ '</textarea>'
					+ '</fieldset>';

			$("#docCollapse").append(docString).collapsibleset("refresh");
			$(".swipebox").swipebox();
		}
		$('.deleteDoc').on('tap', function(doc, data) {
			ctr.uiPersonCtr.removeDoc($(this).attr('data-index'));
		});

	}

	uiPersonController.prototype.updateResourceFile = function(resource,
			thumbnail) {
		ctr.uiPersonCtr.container.find(
				"#Doc" + ctr.uiPersonCtr.editDocPos + "_resource").attr(
				"value", resource);
		ctr.uiPersonCtr.container.find(
				"#Doc" + ctr.uiPersonCtr.editDocPos + "_thumbnail").attr(
				"value", thumbnail);
		ctr.uiPersonCtr.container.find(
				"#Doc" + ctr.uiPersonCtr.editDocPos + "_resourceLink").attr(
				"href", resource);
		ctr.uiPersonCtr.container.find(
				"#Doc" + ctr.uiPersonCtr.editDocPos + "_resourceLink").text(
				resource);
		ctr.uiPersonCtr.container.find(
				"#Doc" + ctr.uiPersonCtr.editDocPos + "_mediaCtr").attr("href",
				resource);

		$("#SDPopupDiv").popup("close");
		$('.media').media({
			width : 600,
			autoplay : false
		});
	}

	uiPersonController.prototype.addResourceFile = function(resource, thumbnail) {
		$("#newDoc_resource").attr("value", resource);
		$("#newDoc_thumbnail").attr("value", thumbnail);
		$("#newDoc_resource").attr("value", resource);
		$("#newDoc_ResourceLink").attr("href", resource);
		$("#newDoc_ResourceLink").text(resource);
		$("#newDoc_MediaCtr").attr("href", resource);

		$("#newDocSDPopupDiv").popup("close");
		$('.media').media({
			width : 600,
			autoplay : false
		});
	}

	uiPersonController.prototype.savePersonData = function() {
		var editPerson=uiPersonController.editPerson;
		// update name
		editPerson.Name.givn = this.container.find("#Name_givn").val();
		editPerson.Name.surn = this.container.find("#Name_surn").val();
		editPerson.Name.maid = this.container.find("#Name_maid").val();

		// update gender if available; person without family
		if ($('input:radio[name="personGenderCB"]').filter('[checked="true"]').length > 0)
			editPerson.gender = $('input:radio[name="personGenderCB"]')
					.filter('[checked="true"]').attr('value');

		// update events
		for ( var ei = 0; ei < editPerson.Events.length; ei++) {
			editPerson.Events[ei].Date.day = this.container.find(
					"#Event" + ei + "_Date_day").val();
			editPerson.Events[ei].Date.month = this.container.find(
					"#Event" + ei + "_Date_month").val();
			editPerson.Events[ei].Date.year = this.container.find(
					"#Event" + ei + "_Date_year").val();
			editPerson.Events[ei].Place.street = this.container.find(
					"#Event" + ei + "_Place_street").val();
			editPerson.Events[ei].Place.zip = this.container.find(
					"#Event" + ei + "_Place_zip").val();
			editPerson.Events[ei].Place.city = this.container.find(
					"#Event" + ei + "_Place_city").val();
			editPerson.Events[ei].Place.country = this.container.find(
					"#Event" + ei + "_Place_country").val();
			editPerson.Events[ei].Text = this.container.find(
					"#Event" + ei + "_Text").val();
		}

		// update infos
		for ( var ii = 0; ii < editPerson.Infos.length; ii++) {
			editPerson.Infos[ii].Text = this.container.find(
					"#Info" + ii + "_Text").val();
		}
		// update docs
		for ( var ed = 0; ed < editPerson.Docs.length; ed++) {
			editPerson.Docs[ed].resource = this.container.find(
					"#Doc" + ed + "_resource").val();
			editPerson.Docs[ed].thumbnail = this.container.find(
					"#Doc" + ed + "_thumbnail").val();
			editPerson.Docs[ed].title = this.container.find(
					"#Doc" + ed + "_title").val();
			editPerson.Docs[ed].Date.day = this.container.find(
					"#Doc" + ed + "_Date_day").val();
			editPerson.Docs[ed].Date.month = this.container.find(
					"#Doc" + ed + "_Date_month").val();
			editPerson.Docs[ed].Date.year = this.container.find(
					"#Doc" + ed + "_Date_year").val();
			editPerson.Docs[ed].Place.street = this.container.find(
					"#Doc" + ed + "_Place_street").val();
			editPerson.Docs[ed].Place.zip = this.container.find(
					"#Doc" + ed + "_Place_zip").val();
			editPerson.Docs[ed].Place.city = this.container.find(
					"#Doc" + ed + "_Place_city").val();
			editPerson.Docs[ed].Place.country = this.container.find(
					"#Doc" + ed + "_Place_country").val();
			editPerson.Docs[ed].Text = this.container.find(
					"#Doc" + ed + "_Text").val();
		}
		ctr.savePerson(editPerson);
	}

	uiPersonController.prototype.saveNewEvent = function() {
		if ($("#eventTypeSelect")[0].selectedIndex > 0) {
			var event = {
				name : $("#eventTypeSelect").val(),
				pos : -1,
				Date : {
					year : $("#newEvent_Date_year").val(),
					month : $("#newEvent_Date_month").val(),
					day : $("#newEvent_Date_day").val()
				},
				Place : {
					street : $("#newEvent_Place_street").val(),
					zip : $("#newEvent_Place_zip").val(),
					city : $("#newEvent_Place_city").val(),
					country : $("#newEvent_Place_country").val()
				},
				Text : $("#newEvent_Text").val()
			}
			uiPersonController.editPerson.Events.push(event);
			ctr.savePerson(uiPersonController.editPerson);
			ctr.setSelectedPerson(uiPersonController.editPerson.id);
			ctr.showPersonView();
		}
	}

	uiPersonController.prototype.saveNewDoc = function() {
		if ($("#docTypeSelect")[0].selectedIndex > 0) {
			var doc = {
				type : $("#docTypeSelect").val(),
				resource : $("#newDoc_resource").val(),
				thumbnail : $("#newDoc_thumbnail").val(),
				title : $("#newDoc_title").val(),
				pos : -1,
				owner : {
					personref : "",
					text : ""
				},
				Date : {
					year : $("#newDoc_Date_year").val(),
					month : $("#newDoc_Date_month").val(),
					day : $("#newDoc_Date_day").val()
				},
				Place : {
					street : $("#newDoc_Place_street").val(),
					zip : $("#newDoc_Place_zip").val(),
					city : $("#newDoc_Place_city").val(),
					country : $("#newDoc_Place_country").val()
				},
				Text : $("#newDoc_Text").val()
			}
			
			uiPersonController.editPerson.Docs.push(doc);
			ctr.savePerson(uiPersonController.editPerson);
			ctr.setSelectedPerson(uiPersonController.editPerson.id);
			ctr.showPersonView();
		}
	}

	uiPersonController.prototype.removeEvent = function(index) {
		uiPersonController.editPerson.Events.splice(index, 1);
		ctr.savePerson(uiPersonController.editPerson);
		ctr.setSelectedPerson(uiPersonController.editPerson.id);
		ctr.showPersonView();
	}

	uiPersonController.prototype.removeDoc = function(index) {
		uiPersonController.editPerson.Docs.splice(index, 1);
		ctr.savePerson(uiPersonController.editPerson);
		ctr.setSelectedPerson(uiPersonController.editPerson.id);
		ctr.showPersonView();
	}

	uiPersonController.prototype.saveNewInfo = function() {
		if ($("#infoTypeSelect")[0].selectedIndex > 0) {
			var info = {
				name : $("#infoTypeSelect").val(),
				pos : -1,
				Text : $("#newInfo_Text").val()
			}
			uiPersonController.editPerson.Infos.push(info);
			ctr.savePerson(uiPersonController.editPerson);
			ctr.setSelectedPerson(uiPersonController.editPerson.id);
			ctr.showPersonView();
		}
	}

	uiPersonController.prototype.removeInfo = function(index) {
		uiPersonController.editPerson.Infos.splice(index, 1);
		ctr.savePerson(uiPersonController.editPerson);
		ctr.setSelectedPerson(uiPersonController.editPerson.id);
		ctr.showPersonView();
	}

}