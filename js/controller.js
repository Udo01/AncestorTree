//controller class
Controller = function() {

	this.content = null;

	this.settingsPath = "settings/global.xml";
	this.configPath="settings/appconfig.xml";
	this.defaultDataPath = "data/default.xml";
	this.langISO = null;
	
	this.dataContainer=null;
	var xmlSettings;
	var appConfig;

	// browser
	this.browser = {};
	this.device = null;
	this.domain =null;

	// contoller
	this.dataCtr = null;
	this.uiStartView=null;
	this.gAEDataController=null;
	this.xMLDataController=null;
	this.gedcomDataController=null;
	this.uiListCtr = null;
	this.uiPersonCtr = null;
	this.uiFamCtr = null;	
	this.uiTreeCtr = null;

	this.currentPerson = {};
	this.selectedPerson = {};
	this.treeType=null;

	// login
	this.loggedIn = false;
	this.user = {};
	this.loginURL = null;

	// public methods
	this.init = function() {
		
		this.langISO = "de";
		this.setBrowser();
        //load data controller
		this.dataCtr = new dataController();
		
		//load config
		this.dataCtr.loadAppConfig(this.configPath);
		this.dataCtr.loadSettings(this.settingsPath)
        
	    //load config parameter
		this.device = this.getAppSetting("device");
		this.domain=this.getAppSetting("domain");
		//init controlls
		this.uiContentCtr = new uiContentController();
		this.uiStartView = new UiStartView($("#startPage"));
		this.gAEDataController=new GAEDataController($("#persistDataPage"),this.device,this.domain);
		this.xMLDataController=new XMLDataController($("#persistDataPage"));
		this.gedcomDataController=new GedcomDataController($("#persistDataPage"));
		this.uiListCtr = new uiListController($("#listPage"));
		this.uiPersonCtr = new uiPersonController($("#personPage"));
		this.uiFamCtr = new uiFamCtr($("#familyPage"));
		this.uiTreeCtr = new uiTreeController($("#treePage"),this.device,this.domain);

		//this.uiContentCtr.addTreePrintPage($("#treePrintPage"));
		//this.uiContentCtr.addContactPage($("#contactPage"));
		
		//set event handler
		this.setEventHandler();
		this.initPages();
		this.showStartView();
	}
	
	//get DataContainer
	Controller.prototype.initPages=function()
	{
		//startpage
		var container="#startPage";
		this.uiContentCtr.addHeader(container);
		this.uiContentCtr.addFooter(container);
		
		//menupages
		var pageList=[];
		pageList.push("#listPage");
		pageList.push("#treePage");
		pageList.push("#familyPage");
		pageList.push("#personPage");
		
		 $.each(pageList, function(i,container){
				ctr.uiContentCtr.addHeader(container);
				ctr.uiContentCtr.addMenu(container);
				ctr.uiContentCtr.addFooter(container);
	     });
		
		//text header pages 
			var pageList=[];
			pageList.push({container:"#persistDataPage",text:"Google Cloud"});
			pageList.push({container:"#dialogPage",text:"Dialog"});
			pageList.push({container:"#treePrintPage",text:"Print"});
			
			 $.each(pageList, function(i,item){
					ctr.uiContentCtr.addTextHeader(item.container,item.text);
					ctr.uiContentCtr.addFooter(item.container);
		     }); 
			 $.mobile.resetActivePageHeight();
	}	
	
	//get DataContainer
	Controller.prototype.getDataContainer=function()
	{
		return this.dataContainer;
	}
	//set DataContainer
	Controller.prototype.setDataContainer=function(val)
	{
		dataContainer=val;
	}
	//replace xmlData
	Controller.prototype.replaceXmlData = function(xmlData) {
		this.dataCtr.replaceXmlData(xmlData);
	}
	//add empty dataContainer
	Controller.prototype.addEmptyDataContainer=function()
	{
		this.dataCtr.addEmptyDataContainer();
	}
	
	// lang ISO
	Controller.prototype.setLangISO = function(langISO) {
		
		this.langISO = langISO;
		var page = $.mobile.activePage.attr('id');

		switch (page) {
		case "homePage":
			ctr.showStartView();
			break;
		case "listPage":
			ctr.showListView();
			break;
		case "treePage":
			ctr.showTreeView(ctr.uiTreeCtr.treeStyle);
			break;
		case "familyPage":
			ctr.showFamilyView();
			break;
		case "personPage":
			ctr.showPersonView();
			break;
		default:
			ctr.showStartView();
			break;
		}
	}

	// data IO
	Controller.prototype.loadDefaultData = function() {
		this.blockUI();
		var success; 
		success = this.dataCtr.loadStaticData(this.defaultDataPath,"private");
		this.unblockUI();
		if (success) {
			this.showStartView();
		}
	}

	// data
	Controller.prototype.getPerson = function(id) {
		return this.dataCtr.getPerson(id);
	}

	//    
	Controller.prototype.personViewBack = function() {
		this.showListView();
	}

	Controller.prototype.setCurrentPerson = function(personId) {
		this.currentPerson = this.dataCtr.getPerson(personId);
	}

	Controller.prototype.setSelectedPerson = function(personId) {
		this.selectedPerson = this.dataCtr.getPerson(personId);
	}

	// contact page
	Controller.prototype.showContactPage = function() {
		var container = $("#contactPage");
		if($.mobile.activePage.attr('id')!="contactPage")$.mobile.changePage("#contactPage");
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("global","contact"));
		this.uiContentCtr.addContactContent(container);
	}
	
	// home view
	Controller.prototype.showStartView = function() {
		$.mobile.changePage("#startPage");
		this.uiStartView.setObjRef(this.uiStartView);
		this.uiStartView.dataContainer=this.dataContainer;
		this.uiStartView.show();
	}
	
	//GAEDataController
	Controller.prototype.showGAEView = function() {
			$.mobile.changePage("#persistDataPage");
	    	this.gAEDataController.setObjRef(this.gAEDataController);
	    	this.gAEDataController.dataContainer=ctr.dataContainer;
	    	this.gAEDataController.show();
	}
	
	//XMLDataController
	Controller.prototype.showXMLView = function() {
			var container = $("#persistDataPage");
			$.mobile.changePage("#persistDataPage");
			$("#dialogPage div[data-role='header'] h1").html("XML Data");
	    	this.xMLDataController.setObjRef(this.xMLDataController);
	    	this.xMLDataController.dataContainer=ctr.dataContainer;
	    	this.xMLDataController.show();
	}
	
	//GedcomDataController
	Controller.prototype.showGedcomView = function() {
			var container = $("#persistDataPage");
			$.mobile.changePage("#persistDataPage");
			$("#dialogPage div[data-role='header'] h1").html("Gedcom Data");
	    	this.gedcomDataController.setObjRef(this.gedcomDataController);
	    	this.gedcomDataController.show();
	}
	
	// list view
	Controller.prototype.showListView = function() {
		var container = $("#listPage");
		if($.mobile.activePage.attr('id')!="listPage")$.mobile.changePage("#listPage");
		
		this.blockUI();
		var personList = this.dataCtr.getPersonList();
		this.unblockUI();

		if (personList != null) {
			this.uiListCtr.addContent(personList);
		}
	}

	Controller.prototype.personListClicked = function(idSelectedPerson) {
		this.currentPerson = this.dataCtr.getPerson(idSelectedPerson);
		this.selectedPerson=this.currentPerson;
		this.showFamilyView();
	}

	Controller.prototype.showAddNewUnboundPersonDialog = function() {
		$.mobile.changePage("#dialogPage");
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("newUnboundPersonDlg","header"));
		this.uiListCtr.addNewUnboundPersonDialog($("#dialogPage"));
	}

	// person view
	Controller.prototype.showPersonView = function() {
		var container = $("#personPage");
		if (this.currentPerson!=null && this.currentPerson.id != null) {
			this.blockUI();
			$.mobile.changePage("#personPage");
			if (this.selectedPerson!=null && this.selectedPerson.id != null) {
				this.uiPersonCtr.addContent(this.selectedPerson);
			} else {
				this.uiPersonCtr.addContent(this.currentPerson);
			}
			this.unblockUI();
		} else
			alert(ctr.getPageResource("global", "pleaseSelectPerson"));
	}

	Controller.prototype.createNewEventView = function(idPerson) {
		$.mobile.changePage("#dialogPage");
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("newInfoDlg","header"));
		this.uiPersonCtr.createNewEventView($("#dialogPage"), this.getPerson(idPerson));
	}

	Controller.prototype.createNewInfoView = function(idPerson) {
		$.mobile.changePage("#dialogPage");
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("newInfoDlg","header"));
		this.uiPersonCtr.createNewInfoView($("#dialogPage"), this.getPerson(idPerson));
	}
	
	Controller.prototype.createNewDocView = function(idPerson) {
		$.mobile.changePage("#dialogPage");
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("newDocDlg","header"));
		this.uiPersonCtr.createNewDocView($("#dialogPage"), this.getPerson(idPerson));
	}
	
	Controller.prototype.savePerson = function(person) {
		this.dataCtr.savePerson(person);
	}

	Controller.prototype.getEventType = function(typeName) {
		return this.dataCtr.getEventType(this.langISO, typeName);
	}

	Controller.prototype.getEventTypesList = function() {
		return this.dataCtr.getEventTypesList(this.langISO);
	}

	Controller.prototype.getInfoType = function(typeName) {
		return this.dataCtr.getInfoType(this.langISO, typeName);
	}

	Controller.prototype.getInfoTypesList = function() {
		return this.dataCtr.getInfoTypesList(this.langISO);
	}
	
	Controller.prototype.getDocumentType = function(typeName) {
		return this.dataCtr.getDocumentType(this.langISO, typeName);
	}

	Controller.prototype.getDocumentTypesList = function() {
		return this.dataCtr.getDocumentTypesList(this.langISO);
	}

	// tree view
	Controller.prototype.showTreeView = function(treeType) {
		this.treeType=treeType;
		var container = $("#treePage");
		var data;
		// check if person was selected
		if (this.currentPerson!=null && this.currentPerson.id != null) {
			$.mobile.changePage("#treePage");
			this.blockUI();
				if (treeType == "desc") {
					data=ctr.dataCtr.getDescendentData(ctr.currentPerson);
				}
				if (treeType == "anc") {
					data=ctr.dataCtr.getAncestorData(ctr.currentPerson);
				}			
				$(container).page("destroy").page();
			    ctr.uiTreeCtr.init(data,treeType);
			this.unblockUI();
		} else
			alert(ctr.getPageResource("global", "pleaseSelectPerson"));
	}
	
	// add father directly from treeview
	Controller.prototype.addFather = function() {
		var addPerson = this.selectedPerson.id != null ? this.selectedPerson
				: this.currentPerson;
		if (!this.dataCtr.hasFather(addPerson.id)) {
			var newPerson = {
				id : null,
				gender : "m",
				Name : {
					givn : "",
					surn : addPerson.Name.surn
				},
				Birth : {
					day : "",
					month : "",
					year : ""
				}
			};
			this.dataCtr.addNewPersonToPerson(newPerson, addPerson.id,"father", 0, 0);
		}
	}

	// add mother directly from treeview
	Controller.prototype.addMother = function() {
		var addPerson = this.selectedPerson.id != null ? this.selectedPerson
				: this.currentPerson;
		if (!this.dataCtr.hasMother(addPerson.id)) {
			var newPerson = {
				id : null,
				gender : "f",
				Name : {
					givn : "",
					surn : addPerson.Name.surn
				},
				Birth : {
					day : "",
					month : "",
					year : ""
				}
			};
			this.dataCtr.addNewPersonToPerson(newPerson, addPerson.id,"mother", 0, 0);
		}
	}

	// add child directly from treeview
	Controller.prototype.addChild = function(gender) {
		var addPerson = this.selectedPerson.id != null ? this.selectedPerson
				: this.currentPerson;

		var newPerson = {
			id : null,
			gender : gender,
			Name : {
				givn : "",
				surn : addPerson.Name.surn
			},
			Birth : {
				day : "",
				month : "",
				year : ""
			}
		};
		this.dataCtr.addChildToPerson(newPerson, addPerson.id);
	}


	// family View
	Controller.prototype.showFamilyView = function() {
		//save changes from personView
		if(ctr.uiPersonCtr.editPerson!=null){	
    		ctr.uiPersonCtr.savePersonData();
    	}

		var container = $("#familyPage");
		// check if person was selected
		if (this.currentPerson!=null && this.currentPerson.id != null) {
			this.blockUI();
			$.mobile.changePage("#familyPage");
			this.uiFamCtr.setNodesXml(this.dataCtr.getFamilyData(this.currentPerson));
			this.uiFamCtr.addContent();
			this.unblockUI();
		} else
			alert(ctr.getPageResource("global", "pleaseSelectPerson"));
	}

	// show dialog to remove or delete person
	Controller.prototype.showRemovePersonDialog = function(idMainPerson,idPerson, dataRole) {
		$.mobile.changePage("#dialogPage");
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("removePersonDlg","header"));
		this.uiFamCtr.addRemovePersonDialog($("#dialogPage"),idMainPerson, idPerson, dataRole);
	}

	// delete person
	Controller.prototype.deletePerson = function(idPerson) {
		this.dataCtr.deletePerson(idPerson);
	}

	// remove person from family
	Controller.prototype.deleteConnection = function(mainPersonId, personId,
			dataRole) {
		this.dataCtr.deleteConnection(mainPersonId, personId, dataRole);
	}

	Controller.prototype.deleteEmptyFamily = function(idPerson, familyPos) {
		this.dataCtr.deleteEmptyFamily(idPerson, familyPos);
	}

	Controller.prototype.deleteEmptyChild = function(idPerson, familyPos,
			childPos) {
		this.dataCtr.deleteEmptyChild(idPerson, familyPos, childPos);
	}

	// add family
	Controller.prototype.addFamily = function(idPerson) {
		this.dataCtr.addFamily(idPerson);
	}

	// add child
	Controller.prototype.addEmptyChild = function(idPerson, familyPos) {
		this.dataCtr.addEmptyChild(idPerson, familyPos);
	}

	// add new person dialog
	Controller.prototype.showAddNewPersonDialog = function(idMainPerson,dataRole, familyPos, childPos) {
		$.mobile.changePage("#dialogPage");	
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("addPersonDlg","header"));
		this.uiFamCtr.addNewPersonDialog($("#dialogPage"),idMainPerson, dataRole, familyPos,childPos);
	}

	// add existing person dialog
	Controller.prototype.showAddExistPersonDialog = function(idMainPerson,
			dataRole, familyPos, childPos) {
		var person = this.getPerson(idMainPerson);
		var gender = null;
		if (dataRole == "father")
			gender = "m";
		if (dataRole == "mother")
			gender = "f";
		if (dataRole == "partner" && person.gender == "m")
			gender = "f";
		if (dataRole == "partner" && person.gender == "f")
			gender = "m";

		var nonIdList = this.dataCtr.getAllRelationIds(idMainPerson);
		var personList = this.dataCtr.getQueryPersonList(nonIdList, gender);
		
		$.mobile.changePage("#dialogPage");	
		$("#dialogPage div[data-role='header'] h1").html(ctr.getPageResource("addExistPersonDlg","header"));
		this.uiFamCtr.addExistPersonDialog($("#dialogPage"),personList, idMainPerson,dataRole, familyPos, childPos);
	}

	// add new person to existing person
	Controller.prototype.addNewPersonToPerson = function(newPerson,
			idMainPerson, dataRole, familyPos, childPos) {
		this.dataCtr.addNewPersonToPerson(newPerson, idMainPerson, dataRole,
				familyPos, childPos);
	}

	// add existing person to existing person
	Controller.prototype.addExistPersonToPerson = function(idSelectedPerson,
			idMainPerson, dataRole, familyPos, childPos) {
		this.dataCtr.addExistPersonToPerson(idSelectedPerson, idMainPerson,
				dataRole, familyPos, childPos);
	}

	// add new person
	Controller.prototype.addPerson = function(newPerson) {
		return this.dataCtr.addPerson(newPerson);
	}

	Controller.prototype.getDataRole = function(roleName) {
		return this.dataCtr.getDataRole(this.langISO, roleName);
	}

	Controller.prototype.getDataRoleList = function() {
		return this.dataCtr.getDataRoleList(this.langISO);
	}

	Controller.prototype.hasSQL = function() {
		return this.dataCtr.hasSQL();
	}

	Controller.prototype.hasChildren = function(idPerson) {
		return this.dataCtr.hasChildren(idPerson);
	}

	Controller.prototype.setEventHandler = function() {
		// startPage
		$('#startPage').on('pagebeforeshow', function(event, ui) {
		});
		
		// contactPage
		$('#contactPage').on('pagebeforeshow', function(event, ui) {
			if(ctr.dataContainer!=null){
			ctr.showContactPage();
			}
			else $.mobile.changePage("#startPage");
		});
		
		// listPage
		$('#listPage').on('pagebeforeshow', function(event, ui) {
			if(ctr.dataContainer==null){
				$.mobile.changePage("#startPage");
			}
			else{
				$(".mainNavbar a").removeClass("ui-btn-active");
				$(".listBtn").addClass("ui-btn-active");
			}
		});
		
		// familyPage
		$('#familyPage').on('pagebeforeshow', function(event, ui) {
			if(ctr.dataContainer==null){
				$.mobile.changePage("#startPage");
			}
			else{
				$(".mainNavbar a").removeClass("ui-btn-active");
				$(".famBtn").addClass("ui-btn-active");
			}
		});
		
		// personPage
		$('#personPage').on('pagebeforeshow', function(event, ui) {
			if(ctr.dataContainer==null){
				$.mobile.changePage("#startPage");
			}
			else{
				$(".mainNavbar a").removeClass("ui-btn-active");
				$(".persBtn").addClass("ui-btn-active");
			}
		});
		
		//treePage
		$('#treePage').on('pageshow', function(event, ui) {
			if(ctr.dataContainer==null){
				$.mobile.changePage("#startPage");
			}
			else{
				$(".mainNavbar a").removeClass("ui-btn-active");
				if (ctr.treeType == "desc") {
					$(".descBtn").addClass("ui-btn-active");
				}
				if (ctr.treeType == "anc") {
					$(".ancBtn").addClass("ui-btn-active");
				}
			}
		});
		
		$('#treePrintPage').on('pagehide', function(event, ui) {
			ctr.showTreeView(ctr.treeType);
		});
	}

	//skydrive explorer
	Controller.prototype.SDfileClickEventHandler = function(id) {
		if (id != null) {
			alert(id);
		}
	}
	
	// utils
	//load dynamic script
	Controller.prototype.getScript=function(url, success) {
       var script = document.createElement('script');
        script.src = url;

        var head = document.getElementsByTagName('head')[0],
		done = false;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                // callback function provided as param
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            };
        };
        head.appendChild(script);
    };
	
	
	Controller.prototype.setBrowser = function() {
		var deviceAgent = navigator.userAgent.toLowerCase();
		if (deviceAgent.match(/(webos|iphone|ipod|ipad|android)/))
			this.browser.isMobile = true;
		else
			this.browser.isMobile = false;
		this.browser.name = navigator.appCodeName;
		this.browser.version = navigator.appVersion
	}

	Controller.prototype.getPageResource = function(pageName, pageItem) {
		return this.dataCtr.getPageResource(pageName, pageItem, this.langISO);
	}
	
	Controller.prototype.getAppSetting=function(settingName){
                return this.dataCtr.getAppSetting(settingName);
	}
	
	Controller.prototype.blockUI = function() {
		return this.uiContentCtr.blockUI();
	}

	Controller.prototype.unblockUI = function() {
		return this.uiContentCtr.unblockUI();
	}
	

}