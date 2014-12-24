/*----GAEDataController.js
|--------------------------------------------------------------------------------------------
| (c) 2013 Udo Lang
|     
|                                                                            
|	created:: Dezember 16, 2012				   
|     Last updated: Dezember 23, 2014
|     Version: 1.0
\------------------------------------------------------------------------------------------*/

//constants
//global variables
var gaeObj = null;

GAEDataController = function (page,device,domain) {
    this.config = {
        val1: null,
    }

    this.page = page;
    this.device = device;
    this.domain = domain;
    this.content = $(page).find("div[role='main']")
    this.dataContainer = null;
    this.loginURL = null;
    this.loginservice = null;
    this.dataservice = null;
    this.login = {
        loggedIn: null,
        id: null,
        name: null,
        nickname: null,
    };
    if (this.device == "app") {
        this.loginservice = this.domain+"/loginservice";
        this.dataservice = this.domain+"/dataservice";
    }
    if (this.device == "web") {
        this.loginservice = "/loginservice";
        this.dataservice = "/dataservice";
    }

    
}

GAEDataController.prototype.setObjRef = function (objRef) {
    gaeObj = objRef;
}

GAEDataController.prototype.show = function () {
    this.loadUser();
    this.showUI();
}

GAEDataController.prototype.showUI = function () {
    var content = gaeObj.content;
    $(this.content).empty();
    var contentString = "<div>";
    // login
    if (gaeObj.login.loggedIn) {
        contentString += '<div align="right">' +
        '<h3>' + gaeObj.login.name + '</h3>' +
        '<a id="loginBtn" data-ajax="false" href="#" data-theme="c">' + ctr.getPageResource("home", "logout") + '</a>' +
        '</div>';
    }
    else {
        contentString += '<div align="right">' +
        '<h3>' + ctr.getPageResource("home", "guest") + '</h3>' +
        '<a id="loginBtn" data-ajax="false" href="#" data-theme="c">' + ctr.getPageResource("home", "login") + '</a>' +
        '</div>';
    }

    contentString += '<h3>' + ctr.getPageResource("home", "data") + ':</h3>' +
    '<button class="ui-btn" id="loadPublicDataContainerBtn">' + ctr.getPageResource("home", "loadPublicData") + '</button>';
    if (gaeObj.login.loggedIn) {
        contentString += '<button class="ui-btn" id="loadPrivateDataContainerBtn">' + ctr.getPageResource("home", "loadPrivateData") + '</button>';
    }
    contentString += '<hr/>';

    if (this.dataContainer != null) {
        contentString += '<h3></h3>' +
        '<button class="ui-btn" id="updateDataBtn">' + ctr.getPageResource("home", "saveData") + '</button>' +
        '<button class="ui-btn" id="saveDataAsBtn">' + ctr.getPageResource("home", "saveDataAs") + '</button>' +
        '<hr/>' +
        '<button class="ui-btn" id="removePublicDataBtn">' + ctr.getPageResource("home", "removePublicData") + '</button>';
        if (gaeObj.login.loggedIn) {
            contentString += '<button class="ui-btn" id="removePrivateDataBtn">' + ctr.getPageResource("home", "removePrivateData") + '</button>';
        }
        contentString += '<hr/>';
    }
    contentString += '</div>';

    $(content).append(contentString);
    // events
    $("#loginBtn").bind("click", function (event, data) {
        window.open(gaeObj.loginURL, "_self");
    });
    $("#loadPublicDataContainerBtn").bind("click", function (event, data) {
        gaeObj.blockUI();
        var dataList = gaeObj.getDataContainerList("public");
        gaeObj.unblockUI();
        gaeObj.addDataContainerDialog(dataList);
    });
    if (gaeObj.login.loggedIn) {
        $("#loadPrivateDataContainerBtn").bind("click", function (event, data) {
            gaeObj.blockUI();
            var dataList = gaeObj.getDataContainerList("private");
            gaeObj.unblockUI();
            gaeObj.addDataContainerDialog(dataList);
        });
    }
    if (this.dataContainer != null) {
        $("#saveDataAsBtn").bind("click", function (event, data) {
            gaeObj.saveDataAsDialog();
        });
        $("#updateDataBtn").bind("click", function (event, data) {
            var dataContainer = gaeObj.dataContainer;
            if (dataContainer.id != null && dataContainer.id > 0) {
                gaeObj.blockUI();
                gaeObj.updateData();
                gaeObj.unblockUI();
                ctr.dataContainer = gaeObj.dataContainer;
                ctr.showStartView();
            } else
                gaeObj.saveDataAsDialog();
        });

        $("#removePublicDataBtn").bind("click", function (event, data) {
            gaeObj.blockUI();
            var dataList = gaeObj.getDataContainerList("public");
            gaeObj.unblockUI();
            gaeObj.removeDataDialog(dataList);
        });
        if (gaeObj.login.loggedIn) {
            $("#removePrivateDataBtn").bind("click", function (event, data) {
                gaeObj.blockUI();
                var dataList = gaeObj.getDataContainerList("private");
                gaeObj.unblockUI();
                gaeObj.removeDataDialog(dataList);
            });
        }
    }
}

GAEDataController.prototype.saveDataAsDialog = function (container) {
    var dataContainer = gaeObj.dataContainer;
    var content = gaeObj.content;
    var page = gaeObj.page;

    var contentString = "" +
    '<div data-role="fieldcontain" data-theme="b">' +
    '<label for="SAD_dataContainerName">' + ctr.getPageResource("saveDataAsDlg", "dataContainerName") + ':</label>' +
    '<input type="text" id="SAD_dataContainerName" value="' + dataContainer.name + '"/>' +
    '<label for="SAD_dataContainerDescription">' + ctr.getPageResource("saveDataAsDlg", "dataContainerDesc") + ':</label>' +
    '<input type="text" id="SAD_dataContainerDescription" value="' + dataContainer.description + '"/>';

    contentString += '<fieldset data-role="controlgroup" id="accessTypeFS">' +
       '<legend>' + ctr.getPageResource("saveDataAsDlg", "dataContainerAccess") + ':</legend>' +
       '<input type="radio" name="radio-choice-1" id="radio-choice-11" value="private"/>';
    if (gaeObj.login.loggedIn) contentString += '<label for="radio-choice-11">' + ctr.getPageResource("saveDataAsDlg", "privateAccess") + '</label>';
    contentString += '<input type="radio" name="radio-choice-1" id="radio-choice-12" value="public"/>' +
    '<label for="radio-choice-12">' + ctr.getPageResource("saveDataAsDlg", "publicAccess") + '</label>' +
 '</fieldset>';

    contentString += '<a id="SAD_SaveDataAsBtn" href="#" data-role="button" data-theme="c">' + ctr.getPageResource("global", "save") + '</a>' +
    '</div>' +
    '<hr/>';
    $(content).html(contentString);
    $(page).page('destroy').page();

    if (dataContainer.accessType == "public") $("#accessTypeFS :radio[id=radio-choice-12]").attr('checked', true).checkboxradio("refresh");
    if (dataContainer.accessType == "private") $("#accessTypeFS :radio[id=radio-choice-11]").attr('checked', true).checkboxradio("refresh");

    // add event listener
    $("#SAD_SaveDataAsBtn").bind("click", function (event, data) {
        var name = $("#SAD_dataContainerName").val();
        var description = $("#SAD_dataContainerDescription").val();
        var accessType = $("#accessTypeFS :radio:checked").val();
        gaeObj.blockUI();
        gaeObj.saveDataAs(name, description, accessType);
        gaeObj.unblockUI();
        ctr.dataContainer = gaeObj.dataContainer;
        ctr.showStartView();
    });
}

GAEDataController.prototype.removeDataDialog = function (dataList) {
    var content = gaeObj.content;
    var page = gaeObj.page;

    var contentStr = '<div data-role="fieldcontain">' +
    '<h3>' + ctr.getPageResource("global", "remove") + '</h3>' +
    '<hr/>' +
    '<ul data-role="listview" id="RemovePrivateDataLV" data-split-icon="gear" data-theme="c"></ul>' +
    '<br/><hr/>' +
    '</div>';
    $(content).html(contentStr);
    $(page).page('destroy').page();

    // add list items
    if (dataList != null && dataList.length > 0) {
        var listContainer = $("#RemovePrivateDataLV");
        var str = "";
        for (var i = 0; i < dataList.length; i++) {
            str += '<li onclick="gaeObj.removeDataContainerConfirm(\'' + dataList[i].id + '\',\'' + dataList[i].name + '\',\'' + dataList[i].lastChanged + '\')"><a href="#" data-id="' + dataList[i].id + '">' +
                        '<h3>' + dataList[i].name + '</h3>' +
                        '<p><strong>' + dataList[i].description + '</strong></p>' +
                        '<p>' + dataList[i].owner + '</p>' +
                        '<p>' + dataList[i].created + '</strong></p>' +
                        '<p>' + dataList[i].accessType + '</p>' +
                        '<p class="ui-li-aside"><br/><strong>' + ctr.getPageResource("global", "saved") + ':</strong><br/>' + dataList[i].lastUser + '<br/>' + dataList[i].lastChanged + '</p>' +
                    '</a>' +
                    '</li>';
        }
        listContainer.append(str);
        listContainer.listview("refresh");
    }
    else alert(ctr.getPageResource("removeDataDlg", "noData"));
}

GAEDataController.prototype.removeDataContainerConfirm = function (documentID, name, lastChanged) {
    if (confirm(name + " vom " + lastChanged + " wirklich loeschen?")) {
        gaeObj.blockUI();
        gaeObj.removeDataContainer(documentID);
        this.unblockUI();
        if (documentID == gaeObj.dataContainer.id) {
            ctr.dataContainer = null;
            ctr.showStartView();
        }
    }
}

GAEDataController.prototype.addDataContainerDialog = function (dataList) {
    var contentStr = '<div data-role="fieldcontain">' +
     '<h3>' + ctr.getPageResource("loadDataContainerDlg", "headline") + '</h3>' +
     '<hr/>' +
     '<ul data-role="listview" id="PrivateDataListLV" data-split-icon="gear" data-theme="c"></ul>' +
     '<br/><hr/>' +
     '</div>';

    $(this.content).html(contentStr);

    // add list items
    if (dataList != null && dataList.length > 0) {
        var listContainer = $("#PrivateDataListLV");
        var str = "";
        for (var i = 0; i < dataList.length; i++) {
            str += '<li onclick="gaeObj.getGedXDataContainer(\'' + dataList[i].id + '\')"><a href="#">' +
                   '<h3>' + dataList[i].name + '</h3>' +
                   '<p><strong>' + dataList[i].description + '</strong></p>' +
                   '<p>' + dataList[i].owner + '</p>' +
                   '<p>' + dataList[i].created + '</strong></p>' +
                   '<p>' + dataList[i].accessType + '</p>' +
                   '<p class="ui-li-aside"><br/><strong>' + ctr.getPageResource("global", "saved") + ':</strong><br/>' + dataList[i].lastUser + '<br/>' + dataList[i].lastChanged + '</p>' +
               '</a>' +
               '</li>';
        }
        listContainer.html(str);
        listContainer.listview();

    }
    else {
        alert(ctr.getPageResource("loadDataContainerDlg", "noData"));
    }
}

//load user from google login
GAEDataController.prototype.loadUser = function () {
    gaeObj.login.loggedIn = false;
    var jqXHR = $.ajax({
        url: this.loginservice,
        dataType: "text",
        async: false
    })
  .success(function (result) {
      var xmlDoc = $.parseXML('<xml></xml>');
      $(xmlDoc).find("xml").append($(result));
      if ($(xmlDoc).find("user name").length > 0) {
          gaeObj.login.loggedIn = true;
          gaeObj.login.id = $(xmlDoc).find("user id").text();
          gaeObj.login.name = $(xmlDoc).find("user name").text();
          gaeObj.login.nickname = $(xmlDoc).find("user nickname").text();
          // decodeURIComponent
          gaeObj.loginURL = decodeURIComponent($(xmlDoc).find("loginurl").text());
      }
      else {
          gaeObj.login.loggedIn = false;
          gaeObj.loginURL = decodeURIComponent($(xmlDoc).find("loginurl").text());
          //alert(gaeObj.loginURL);
      }
  }
    )
  .error(function (jqXHR, textStatus, errorThrown) {
      alert(textStatus + errorThrown);
      gaeObj.login = {};
      gaeObj.loginURL = null;
  })
}

// load user from google login
GAEDataController.prototype.loadUser_jp = function () {
    var jqXHR = $.ajax({
        type: "Get",
        url: this.loginservice,
        crossDomain: true,
        dataType: "jsonp"
    })
	  .success(function (json) {
	      var xmlDoc = $.parseXML('<xml></xml>');
	      $(xmlDoc).find("xml").append(json.response);

	      if ($(xmlDoc).find("user name").length > 0) {
	          gaeObj.login.loggedIn = true;
	          gaeObj.login.id = $(xmlDoc).find("user id").text();
	          gaeObj.login.name = $(xmlDoc).find("user name").text();
	          gaeObj.login.nickname = $(xmlDoc).find("user nickname").text();
	          // decodeURIComponent
	          gaeObj.loginURL = decodeURIComponent($(xmlDoc).find("loginurl").text());
	      }
	      else {
	          gaeObj.login.loggedIn = false;
	          gaeObj.loginURL = decodeURIComponent($(xmlDoc).find("loginurl").text());
	      }
	  })
	  .error(function (jqXHR, textStatus, errorThrown) {
	      alert(errorThrown);
	      gaeObj.login = {};
	      gaeObj.loginURL = null;
	  })
}

// data IO url: filePath,


GAEDataController.prototype.getDataContainerList = function (accessType) {
    gaeObj.blockUI();
    var userID = ctr.user.id != null ? ctr.user.id : -1;
    var dataList = [];
    var jqXHR = $.ajax({
        url: this.dataservice,
        data: { action: "getDataContainerList", accessType: accessType, userID: userID },
        dataType: "text",
        async: false
    })
    .success(function (result) {
        var xmlDoc = $.parseXML('<xml></xml>');
        $(xmlDoc).find("xml").append($(result));

        if ($(xmlDoc).find("datacontainer").length > 0) {
            $(xmlDoc).find("datacontainer").each(function () {
                dataList.push({
                    id: parseInt($(this).find('id').text()),
                    name: $(this).find('name').text(),
                    description: $(this).find('description').text(),
                    owner: $(this).find('owner').text(),
                    ownerID: $(this).find('ownerid').text(),
                    created: $(this).find('created').text(),
                    lastUser: $(this).find('lastuser').text(),
                    latUserID: $(this).find('lstuserid').text(),
                    lastChanged: $(this).find('lastchanged').text(),
                    accessType: $(this).find('accesstype').text(),
                });
            });
        }
        else dataList = null;
    })
    .error(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
        dataList = null;
    })
    return dataList;
}


GAEDataController.prototype.getGedXDataContainer = function (documentID) {
    var xmlResponse;
    var jqXHR = $.ajax({
        url: this.dataservice,
        data: { action: "getGedXDataContainer", documentID: documentID },
        dataType: "text",
        async: false
    })
  .success(function (result) {
      var xmlDoc = $.parseXML('<xml></xml>');
      $(xmlDoc).find("xml").append($(result));

      if ($(xmlDoc).find("datacontainer").length > 0) {
          gaeObj.fillDataContainer(xmlDoc);
          ctr.dataContainer = gaeObj.dataContainer;
          ctr.showStartView();
      }
      else {
          ctr.GAEViewResult(null);
      }
  })
  .error(function (jqXHR, textStatus, errorThrown) {
      alert("error loading data");
  })
}

GAEDataController.prototype.getGedXDataContainer_jp = function (documentID) {
    var xmlResponse;
    var jqXHR = $.ajax({
        type: "Get",
        url: this.dataservice,
        data: { action: "getGedXDataContainer_jp", documentID: documentID },
        crossDomain: true,
        dataType: "jsonp"
    })
  .success(function (json) {
      alert(json.response);
      var xmlDoc = $.parseXML('<xml></xml>');
      $(xmlDoc).find("xml").append(json.response);

      if ($(xmlDoc).find("datacontainer").length > 0) {
          gaeObj.fillDataContainer(xmlDoc);
          ctr.dataContainer = gaeObj.dataContainer;
          ctr.showStartView();
      }
      else {
          ctr.GAEViewResult(null);
      }
  })
  .error(function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
      alert("error loading data");
  })
}

GAEDataController.prototype.updateData = function () {
    var documentID = gaeObj.dataContainer.id;
    var userID;
    if (gaeObj.login.loggedIn) userID = gaeObj.login.id;
    else userID = -1;
    var xmlData = $(gaeObj.dataContainer.xmlData).html();

    var success = false;
    var jqXHR = $.ajax({
        type: "post",
        url: this.dataservice,
        data: { action: "updateData", documentID: documentID, userID: userID, xmlData: xmlData },
        dataType: "text",
        async: false
    })
    .success(function (result) {
        var xmlDoc = $.parseXML('<xml></xml>');
        $(xmlDoc).find("xml").append($(result));

        if ($(xmlDoc).find("datacontainer").length > 0) {
            gaeObj.fillDataContainer(xmlDoc);
            success = true;
        }
        else success = false;
    })
    .error(function (jqXHR, textStatus, errorThrown) {
        success = false;
    })
    return success;
}

GAEDataController.prototype.saveDataAs = function (name, description, accessType) {
    var id = gaeObj.dataContainer.id;
    var userID;

    if (gaeObj.login.loggedIn) userID = gaeObj.login.id;
    else userID = -1;
    var xmlData = $(gaeObj.dataContainer.xmlData).html();

    var success = false;
    var jqXHR = $.ajax({
        type: "post",
        url: this.dataservice,
        data: { action: "saveDataAs", name: name, description: description, accessType: accessType, userID: userID, xmlData: xmlData },
        dataType: "text",
        async: false
    })
    .success(function (result) {
        var xmlDoc = $.parseXML('<xml></xml>');
        $(xmlDoc).find("xml").append($(result));

        if ($(xmlDoc).find("datacontainer").length > 0) {
            gaeObj.fillDataContainer(xmlDoc);
            success = true;
        }
        else success = false;
    })
    .error(function (jqXHR, textStatus, errorThrown) {
        success = false;
    })
    return success;
}

GAEDataController.prototype.removeDataContainer = function (documentID) {
    var userID = gaeObj.login.id;
    var success = false;
    var jqXHR = $.ajax({
        type: "post",
        url: this.dataservice,
        data: { action: "removeDataContainer", documentID: documentID, userID: userID },
        dataType: "text",
        async: false
    })
    .success(function (result) {
        var xmlDoc = $.parseXML('<xml></xml>');
        $(xmlDoc).find("xml").append($(result));

        if ($(xmlDoc).find("response").text() == "true") {
            success = true;
        }
        else success = false;
    })
    .error(function (jqXHR, textStatus, errorThrown) {
        success = false;
    })
    return success;
}

GAEDataController.prototype.fillDataContainer = function (xmlResponse) {
    this.dataContainer = {};
    this.dataContainer.id = $(xmlResponse).find("datacontainer > id").text();
    this.dataContainer.name = $(xmlResponse).find("datacontainer > name").text();
    this.dataContainer.description = $(xmlResponse).find("datacontainer > description").text();
    this.dataContainer.owner = $(xmlResponse).find("datacontainer > owner").text();
    this.dataContainer.ownerID = $(xmlResponse).find("datacontainer > ownerid").text();
    this.dataContainer.created = $(xmlResponse).find("datacontainer > created").text();
    this.dataContainer.lastUser = $(xmlResponse).find("datacontainer > lastuser").text();
    this.dataContainer.lastUserID = $(xmlResponse).find("datacontainer > lastuserid").text();
    this.dataContainer.lastChanged = $(xmlResponse).find("datacontainer > lastchanged").text();
    this.dataContainer.accessType = $(xmlResponse).find("datacontainer > accesstype").text();

    var xmlDoc = $.parseXML('<xml></xml>');
    $(xmlDoc).find("xml").append($("<root>" + $(xmlResponse).find("datacontainer > xmldata").html() + "</root>"));
    this.dataContainer.xmlData = $(xmlDoc).find("root");
}

GAEDataController.prototype.replaceXmlData = function (xmlData) {
    var xmlDoc = $.parseXML('<xml></xml>');
    $(xmlDoc).find("xml").append($("<root>" + xmlData + "</root>"));
    ctr.dataContainer.xmlData = $(xmlDoc).find("root");
}

GAEDataController.prototype.blockUI = function () {
    $.mobile.loading("show");
}

GAEDataController.prototype.unblockUI = function () {
    $.mobile.loading("hide");
}



