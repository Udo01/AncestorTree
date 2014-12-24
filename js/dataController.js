function dataController()
{
	//load app config
	this.loadAppConfig=function(dataPath){
		var isLoaded;
		  var jqXHR=$.ajax({
		    url: dataPath,
		    dataType: "text",
		    async:false
		  })
		  .success(function(result) { 
                ctr.appConfig=$.parseXML('<xml></xml>');
		    	$(ctr.appConfig).find("xml").append($(result));
		        isLoaded=true;
		        })
		  .error(function(jqXHR, textStatus, errorThrown) { 
		        ctr.appConfig=null; 
		        isLoaded=false;
		        })
		return isLoaded;
	}	
	
//load global settings
	this.loadSettings=function(dataPath){
		var isLoaded;
		  var jqXHR=$.ajax({
		    url: dataPath,
		    dataType: "text",
		    async:false
		  })
		  .success(function(result) { 
		        ctr.xmlSettings=$.parseXML('<xml></xml>');
		    	$(ctr.xmlSettings).find("xml").append($(result));
		        isLoaded=true;
		        })
		  .error(function(jqXHR, textStatus, errorThrown) { 
		        ctr.xmlSettings=null; 
		        isLoaded=false;
		        })
		return isLoaded;
	}

	this.loadStaticData=function(filePath,accessType){
		  var success;
		  var jqXHR=$.ajax({
			url: filePath,
		    dataType: "text",
		    async:false
		  })
		  .success(function(result) {
			  	ctr.dataContainer={};
			  	ctr.dataContainer.id=-1;
			  	ctr.dataContainer.name=ctr.getPageResource("home","newProjectName");
			  	ctr.dataContainer.description="";
			  	ctr.dataContainer.owner="";
			  	ctr.dataContainer.created="";
			  	ctr.dataContainer.lastUser="";
			  	ctr.dataContainer.lastChanged="";
			  	ctr.dataContainer.accessType=accessType;

				var xmlDoc=$.parseXML('<xml></xml>');
		    	$(xmlDoc).find("xml").append($("<root>"+result+"</root>"));
		    	ctr.dataContainer.xmlData=$(xmlDoc).find("root");

	            success=true;
		        })
		  .error(function(jqXHR, textStatus, errorThrown) { 
			  ctr.dataContainer=null; 
		        success=false;
		        })
		return success;
	}	
//add empty dataContainer
this.addEmptyDataContainer=function()
	{
		ctr.dataContainer={};
	  	ctr.dataContainer.id=-1;
	  	ctr.dataContainer.name=ctr.getPageResource("home","newProjectName");
	  	ctr.dataContainer.description="";
	  	ctr.dataContainer.owner="";
	  	ctr.dataContainer.created="";
	  	ctr.dataContainer.lastUser="";
	  	ctr.dataContainer.lastChanged="";
	  	ctr.dataContainer.accessType="private";
	}	
this.getEventType=function(langISO,typeName)
{
        var type=$(ctr.xmlSettings).find("eventType[name='"+typeName+"'] type[lang='"+langISO+"']");
        return type;
}

this.getEventTypesList=function(langISO)
{
        var types=$(ctr.xmlSettings).find("eventType type[lang='"+langISO+"']");
        
        //sort list
        function cmp(x, y){ // generic comparison function
        	return x > y ? 1 : x < y ? -1 : 0; 
        }
        types.sort(function(a, b){
            return [cmp($(a).find("name").text(), $(b).find("name").text())] 
                 < [cmp($(b).find("name").text(), $(a).find("name").text())] ? -1:1;
        });
        
        return types;
}

this.getInfoType=function(langISO,typeName)
{
        var type=$(ctr.xmlSettings).find("infoType[name='"+typeName+"'] type[lang='"+langISO+"']");
        return type;
}

this.getInfoTypesList=function(langISO)
{
        var types=$(ctr.xmlSettings).find("infoType type[lang='"+langISO+"']");
        //sort list
        function cmp(x, y){ // generic comparison function
        	return x > y ? 1 : x < y ? -1 : 0; 
        }
        types.sort(function(a, b){
            return [cmp($(a).find("name").text(), $(b).find("name").text())] 
                 < [cmp($(b).find("name").text(), $(a).find("name").text())] ? -1:1;
        });
        return types;
}

this.getDocumentType=function(langISO,typeName)
{
        var type=$(ctr.xmlSettings).find("documentType[name='"+typeName+"'] type[lang='"+langISO+"']");
        return type;
}

this.getDocumentTypesList=function(langISO)
{
        var types=$(ctr.xmlSettings).find("documentType type[lang='"+langISO+"']");
        
        //sort list
        function cmp(x, y){ // generic comparison function
        	return x > y ? 1 : x < y ? -1 : 0; 
        }
        types.sort(function(a, b){
            return [cmp($(a).find("name").text(), $(b).find("name").text())] 
                 < [cmp($(b).find("name").text(), $(a).find("name").text())] ? -1:1;
        });
        
        return types;
}

this.getDataRole=function(langISO,roleName)
{
        var role=$(ctr.xmlSettings).find("dataRole[name='"+roleName+"'] role[lang='"+langISO+"']");
        return role;
}

this.getDataRoleList=function(langISO)
{
        var roles=$(ctr.xmlSettings).find("dataRole role[lang='"+langISO+"']");
        return roles;
}

this.getPersonList=function()
{
	var personList=[];
    if(ctr.dataContainer.xmlData!=null)
    {
    	$(ctr.dataContainer.xmlData).find("person").each(function(){
        var birthYear=$(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+$(this).attr('id')+"')").parent().find("date").attr('year');
        if(birthYear==null)birthYear="";
        personList.push({
                        id:$(this).attr('id'),
                        Name:{givn:$(this).find('name').attr('givn'),surn:$(this).find('name').attr('surn'),maid:$(this).find('name').attr('maid')},
                        Birth:{Date:{year:birthYear}}
                        });
        });
        }
    
    //group list by name and birthyear
    function cmp(x, y){ // generic comparison function
    	return x > y ? 1 : x < y ? -1 : 0; 
    }
    personList.sort(function(a, b){
        return [cmp(a.Name.surn, b.Name.surn), cmp(a.Birth.Date.year, b.Birth.Date.year)] 
             < [cmp(b.Name.surn, a.Name.surn), cmp(b.Birth.Date.year, a.Birth.Date.year)] ? -1:1;
    });
        return personList;
}

//get personlist without ids from list with gender if not null     
this.getQueryPersonList=function(nonIdList,gender)
{
	var personList=[];
    if(ctr.dataContainer.xmlData!=null)
    {
        $(ctr.dataContainer.xmlData).find("person").each(function(){
        var birthYear=$(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+$(this).attr('id')+"')").parent().find("date").attr('year');
        
        if((jQuery.inArray($(this).attr('id'), nonIdList)==-1 && $(this).attr('gender')==gender)|| (jQuery.inArray($(this).attr('id'), nonIdList)==-1 && gender==null))
            {
                personList.push({
                                id:$(this).attr('id'),
                                Name:{givn:$(this).find('name').attr('givn'),surn:$(this).find('name').attr('surn'),maid:$(this).find('name').attr('maid')},
                                Birth:{Date:{year:birthYear}}
                                });
            }
        });
    }
return personList;
}

this.getPerson=function(id)
{
    var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+id+"']");

    var person={        
                id:id,
                gender:personXml.attr('gender'),
                Name:{givn:personXml.find('name').attr('givn'),surn:personXml.find('name').attr('surn'),maid:personXml.find('name').attr('maid')},
                Events: [],
                Infos: [],
                Docs:[]
        };
    addEvents(personXml,person);
    addInfos(personXml,person);
    addDocs(personXml,person);
return person;
}

this.savePerson = function(person)
{
    var id=person.id;
    var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+id+"']");
    //save name
    personXml.find('name').attr('givn',person.Name.givn);
    personXml.find('name').attr('surn',person.Name.surn);
    personXml.find('name').attr('maid',person.Name.maid);
    //save gender
    personXml.attr('gender',person.gender);

    //save events  
    saveEvents(personXml,person);
    //save infos  
    saveInfos(personXml,person);
    //save docs  
    saveDocs(personXml,person);
} 

var addEvents = function(personXml,person){
    var events=$(ctr.dataContainer.xmlData).find("event personref").filter(function() {
                return $(this).text() == personXml.attr('id');
                }).parent(); 

    for(var i=0;i<events.length;i++){

        var event={   
                name:$(events[i]).attr('type'),     
                pos:i,
                Date:{
                      year:$(events[i]).find('date').attr('year'),
                      month:$(events[i]).find('date').attr('month'),
                      day:$(events[i]).find('date').attr('day')
                      },
                Place:{
                      street:$(events[i]).find('place').attr('street'),
                      zip:$(events[i]).find('place').attr('zip'),
                      city:$(events[i]).find('place').attr('city'),
                      country:$(events[i]).find('place').attr('country')
                       },
                 Text:$(events[i]).find("text").text()
                }
person.Events.push(event);
}
    //sortItemsByDateAsc(person.Events);
}

var addInfos = function(personXml,person){
    var infos=$(ctr.dataContainer.xmlData).find("info personref").filter(function() {
                return $(this).text() == personXml.attr('id');
                }).parent(); 
    for(var i=0;i<infos.length;i++){
        var info={   
                name:$(infos[i]).attr('type'),     
                pos:i,
                Text:$(infos[i]).find("text").text()
                }
    person.Infos.push(info);
}
}

var addDocs = function(personXml,person){
    var docs=$(ctr.dataContainer.xmlData).find("doc personref").filter(function() {
    			return $(this).text() == personXml.attr('id');
                }).parent(); 
    for(var i=0;i<docs.length;i++){

        var doc={
        		type:$(docs[i]).attr('type'), 
        		resource:$(docs[i]).find('resource').text(), 
        		thumbnail:$(docs[i]).find('thumbnail').text(),
        		title:$(docs[i]).find('title').text(), 
                pos:i,
                owner:{
                	personref:$(docs[i]).find('owner personref').text(),
                    text:$(docs[i]).find('owner text').text()
                    },
                Date:{
                      year:$(docs[i]).find('date').attr('year'),
                      month:$(docs[i]).find('date').attr('month'),
                      day:$(docs[i]).find('date').attr('day')
                      },
                Place:{
                      street:$(docs[i]).find('place').attr('street'),
                      zip:$(docs[i]).find('place').attr('zip'),
                      city:$(docs[i]).find('place').attr('city'),
                      country:$(docs[i]).find('place').attr('country')
                       },
                 Text:$(docs[i]).find("text").text()
                }
person.Docs.push(doc);
}
    //sortItemsByDateAsc(person.Docs);
}

var sortItemsByDateAsc=function(items){
    items.sort(function(a, b) {
       dateA=new Date(a.Date.year,a.Date.month,a.Date.day); 
       dateB=b.Date.year>0 ? new Date(b.Date.year,b.Date.month,b.Date.day) :null; 
       return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
    })
}

var saveEvents = function(personXml,person){
    var xmlEvents=$(ctr.dataContainer.xmlData).find("event personref").filter(function() {
                return $(this).text() == personXml.attr('id');
                }).parent(); 

    for(var xe=0;xe<xmlEvents.length;xe++)
    {
        events=getJsonAtPos(person.Events,xe)
        if(events.length>0)
        {
            //save existing events
            $(xmlEvents[xe]).find('date').attr('day',events[0].Date.day);
            $(xmlEvents[xe]).find('date').attr('month',events[0].Date.month);
            $(xmlEvents[xe]).find('date').attr('year',events[0].Date.year);
            $(xmlEvents[xe]).find('place').attr('street',events[0].Place.street);
            $(xmlEvents[xe]).find('place').attr('zip',events[0].Place.zip);
            $(xmlEvents[xe]).find('place').attr('city',events[0].Place.city);
            $(xmlEvents[xe]).find('place').attr('country',events[0].Place.country);
            $(xmlEvents[xe]).find("text").text(events[0].Text);
        }
        //remove removed events
        else $(xmlEvents[xe]).remove();
    }
        //add new events which have pos of -1
        var newEvents=getJsonAtPos(person.Events,-1);

        for(var ne=0;ne<newEvents.length;ne++)
        {
            $(ctr.dataContainer.xmlData).find('events').append($("<event type='"+newEvents[ne].name+"'><personref>"+personXml.attr('id')+"</personref><date type='exact' year='"+newEvents[ne].Date.year+"' month='"+newEvents[ne].Date.month+"' day='"+newEvents[ne].Date.day+"'></date><place street='"+newEvents[ne].Place.street+"' zip='"+newEvents[ne].Place.zip+"' city='"+newEvents[ne].Place.city+"' country='"+newEvents[ne].Place.country+"'></place><text>"+newEvents[ne].Text+"</text></event>"));
        }
}

var saveInfos = function(personXml,person){
    var xmlInfos=$(ctr.dataContainer.xmlData).find("info personref").filter(function() {
                return $(this).text() == personXml.attr('id');
                }).parent(); 

    for(var xi=0;xi<xmlInfos.length;xi++)
    {
        infos=getJsonAtPos(person.Infos,xi)
        if(infos.length>0)
        {
            //save existing infos
            $(xmlInfos[xi]).find("text").text(infos[0].Text);
        }
        //remove removed infos
        else $(xmlInfos[xi]).remove();
    }
        //add new infos which have pos of -1
        var newInfos=getJsonAtPos(person.Infos,-1);
        for(var ni=0;ni<newInfos.length;ni++)
        {
             $(ctr.dataContainer.xmlData).find('infos').append($("<info type='"+newInfos[ni].name+"'><personref>"+personXml.attr('id')+"</personref><text>"+newInfos[ni].Text+"</text></info>"));
       }
}

var saveDocs = function(personXml,person){
    var xmlDocs=$(ctr.dataContainer.xmlData).find("doc personref").filter(function() {
                return $(this).text() == personXml.attr('id');
                }).parent(); 

    for(var xd=0;xd<xmlDocs.length;xd++)
    {
    	docs=getJsonAtPos(person.Docs,xd)
        if(docs.length>0)
        {
            //save existing docs
        	$(xmlDocs[xd]).find("title").text(docs[0].title);
        	$(xmlDocs[xd]).find("resource").text(docs[0].resource);
        	$(xmlDocs[xd]).find("thumbnail").text(docs[0].thumbnail);
            $(xmlDocs[xd]).find('date').attr('day',docs[0].Date.day);
            $(xmlDocs[xd]).find('date').attr('month',docs[0].Date.month);
            $(xmlDocs[xd]).find('date').attr('year',docs[0].Date.year);
            $(xmlDocs[xd]).find('place').attr('street',docs[0].Place.street);
            $(xmlDocs[xd]).find('place').attr('zip',docs[0].Place.zip);
            $(xmlDocs[xd]).find('place').attr('city',docs[0].Place.city);
            $(xmlDocs[xd]).find('place').attr('country',docs[0].Place.country);
            $(xmlDocs[xd]).find("text").text(docs[0].Text);
            $(xmlDocs[xd]).find("owner text").text("");
            $(xmlDocs[xd]).find("owner personref").text("");
        }
        //remove removed events
        else $(xmlDocs[xd]).remove();
    }
        //add new docs which have pos of -1
        var newDocs=getJsonAtPos(person.Docs,-1);
        //insert docs tag if not present
        if($(ctr.dataContainer.xmlData).find('docs').length==0)$(ctr.dataContainer.xmlData).find('infos').append($("<docs></docs>"));

        for(var nd=0;nd<newDocs.length;nd++)
        {
            $(ctr.dataContainer.xmlData).find('docs').append($("<doc type='"+newDocs[nd].type+"'><personref>"+personXml.attr('id')+"</personref><title>"+newDocs[nd].title+"</title><resource>"+newDocs[nd].resource+"</resource><thumbnail>"+newDocs[nd].thumbnail+"</thumbnail><owner><personref></personref><text></text></owner><date type='exact' year='"+newDocs[nd].Date.year+"' month='"+newDocs[nd].Date.month+"' day='"+newDocs[nd].Date.day+"'></date><place street='"+newDocs[nd].Place.street+"' zip='"+newDocs[nd].Place.zip+"' city='"+newDocs[nd].Place.city+"' country='"+newDocs[nd].Place.country+"'></place><text>"+newDocs[nd].Text+"</text></doc>"));
        }
}

var getJsonAtPos=function(items,pos)
{
    return jQuery.grep(items, function(n, i){return(n.pos == pos);});
}


//data for treeview


this.getDescendentData=function(person)
{
	var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+person.id+"']");
	
    var jsonData=getPersonJSON(person.id);
    if(personXml!=null && jsonData!=null)
    	{
    	addDescendantJSON(jsonData,personXml);
    	}
    //alert(JSON.stringify(jsonData, null, 2));
    return jsonData;
}

this.getAncestorData=function(person)
{
	var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+person.id+"']");
	
	var jsonData=getPersonJSON(person.id);
    if(personXml!=null && jsonData!=null)
    	{
    	addAncestorJSON(jsonData,personXml);
    	}
    return jsonData;
}

var addDescendantJSON=function(jsonData,parentPersonXml)
{
	var familyXml=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+parentPersonXml.attr('id')+"']").parent();

    if(familyXml.length==0)familyXml=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+parentPersonXml.attr('id')+"']").parent();
    if(familyXml.length>0)
    {
    	var childList=$(familyXml).find("child");
        if(childList.length>0){
        //sort list
        function cmp(idX, idY){ // comparison function
            var birthYearX=parseInt($(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+idX+"')").parent().find("date").attr('year'));
            var birthYearY=parseInt($(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+idY+"')").parent().find("date").attr('year'));
        	return birthYearX > birthYearY ? 1 : birthYearX < birthYearY ? -1 : 0; 
        }

        childList.sort(function(a, b){
            return [cmp($(a).attr('idref'), $(b).attr('idref'))] 
                 < [cmp($(b).attr('idref'), $(a).attr('idref'))] ? -1:1;
        });
        for (var c = 0; c < childList.length; c++){
            var personJSON=getPersonJSON($(childList[c]).attr('idref'));
            var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+$(childList[c]).attr('idref')+"']");

            if(personXml!=null && personJSON!=null)
            {
            	jsonData.children.push(personJSON);
                addDescendantJSON(personJSON,personXml);
            }
        }
        }
    }
}

var addAncestorJSON=function(jsonData,childPersonXml)
{
    var familyXml=$(ctr.dataContainer.xmlData).find("relationship child[idref='"+childPersonXml.attr('id')+"']").parent();
    
    var fatherId=$(familyXml).find("father").attr("idref");
    var motherId=$(familyXml).find("mother").attr("idref");
    if(fatherId!=null && fatherId!="")
    {
        var fatherXml=$(ctr.dataContainer.xmlData).find("person[id='"+fatherId+"']");
        fatherJSON=getPersonJSON(fatherId);
        jsonData.children.push(fatherJSON);
        addAncestorJSON(fatherJSON,fatherXml);
    }
    if(motherId!=null && motherId!="")
    {
        var motherXml=$(ctr.dataContainer.xmlData).find("person[id='"+motherId+"']");
        motherJSON=getPersonJSON(motherId);
        jsonData.children.push(motherJSON);
        addAncestorJSON(motherJSON,motherXml);
    }
}

//create list of all descendant/ancestor and self-ids
this.getAllRelationIds=function(idMainPerson)
{
    var relationsList=[];
    //person self
    relationsList.push(idMainPerson);
    //descendants and partner
    addDescendantAndPartnerIds(idMainPerson,relationsList);
    //ancestors
    addAncestorIds(idMainPerson,relationsList);
    return relationsList;
}

var addDescendantAndPartnerIds=function(idPerson,relationsList)
{
    var familiesXml;
    var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']");
    var gender=$(personXml).attr("gender");

    if(gender=="m")familiesXml=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").parent();
    if(gender=="f")familiesXml=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").parent();
    
    if(familiesXml!=null && familiesXml.length>0)
    {
        if(gender=="m")relationsList.push($(familiesXml).find("mother").attr("idref"));
        $(familiesXml).find("child").each(function(){
            relationsList.push($(this).attr('idref'));
            addDescendantAndPartnerIds($(this).attr('idref'),relationsList);
        })
    }
}

var addAncestorIds=function(idPerson,relationsList)
{
    var familyXml=$(ctr.dataContainer.xmlData).find("relationship child[idref='"+idPerson+"']").parent();
    
    var fatherId=$(familyXml).find("father").attr("idref");
    var motherId=$(familyXml).find("mother").attr("idref");
    if(fatherId!=null && fatherId!="")
    {
        relationsList.push(fatherId);
        addAncestorIds(fatherId,relationsList);
    }
    if(motherId!=null && motherId!="")
    {
        relationsList.push(motherId);
        addAncestorIds(motherId,relationsList);
    }
}

var getPersonNode=function(id)
{
        var node=null;
        var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+id+"']");
        if(personXml.length>0)
        {
            var nameGivn=personXml.find('name').attr('givn');
            var nameSurn=personXml.find('name').attr('surn');
            var nameMaid=personXml.find('name').attr('maid');
            var birthYear=$(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+id+"')").parent().find("date").attr('year');
            if(birthYear==null)birthYear="";
            var portraitpicture=$(ctr.dataContainer.xmlData).find("doc[type='portraitpicture'] personref:contains('"+id+"')").parent().find("thumbnail").text();
            if(portraitpicture==null)portraitpicture=$(ctr.dataContainer.xmlData).find("doc[type='portraitpicture'] personref:contains('"+id+"')").parent().find("source").text();
            node=document.createElement("node");
            node.setAttribute("id",id);
            var t=0;
            node.setAttribute("text"+t,nameGivn);t++;
            node.setAttribute("text"+t,nameSurn);t++;
            if(nameMaid!=null && nameMaid!="") {node.setAttribute("text"+t,"("+nameMaid+")");t++;}
            node.setAttribute("text"+t,birthYear);
            if(portraitpicture!=null && portraitpicture!="")node.setAttribute("picture",portraitpicture);
        }
        return node;
}

var getPersonJSON=function(id)
{
        var json=null;
        var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+id+"']");
        if(personXml.length>0)
        {
            var namegivn=personXml.find('name').attr('givn');
            var namesurn=personXml.find('name').attr('surn');
            var namemaid=personXml.find('name').attr('maid');
            var birthyear=$(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+id+"')").parent().find("date").attr('year');
            if(birthyear==null)birthyear="";
            var portraitpicture=$(ctr.dataContainer.xmlData).find("doc[type='portraitpicture'] personref:contains('"+id+"')").parent().find("thumbnail").text();
            if(portraitpicture==null)portraitpicture=$(ctr.dataContainer.xmlData).find("doc[type='portraitpicture'] personref:contains('"+id+"')").parent().find("source").text();
            
            json=	{id:id,
            		 data: {
            			portraitpicture:portraitpicture,
            			namegivn:namegivn,
            			namesurn:namesurn,
            			namemaid:namemaid,
            			birthyear:birthyear
            		},
            		children:[]
            		}
        }
        return json;
}

//data for family view
this.getFamilyData=function(person)
{
	var familiesXml;
    var personXml=$(ctr.dataContainer.xmlData).find("person[id='"+person.id+"']");
    
    var gender=$(personXml).attr("gender");
    if(gender=="m")familiesXml=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+person.id+"']").parent();
    if(gender=="f")familiesXml=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+person.id+"']").parent();

    var parentFamilyXml=$(ctr.dataContainer.xmlData).find("relationship child[idref='"+person.id+"']").parent();
    var fatherId=$(parentFamilyXml).find("father").attr("idref");
    var motherId=$(parentFamilyXml).find("mother").attr("idref");
    
    var nodes=document.createElement("nodes");
    
    //add person
    var person=getPersonNode(person.id);
    if(person==null)
    {
        person=document.createElement("node");
        person.setAttribute("id",-1);  
    }
    
    person.setAttribute("data-role","person");
    person.setAttribute("data-idPerson",person.id);
    person.setAttribute("data-idMainPerson",person.id);
    nodes.appendChild(person);
    
    //add father
    var father=getPersonNode(fatherId);
    if(father==null)
    {
        father=document.createElement("node");
        father.setAttribute("id",-1);   
    }
    father.setAttribute("data-role","father"); 
    father.setAttribute("data-idMainPerson",person.id); 
    father.setAttribute("data-idPerson",fatherId);     
    nodes.appendChild(father);
    
    //add mother
    mother=getPersonNode(motherId);
    if(mother==null)
    {
        mother=document.createElement("node");
        mother.setAttribute("id",-1);   
    }
    mother.setAttribute("data-role","mother"); 
    mother.setAttribute("data-idMainPerson",person.id);
    mother.setAttribute("data-idPerson",motherId);  
    nodes.appendChild(mother);     
    
    //add families
    var families=document.createElement("families");
    if(familiesXml!=null){
    for(var f=0;f<familiesXml.length;f++)
    {
        var family=document.createElement("family");
        var partnerXml;
        if(gender=="m")partnerXml=$(familiesXml[f]).find("mother");
        if(gender=="f")partnerXml=$(familiesXml[f]).find("father");
        var partnerId=$(partnerXml).attr("idref")
        partner= getPersonNode(partnerId);
        if(partner==null)
        {
            partner=document.createElement("node");
            partner.setAttribute("id",-1);   
        }
        partner.setAttribute("data-role","partner");
        partner.setAttribute("data-idPerson",partnerId);
        partner.setAttribute("data-idMainPerson",person.id);
        partner.setAttribute("data-familyPos",f);        
        family.appendChild(partner); 

        var childrenXml=$(familiesXml[f]).find("child");
        
        //add childpos to item because pos will be lost after sorting
        for(var p=0;p<childrenXml.length;p++)
        {
        	childrenXml[p].setAttribute("pos",p);	
        }

        //sort list
        function cmp(idX, idY){ // comparison function
            var birthYearX=parseInt($(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+idX+"')").parent().find("date").attr('year'));
            var birthYearY=parseInt($(ctr.dataContainer.xmlData).find("event[type='birth'] personref:contains('"+idY+"')").parent().find("date").attr('year'));
            return birthYearX > birthYearY ? 1 : birthYearX < birthYearY ? -1 : 0; 
        }

        childrenXml.sort(function(a, b){
            return [cmp($(a).attr('idref'), $(b).attr('idref'))] 
                 < [cmp($(b).attr('idref'), $(a).attr('idref'))] ? -1:1;
        });
        
        for(var c=0;c<childrenXml.length;c++)
        {
            var childId=$(childrenXml[c]).attr("idref")
            var child=getPersonNode(childId);
            
            if(child==null)
            {
                child=document.createElement("node");
                child.setAttribute("id",-1); 
            }
            child.setAttribute("data-role","child");
            child.setAttribute("data-idMainPerson",person.id);
            child.setAttribute("data-idPerson",childId);
            child.setAttribute("data-familyPos",f);
            child.setAttribute("data-childPos",childrenXml[c].getAttribute("pos"));
            family.appendChild(child);
            //remove attribute pos from sorting
            childrenXml[c].removeAttribute("pos");
        }
        families.appendChild(family);
    }
    }
    
    nodes.appendChild(families);
    return nodes;
}

//methods for manipulating persons

this.deletePerson=function(idPerson)
{
    //remove all connections
    this.removeAllConnection(idPerson);
	
	//remove person
    $(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']").remove();
    
    //remove events
    $(ctr.dataContainer.xmlData).find("event personref").filter(function() {
                return $(this).text() == idPerson;
                }).parent().remove(); 
    
    //remove infos
    $(ctr.dataContainer.xmlData).find("info personref").filter(function() {
                return $(this).text() == idPerson;
                }).parent().remove(); 
}

this.removeAllConnection=function(idPerson)
{
    var gender=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']").attr("gender");

	//remove person from family as parent
    var families;
    if(gender=="m")
    {
        families=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").parent();
        $(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").attr("idref","");
    }
    if(gender=="f")
    {
        families=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").parent();
        $(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").attr("idref",""); 
    }
    //remove family if there are no child
    for(var f=0;f<families.length;f++)
    {
        if($(families[f]).find("child").length==0)$(families[f]).remove();  
    }
    //remove person from family as child
    $(ctr.dataContainer.xmlData).find("relationship child[idref='"+idPerson+"']").remove(); 	
}

//remove connection from family
this.deleteConnection=function(mainPersonId,personId,dataRole)
{
	switch(dataRole)
		{
			case "person":
			    	this.removeAllConnection(personId);
				break;
			case "father":
			       $(ctr.dataContainer.xmlData).find("relationship child[idref='"+mainPersonId+"']").parent().find("father").attr("idref","");
            break;
            case "mother":
			       $(ctr.dataContainer.xmlData).find("relationship child[idref='"+mainPersonId+"']").parent().find("mother").attr("idref","");
            break;
            case "child":
			       var families=$(ctr.dataContainer.xmlData).find("relationship child[idref='"+personId+"']").parent();
			       for(var f=0;f<families.length;f++)
			       {
			        if($(families[f]).find("father").attr("idref")==mainPersonId || $(families[f]).find("mother").attr("idref")==personId)$(families[f]).find("child[idref='"+personId+"']").remove();
			       }
			break;         
			case "partner":
			       var family;
			       family= $(ctr.dataContainer.xmlData).find("relationship father[idref='"+mainPersonId+"']").parent();
			       if(family.length>0)
			       {
			            if($(family).find("mother").attr("idref")==personId)$(family).find("mother").attr("idref","");
			       }
			       if(family.length==0)
			       {
			       	   family= $(ctr.dataContainer.xmlData).find("relationship mother[idref='"+mainPersonId+"']").parent();
			           if(family.length>0)
			           {
			                if($(family).find("father").attr("idref")==personId)$(family).find("father").attr("idref","");
			           }
			       }
            break;
        }
}

this.addFamily=function(idPerson)
{
      var person=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']");
      var gender=$(person).attr("gender");

      if(gender=="m")
      {
        $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref='"+idPerson+"'></father><mother idref=''></mother></relationship>"));
      }
      if(gender=="f")
      {
        $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref=''></father><mother idref='"+idPerson+"'></mother></relationship>"));
      }
}

this.deleteEmptyFamily=function(idPerson,familyPos)
{
      var person=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']");
      var gender=$(person).attr("gender");
      
      if(gender=="m")
      {
        var families=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").parent();
        $(families[familyPos]).remove();
      }
      if(gender=="f")
      {
        var families=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").parent();
        $(families[familyPos]).remove();
      }
}

this.deleteEmptyChild=function(idPerson,familyPos,childPos)
{
      var person=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']");
      var gender=$(person).attr("gender");
      
      if(gender=="m")
      {
        var families=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").parent();
        $($(families[familyPos]).find("child")[childPos]).remove();
      }
      if(gender=="f")
      {
        var families=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").parent();
        $($(families[familyPos]).find("child")[childPos]).remove();
      }
}

this.addEmptyChild=function(idPerson,familyPos)
{
	var person=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']");
      var gender=$(person).attr("gender");
      if(gender=="m")
      {
    	  $($(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']")[familyPos]).parent().append($("<child idref=''/>"));
      }
      if(gender=="f")
      {
        $($(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']")[familyPos]).parent().append($("<child idref=''/>"));
      }
}

//add new person to person
this.addNewPersonToPerson=function(newPerson,idMainPerson,dataRole,familyPos,childPos)
{
	var mainPerson=this.getPerson(idMainPerson);
    var mainPersonGender=$(mainPerson).attr("gender");
    var uuid=this.addPerson(newPerson);

        switch(dataRole)
		{
			case "father":
			       var family= $(ctr.dataContainer.xmlData).find("relationship child[idRef='"+idMainPerson+"']").parent();
			       if(family.length>0)$(family).find("father").attr("idref",uuid);
			       else $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref='"+uuid+"'></father><mother idRef=''></mother><child idref='"+idMainPerson+"'/></relationship>"));
            break;
            case "mother":
			       var family= $(ctr.dataContainer.xmlData).find("relationship child[idref='"+idMainPerson+"']").parent();
			       if(family.length>0)$(family).find("mother").attr("idref",uuid);
			       else $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref=''></father><mother idRef='"+uuid+"'></mother><child idref='"+idMainPerson+"'/></relationship>"));
            break;
            case "child":
                   if(mainPersonGender=="m")$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idMainPerson+"']").parent().find("child:eq("+childPos+")").attr("idref",uuid);
                   if(mainPersonGender=="f")$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idMainPerson+"']").parent().find("child:eq("+childPos+")").attr("idref",uuid);

			break;         
			case "partner":
			       if(mainPersonGender=="m")family= $($(ctr.dataContainer.xmlData).find("relationship father[idref='"+idMainPerson+"']").parent()[familyPos]).find("mother").attr("idref",uuid);
			       if(mainPersonGender=="f")family= $($(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idMainPerson+"']").parent()[familyPos]).find("father").attr("idref",uuid);

            break;
        }
}

//add existing person to person
this.addExistPersonToPerson=function(idSelectedPerson,idMainPerson,dataRole,familyPos,childPos)
{
    var mainPerson=this.getPerson(idMainPerson);
    var mainPersonGender=$(mainPerson).attr("gender");
    
        switch(dataRole)
		{
			case "father":
			       var family= $(ctr.dataContainer.xmlData).find("relationship child[idRef='"+idMainPerson+"']").parent();
			       if(family.length>0)$(family).find("father").attr("idref",idSelectedPerson);
			       else $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref='"+idSelectedPerson+"'></father><mother idref=''></mother><child idref='"+idMainPerson+"'/></relationship>"));
            break;
            case "mother":
			       var family= $(ctr.dataContainer.xmlData).find("relationship child[idref='"+idMainPerson+"']").parent();
			       if(family.length>0)$(family).find("mother").attr("idref",idSelectedPerson);
			       else $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref=''></father><mother idref='"+uuid+"'></mother><child idref='"+idMainPerson+"'/></relationship>"));
            break;
            case "child":
                   if(mainPersonGender=="m")$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idMainPerson+"']").parent().find("child:eq("+childPos+")").attr("idref",idSelectedPerson);
                   if(mainPersonGender=="f")$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idMainPerson+"']").parent().find("child:eq("+childPos+")").attr("idref",idSelectedPerson);

			break;         
			case "partner":
			       if(mainPersonGender=="m")family= $($(ctr.dataContainer.xmlData).find("relationship father[idref='"+idMainPerson+"']").parent()[familyPos]).find("mother").attr("idref",idSelectedPerson);
			       if(mainPersonGender=="f")family= $($(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idMainPerson+"']").parent()[familyPos]).find("father").attr("idref",idSelectedPerson);

            break;
        }
}

this.hasFather=function(idPerson)
{
    var father=$(ctr.dataContainer.xmlData).find("relationship child[idref='"+idPerson+"']").parent().find("father");
    if($(father).attr("idref")!=null && $(father).attr("idref")!="")return true;
    else return false;
}

this.hasMother=function(idPerson)
{
    var mother=$(ctr.dataContainer.xmlData).find("relationship child[idref='"+idPerson+"']").parent().find("mother");
    if($(mother).attr("idref")!=null && $(mother).attr("idref")!="")return true;
    else return false;
}

this.hasChildren=function(idPerson)
{
	var person=$(ctr.dataContainer.xmlData).find("person[id='"+idPerson+"']");
    var gender=$(person).attr("gender");
    var families;
    if(gender=="m")
    {
      families=$(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").parent();
    }
    if(gender=="f")
    {
      families=$(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").parent();
    }
    if(families.length>0)return true;
    else return false;
}

this.addChildToPerson=function(person,idPerson)
{
	var gender=$(this.getPerson(idPerson)).attr("gender");
    var uuid;

      if(gender=="m")
      {
    	uuid=this.addPerson(person);

    	if($(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']").parent().length>0 )
        {
        	$($(ctr.dataContainer.xmlData).find("relationship father[idref='"+idPerson+"']")[0]).parent().append($("<child idref='"+uuid+"'/>"));
        }
        else
        {
        	$(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref='"+idPerson+"'></father><mother idref=''></mother><child idref='"+uuid+"'/></relationship>"));
        }
      }
      if(gender=="f")
      {
        uuid=this.addPerson(person);
        if($(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']").parent().length>0)
        {
            $($(ctr.dataContainer.xmlData).find("relationship mother[idref='"+idPerson+"']")[0]).parent().append($("<child idref='"+uuid+"'/>"));
        }
        else
        {
            $(ctr.dataContainer.xmlData).find('relationships').append($("<relationship type='byological'><father idref=''></father><mother idref='"+idPerson+"'></mother><child idref='"+uuid+"'/></relationship>"));
        }
      }
}

this.addPerson=function(person)
{
	var uuid=this.generateUUID();
      $(ctr.dataContainer.xmlData).find('persons').append($("<person id='"+uuid+"' gender='"+person.gender+"'><name givn='"+person.Name.givn+"' surn='"+person.Name.surn+"'></name></person>"));
      $(ctr.dataContainer.xmlData).find('events').append($("<event type='birth'><personref>"+uuid+"</personref><date type='exact' year='"+person.Birth.year+"' month='"+person.Birth.month+"' day='"+person.Birth.day+"'></date><place street='' zip='' city='' country=''></place><text></Text></event>"));
      if(person.Name.maid!=null )(ctr.dataContainer.xmlData).find("person[id='"+uuid+"'] name").attr("maid",person.Name.maid);
      return uuid;  
}

//resource
this.getPageResource=function(pageName,pageItem,langISO)
{
	var resource=$(ctr.xmlSettings).find("page[name='"+pageName+"'] pageItem[name='"+pageItem+"'] item[lang='"+langISO+"']").text();
    return resource;
}
//app paramter
Controller.prototype.getAppSetting = function(settingName) {
    var setting =$(ctr.appConfig).find("setting[name='"+settingName+"']").text();
            return setting;
}

//UID
this.generateUUID=function()
{
   var chars = '0123456789abcdef'.split('');

   var uuid = [], rnd = Math.random, r;
   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4'; // version 4

   for (var i = 0; i < 36; i++)
   {
      if (!uuid[i])
      {
         r = 0 | rnd()*16;

         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
      }
   }
   return uuid.join('');
}

this.replaceXmlData=function(xmlData)
{
	var xmlDoc=$.parseXML('<xml></xml>');
	$(xmlDoc).find("xml").append($("<root>"+xmlData+"</root>"));
  	ctr.dataContainer.xmlData=$(xmlDoc).find("root");
}

}

