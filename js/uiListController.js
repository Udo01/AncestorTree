uiListController=function(pageContainer)
{
    this.container=pageContainer;
}

uiListController.prototype.addContent=function(personList)
{
		 //add list items
         var listContainer=$("#personLV");  
         //listContainer.empty();
         var str ='<li><a href="#" data-id="-1" onclick="ctr.showAddNewUnboundPersonDialog()">'+ctr.getPageResource("list","newPerson")+'</a></li>'; 
         for(var i=0;i<personList.length;i++)
         {
                var nameStr='';
                if(personList[i].Name.surn!=null && personList[i].Name.surn!='')nameStr+=personList[i].Name.surn+' ';
                if(personList[i].Name.maid!=null && personList[i].Name.maid!='')nameStr+='('+personList[i].Name.maid+') '; 
                if(personList[i].Name.givn!=null && personList[i].Name.givn!='')nameStr+=personList[i].Name.givn;
                
                str+='<li><a onclick="ctr.personListClicked(\''+personList[i].id+'\')" href="#">'+nameStr+' '+personList[i].Birth.Date.year+'</a></li>';
         }
         $(listContainer).html($(str));
         //$(listContainer).listview(); 
         $(listContainer).listview( "option", "filter", true );
         $(listContainer).listview( "refresh" );

}


uiListController.prototype.addNewUnboundPersonDialog = function() {
	var newPerson={};
	var content=$("#dialogPage").find("div[role='main']");
	content.empty();

	var contentStr =''
			+'<div data-role="fieldcontain">'
			+ '<div data-role="fieldcontain" style="margin-top:0px; padding-top:0px">'
			+ '<label for="personNameGivn_NUP">'
			+ ctr.getPageResource("global", "nameGvn")
			+ ':</label>'
			+ '<input type="text" id="personNameGivn_NUP" value=""/>'
			+ '<label for="personNameSurn_NUP">'
			+ ctr.getPageResource("global", "nameSurn")
			+ ':</label>'
			+ '<input type="text" id="personNameSurn_NUP" value="" />'
			+ '<label for="personNameMaid_NUP">'
			+ ctr.getPageResource("global", "nameMaid")
			+ ':</label>'
			+ '<input type="text" id="personNameMaid_NUP" value="" />'
			+ '</div>' + '<h3>' + ctr.getPageResource("global", "birth")
			+ ':</h3>' + '<div class="ui-grid-b">'
			+ '<div class="ui-block-a" style="padding-right:7px; width:60px">'
			+ '<label for="personBirthDay_NUP">'
			+ ctr.getPageResource("global", "day") + ':</label>'
			+ '<input type="number" id="personBirthDay_NUP" value=""/>'
			+ '</div>'
			+ '<div class="ui-block-b" style="padding-right:7px; width:60px">'
			+ '<label for="personBirthMonth_NUP">'
			+ ctr.getPageResource("global", "month") + ':</label>'
			+ '<input type="number" id="personBirthMonth_NUP" value=""/>'
			+ '</div>'
			+ '<div class="ui-block-c" style="padding-right:7px; width:60px">'
			+ '<label for="personBirthYear_NUP">'
			+ ctr.getPageResource("global", "year") + ':</label>'
			+ '<input type="number" id="personBirthYear_NUP" value=""/>'
			+ '</div>' + '</div>' + '<h3>'
			+ ctr.getPageResource("global", "gender") + ':</h3>';
 
	contentStr +='<div id="gender_CG_NUP" data-role="controlgroup" data-mini="true">'
	+ '<legend>'
	+ ctr.getPageResource("global", "gender")
	+ '</legend>'
	+ '<input id="personGenderMale_NUP" name="personGender_NUP"  value="m" type="radio">'
	+ '<label for="personGenderMale_NUP">'
	+ ctr.getPageResource("global", "male")
	+ '</label>'
	+ '<input id="personGenderFemale_NUP" name="personGender_NUP" value="f" type="radio">'
	+ '<label for="personGenderFemale_NUP">'
	+ ctr.getPageResource("global", "female")
	+ '</label>';
	contentStr += '<button id="addNewUnboundPersonBtn" class="ui-btn">'
		+ ctr.getPageResource("addPersonDlg", "addPerson")
		+ '</button>'
		+ '<a href="#" class="ui-btn" data-rel="back">'
		+ ctr.getPageResource("global", "cancel") + '</a>' + '</div>';
	
	$(content).append(contentStr);
	
	//init gender
	$("#gender_CG_NUP").controlgroup({
		defaults : true
	});
		$("input#personGenderMale_NUP").attr("checked", "checked");
	
	//refresh controls
	$("#gender_CG_NUP").controlgroup("refresh");
	$(content).find("input").textinput();
	$(content).find("textarea").textinput();
	
    $('#addNewUnboundPersonBtn').bind('click',function(event, ui){
        var newPerson={
            id:null,
            gender:null,
            Name:{givn:null,surn:null,maid:null},
            Birth:{day:null,month:null,year:null}
        };
        newPerson.gender=$('input[name="personGender_NUP"]:checked').val();
        newPerson.Name.givn=$("#personNameGivn_NUP").val();
        newPerson.Name.surn=$("#personNameSurn_NUP").val();
        newPerson.Name.maid=$("#personNameMaid_NUP").val();
        newPerson.Birth.day=$("#personBirthDay_NUP").val();
        newPerson.Birth.month=$("#personBirthMonth_NUP").val();
        newPerson.Birth.year=$("#personBirthYear_NUP").val();

        newPerson.id=ctr.addPerson(newPerson);
        ctr.setCurrentPerson(newPerson.id);
        ctr.showFamilyView();
    });
}
