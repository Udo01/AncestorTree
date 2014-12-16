var thisTreeCtr=null;

var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

uiTreeController = function (container) {
	this.config = {
			infovisWrapper:'infovisWrapper',
			infovisContainer:'infovis',
			orientation:"TopBottom",
			nodeWidth:60,
			nodeHeight:60,
			nodeBorderWidth:2,
			nodeFillColor:"#deeeaa",
			nodeFillColorSelected:"#cdbbaa",
			nodeBorderColor:"#645A50",
			levelsToShow:6,
			font:"Arial",
			fontSize:12,
			fontColor:"#222222",
	        lineColor:"#645A50",
	        lineWidth:2
//			nodeGapX:10,
//			nodeGapY:20,
//	        textMarginLeft:4,
//	        textMarginTop:4,
//	        nodeFillOpacity:0.5,
//	        selectNodeFillColor:"rgb(160,150,140)",
//	        nodeIconSize:20,
//			WidthCtr:null,
	}
	this.status={
	    currentPersonID:null
	}
	this.version = "1.0";
	this.container = container;
	this.scroller=null;
	thisTreeCtr=this;
	this.initPage();
	this.initTreeConfigPanel();
}

uiTreeController.prototype.init=function(jsonData,treeType){

	if (treeType == "desc") {
		this.config.orientation="bottom";
	}
	if (treeType == "anc") {
		this.config.orientation="top";
	}
	
	//clear container
	$("#"+this.config.infovisContainer).empty();
	//set container.size
	$("#"+this.config.infovisContainer).css('height',$(window).height()+"px");
	$("#"+this.config.infovisContainer).css('width',$(window).width()+"px");
	//init data
    var json = jsonData;
    //end
    //init Node Types
    //Create a node rendering function that plots a fill
    //rectangle and a stroke rectangle for borders
    $jit.ST.Plot.NodeTypes.implement({
      'stroke-rect': {
        'render': function(node, canvas) {
          var width = node.getData('width'),
              height = node.getData('height'),
              pos = this.getAlignedPos(node.pos.getc(true), width, height),
              posX = pos.x + width/2,
              posY = pos.y + height/2;
          this.nodeHelper.rectangle.render('fill', {x: posX, y: posY}, width, height, canvas);
          this.nodeHelper.rectangle.render('stroke', {x: posX, y: posY}, width, height, canvas);
        }
      }
    });
    //end
    //init Spacetree
    //Create a new ST instance
    st = new $jit.ST({
        //id of viz container element
        injectInto: this.config.infovisContainer,
        //set distance between node and its children
        levelDistance: 50,
        levelsToShow: this.config.levelsToShow,
        //set an X offset
        //offsetX: this.config.offsetX,
        //offsetY: this.config.offsetY,
        orientation: this.config.orientation,
        Navigation: {
            enable:true,
            panning:true
          },
          
        //set node, edge and label styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            overridable: true,
            type: 'stroke-rect',
            height: this.config.nodeHeight,
            width: this.config.nodeWidth,
            //canvas specific styles
            CanvasStyles: {
              fillStyle: this.config.nodeFillColor,
              strokeStyle: this.config.nodeBorderColor,
              lineWidth: this.config.nodeBorderWidth
            }
        },
        Edge: {
            overridable: true,
            type: 'line',
            color: this.config.lineColor,
            lineWidth: this.config.lineWidth
        },
        Label: {
        	type: "HTML", //Native or HTML
        	size: 11,
        	style: 'normal',//bold,italic
        	color:'black'
        	},
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
 
        	 
        	var labelStr ='';
            if(node.data.portraitpicture!=null)labelStr+='<div class="treeNode" style="background-image: url('+node.data.portraitpicture+');background-repeat:no-repeat">';
            else labelStr+='<div class="treeNode">';
            labelStr+='<div>x'+node.data.namegivn+' '+node.data.namesurn;
            if(node.data.namemaid!=null && node.data.namemaid!="")labelStr+='<br/><span style="margin:0px;font-size:'+(thisTreeCtr.config.fontSize)*0.7+'px">('+node.data.namemaid+')</span>';
            if(node.data.birthyear!=null && node.data.birthyear!="")labelStr+='<br/>'+node.data.birthyear;
            labelStr+='</div></div>';
            label.innerHTML=labelStr;
            //event handler
            $(label).on('taphold', {nodeID: node.id,name:node.data.namegivn+' '+node.data.namesurn}, function(event) {
            	thisTreeCtr.treeNodePopup(event.data.nodeID,event.data.name);
            	});
            
            $(label).on('tap', {nodeID: node.id}, function(event) {
    			st.onClick(event.data.nodeID);
    			ctr.setSelectedPerson(event.data.nodeID);
            	});
 
        },
        onPlaceLabel: function(label, node) {
          var style = label.style;
          style.width = thisTreeCtr.config.nodeWidth + 'px';
          style.height = thisTreeCtr.config.nodeHeight + 'px';           
          style.color = thisTreeCtr.config.fontColor;
          style.fontSize = thisTreeCtr.config.fontSize+'px';
          style.cursor = 'pointer';
          style.textAlign= 'center';
          style.paddingTop = '3px';

          if (node.id==ctr.currentPerson.id) {
          	style.fontWeight = 'bold';
          }
        },
        
       
        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = thisTreeCtr.config.lineColor;
                adj.data.$lineWidth = thisTreeCtr.config.lineWidth*2;
            }
            else {
                adj.data.$color = thisTreeCtr.config.lineColor;
                adj.data.$lineWidth = thisTreeCtr.config.lineWidth;
            }
        },
        onAfterCompute: function(){
        	thisTreeCtr.changeTreeNodeStyle();
        },
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //emulate a click on the root node.
  st.onClick(st.root, { });  
  //end
  
    //handler for orientation
    $(".orBtn").on( "tap", function( event ) {
    	var orientation=$(this).attr("data-or");
    	$(".orBtn").hide();
        $( "#treeConfigPanel" ).panel( "close" );	
      st.switchPosition(orientation, "animate", {
    	  onComplete: function(){
    		  $(".orBtn").show();
      		}
  			});
    	});

    $jit.util.addEvent($jit.id('printTreeBtn'), 'click', function() {
    	var ctx = st.canvas.getCtx();

        var origLabels = st.fx.labels;
        st.fx.labels = new $jit.ST.Label['Native'](st);
        st.plot();
        var url = ctx.canvas.toDataURL();
        st.fx.labels = origLabels;
        st.plot();
        window.open(url, "New image");
    });
    
    
    //add click event for updating styles
    $jit.util.addEvent($jit.id('updateTreeBtn'), 'click', function() {
    		if(thisTreeCtr.init.busy) return;
    		thisTreeCtr.init.busy = true;
    		
      $( "#treeConfigPanel" ).panel( "close" );		
      
      st.graph.eachNode(function(n) {
  
        if(!isNaN($("#nodeWidthInp").val()*1)){
        	thisTreeCtr.config.nodeWidth=$("#nodeWidthInp").val()*1;
        	n.setData('width',thisTreeCtr.config.nodeWidth, 'end');
        }
        if(!isNaN($("#nodeHeightInp").val()*1)){
        	thisTreeCtr.config.nodeHeight=$("#nodeHeightInp").val()*1;
        	n.setData('height',thisTreeCtr.config.nodeHeight , 'end');
        }
        if(!isNaN($("#nodeBorderWidthInp").val()*1)){
        	thisTreeCtr.config.nodeBorderWidth=$("#nodeBorderWidthInp").val()*1;
        	n.setCanvasStyle('lineWidth',thisTreeCtr.config.nodeBorderWidth , 'end');
        }
        thisTreeCtr.config.nodeFillColor=$("#nodeFillColorInp").val();
        n.setCanvasStyle('fillStyle', thisTreeCtr.config.nodeFillColor, 'end');
        
        thisTreeCtr.config.nodeBorderColor=$("#nodeBorderColorInp").val();
        n.setCanvasStyle('strokeStyle',thisTreeCtr.config.nodeBorderColor, 'end');
        
        //set label styles
        if(!isNaN($("#fontSizeInp").val()*1)){
        	thisTreeCtr.config.fontSize=$("#fontSizeInp").val()*1;
            n.setLabelData('size', 12, 'end');
        }
            
        thisTreeCtr.config.fontColor=$("#fontColorInp").val();
        n.setLabelData('color', thisTreeCtr.config.fontColor, 'end');

        //set adjacency styles
        n.eachAdjacency(function(adj) {
            if(!isNaN($("#lineWidthInp").val()*1)){
            	thisTreeCtr.config.lineWidth=$("#lineWidthInp").val()*1;
            	adj.setData('lineWidth', thisTreeCtr.config.lineWidth, 'end');
            }
            thisTreeCtr.config.lineColor=$("#lineColorInp").val();
            adj.setData('color', thisTreeCtr.config.lineColor, 'end');
        });
              
      });
      //animate the changes from settings
      st.compute('end');
      st.fx.animate({
        modes: ['linear', 
                'node-property:width:height',
                'edge-property:lineWidth:color',
                'label-property:size:color',
                'node-style:fillStyle:strokeStyle:lineWidth'],
        duration: 1000,
        onComplete: function() {
        	thisTreeCtr.init.busy = false;
        	thisTreeCtr.changeTreeNodeStyle();
        }
      });
    });
    //end
}

uiTreeController.prototype.changeTreeNodeStyle=function(){
	var boxPadding=thisTreeCtr.config.nodeBorderWidth;
	var innerBoxWidth=thisTreeCtr.config.nodeWidth*1-(2*boxPadding);
	var innerBoxHeight=thisTreeCtr.config.nodeHeight*1-(2*boxPadding);
	
	$(".node[id='"+ctr.currentPerson.id+"'] div").css({"width": innerBoxWidth+"px","height": innerBoxHeight+"px","margin": "0px","padding":"0px","background-color":"red","opacity":"0.7","filter": "alpha(opacity = 70)"});
	$(".node").css({"padding":boxPadding+"px"});
	$(".treeNode").css({"width":innerBoxWidth+"px","height":innerBoxHeight+"px","background-size":innerBoxWidth+"px" });
	$(".treeNode div").css({"width": innerBoxWidth+"px","height": innerBoxHeight+"px","margin": "0px","padding":"0px","background-color":thisTreeCtr.config.nodeFillColor,"opacity":"0.7","filter": "alpha(opacity = 70)"});	
	$(".node[id='"+ctr.selectedPerson.id+"'] div").css({"width": innerBoxWidth+"px","height": innerBoxHeight+"px","margin": "0px","padding":"0px","background-color":thisTreeCtr.config.nodeFillColorSelected,"opacity":"0.7","filter": "alpha(opacity = 70)"});
	$(".treeNode div p").css({"margin":"0px"});
	
	$( '.treeNode div' ).on( 'vmouseover',function(event){
		  $(this).css({"opacity": "0.2","filter": "alpha(opacity = 20)"});
		});
	$( '.treeNode div' ).on( 'vmouseout',function(event){
		  $(this).css({"opacity": "0.7","filter": "alpha(opacity = 70)"});
		});
}

uiTreeController.prototype.initPage=function()
{
                var content= $(this.container).find("div[role='main']");
                content.empty(); 
                var contentStr=  
    				'<div id="'+this.config.infovisWrapper+'">'+
                		'<div id="'+this.config.infovisContainer+'"></div>'+
    				'</div>';
    			 $(content).append(contentStr);
}

	uiTreeController.prototype.initTreeConfigPanel=function()
	{
		var content= $("#treeConfigPanel");
	    content.empty();	
	    var contentStr= '<a href="#" data-rel="close" class="ui-btn ui-btn-right ui-icon-delete ui-btn-icon-notext ui-corner-all">'+ctr.getPageResource("global","close")+'</a>'+
	    '<div class="panel-content">'+
	    '<h3>'+ctr.getPageResource("treeConfigDlg","orientation")+'</h3>'+
	    '<div data-role="controlgroup" data-type="horizontal" style="margin:0px">'+
			'<a class="orBtn" data-or="left" href="#" data-role="button" data-icon="arrow-l" data-iconpos="notext" data-theme="c" data-inline="true">left</a>'+
			'<a class="orBtn" data-or="top" href="#" data-role="button" data-icon="arrow-u" data-iconpos="notext" data-theme="c" data-inline="true">top</a>'+
			'<a class="orBtn" data-or="right" href="#" data-role="button" data-icon="arrow-r" data-iconpos="notext" data-theme="c" data-inline="true">rigth</a>'+
			'<a class="orBtn" data-or="bottom" href="#" data-role="button" data-icon="arrow-d" data-iconpos="notext" data-theme="c" data-inline="true">buttom</a>'+
			'</div>'+
	        '<h3>'+ctr.getPageResource("treeConfigDlg","settings")+'</h3>'+
			'<button id="updateTreeBtn" data-theme="c" data-icon="back" data-mini="true">update</button>'+
	        '<div data-role="collapsible-set" data-theme="c" data-content-theme="d" data-mini="true">'+
	    '<div data-role="collapsible">'+
	        '<h3>box</h3>'+
	        '<label for="nodeWidthInp">width:</label>'+
	        '<input  type="range" id="nodeWidthInp" data-mini="true" min="0" max="200" value="'+this.config.nodeWidth+'" data-theme="c">'+
	        '<label for="nodeHeightInp">height:</label>'+
	        '<input  type="range" id="nodeHeightInp" data-mini="true" min="0" max="200" value="'+this.config.nodeHeight+'" data-theme="c">'+
	        '<label for="nodeBorderWidthInp">border-width:</label>'+
	        '<input  type="range" id="nodeBorderWidthInp" data-mini="true" min="0" max="5" value="'+this.config.nodeBorderWidth+'" data-theme="c">'+
	        '<label for="nodeFillColorInp">node-color:</label>'+
	        '<input type="text" id="nodeFillColorInp" value="'+this.config.nodeFillColor+'" data-mini="true" />'+  
	        '<label for="nodeBorderColorInp">border-color:</label>'+
	        '<input type="text" id="nodeBorderColorInp" value="'+this.config.nodeBorderColor+'" data-mini="true" />'+ 
	    '</div>'+
	    '<div data-role="collapsible">'+
	        '<h3>text</h3>'+
	        '<label for="fontColorInp">font-color:</label>'+
	        '<input type="text" id="fontColorInp" value="'+this.config.fontColor+'" data-mini="true" />'+ 
	        '<label for="fontSizeInp">font-size:</label>'+
	        '<input  type="range" id="fontSizeInp" data-mini="true" min="0" max="40" value="'+this.config.fontSize+'" data-theme="c">'+
	   ' </div>'+
	    '<div data-role="collapsible">'+
	        '<h3>line</h3>'+
	        '<label for="lineWidthInp">line-width:</label>'+
	        '<input  type="range" id="lineWidthInp" data-mini="true" min="0" max="5" value="'+this.config.lineWidth+'" data-theme="c">'+
	        '<label for="lineColorInp">line-color:</label>'+
	        '<input type="text" id="lineColorInp" value="'+this.config.lineColor+'" data-mini="true" />'+ 
	   ' </div>'+
	   '</div>'+
	    //'<a onclick="ctr.printTree(\''+treeStyle+'\')" href="#" title="'+ctr.getPageResource("global","print")+'" data-iconpos="right"><img src="icons/printer1.png" style="border: none"></a>'+
	    '<a id="printTreeBtn" href="#" title="'+ctr.getPageResource("global","print")+'" data-iconpos="right"><img src="icons/printer1.png" style="border: none"></a>'+    
	   '</div>';
	    $(content).html(contentStr);
	    $(content).trigger( "updatelayout" );
	}

uiTreeController.prototype.treeNodePopup=function(nodeID,name)
{
	var popup= $("#treeNodePopup");
    popup.empty(); 
    var contentStr= 
    	'<div data-role="header" data-theme="a" class="ui-corner-top">'+
    	'<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>'+
    	'<h1>'+name+'</h1>'+
    '</div>'+
    '<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content">'+
    	'<ul data-role="listview" data-inset="true" style="min-width:210px;" data-theme="d">'+
    		'<li data-role="divider" data-theme="e">'+ctr.getPageResource("treeNodePopup","chooseAction")+'</li>'+
    		'<li><a id="tc_setRootPersonBtn" href="#">'+ctr.getPageResource("treeNodePopup","setRoot")+'</a></li>'+
    		'<li><a id="tc_editPersonBtn" href="#">'+ctr.getPageResource("treeNodePopup","editPerson")+'</a></li>';
	if(ctr.treeType=="desc")
	{ 
        contentStr+='<li><a id="tc_addSonBtn" href="#">'+ctr.getPageResource("global","addSon")+'</a></li>';
        contentStr+='<li><a id="tc_addDaughterBtn" href="#">'+ctr.getPageResource("global","addDaughter")+'</a></li>';
    }
	if(ctr.treeType=="anc")
	{ 
        contentStr+='<li><a id="tc_addFatherBtn" href="#">'+ctr.getPageResource("global","addFather")+'</a></li>';
        contentStr+='<li><a id="tc_addMotherBtn" href="#">'+ctr.getPageResource("global","addMother")+'</a></li>';
    }
	
	contentStr+='</ul>'+
        '<a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c">Cancel</a>'+
    '</div>';

    $(popup).html(contentStr);
    $(thisTreeCtr.container).page("destroy").page();

    $("#tc_setRootPersonBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setCurrentPerson(event.data.nodeID);
		ctr.showTreeView(ctr.treeType);   
    	});
    $("#tc_editPersonBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setSelectedPerson(event.data.nodeID);
		ctr.showPersonView();  
    	});   
     $("#tc_addSonBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setSelectedPerson(event.data.nodeID);
		ctr.addChild("m"); 
		ctr.showTreeView("desc");
    	});  
    $("#tc_addDaughterBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setSelectedPerson(event.data.nodeID);
		ctr.addChild("f"); 
		ctr.showTreeView("desc");
    	});
    $("#tc_addFatherBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setSelectedPerson(event.data.nodeID);
		ctr.addFather(); 
		ctr.showTreeView("anc");
    	}); 
    $("#tc_addMotherBtn").on('tap', {nodeID: nodeID}, function(event) {
		ctr.setSelectedPerson(event.data.nodeID);
		ctr.addMother(); 
		ctr.showTreeView("anc");
    	})
    
    $(popup ).popup( "open" );
    $(popup ).popup( "option", "positionTo", "origin" );
}



$jit.ST.prototype.print = function() {
    var ctx = this.canvas.getCtx();

    var origLabels = this.fx.labels;
    this.fx.labels = new $jit.RGraph.Label['Native'](this)
    this.plot();
    var url = ctx.canvas.toDataURL();
    this.fx.labels = origLabels;
    this.plot();

    return url;
}; 



$jit.ST.Label.Native.implement({
        renderLabel: function(canvas, node, controller) {

        	var ctx = canvas.getCtx();
            var pos = node.pos.getc(true);
            var boxHeight=thisTreeCtr.config.nodeWidth;
            var boxWidth=thisTreeCtr.config.nodeHeight;
            var font=thisTreeCtr.config.font;
            var fontSize=thisTreeCtr.config.fontSize;
            
            var textMaxWidth = 0.9*boxWidth; 
            var textMaxHeight = 0.9*boxHeight;
            var lineHeight = fontSize;
            
            var textLines = [];
            // start of X
             var x = pos.x;
            // start of Y (e.g. middle of spacetree node box)
            var y = pos.y-boxHeight/2+lineHeight;
            var endY = y + textMaxHeight;
                  	
                  ctx.font = fontSize+"px"+font;
                  textLines = _splitIntoLine(node.data.namegivn, textMaxWidth,textLines);
                  textLines = _splitIntoLine(node.data.namesurn, textMaxWidth,textLines);
                  
                  
                  for (var i = 0; i < textLines.length && y < endY; i++) {
                          ctx.fillText(textLines[i],x,y);
                        y = y + lineHeight;
                  }


                  
                  /**
                   * Helper function:
                   * Splits given string aText into an array of strings
                   * where each string in array does not exceed aMaxWidth in px
length.
                   * @see http://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
                   */
                  function _splitIntoLine(aText, aMaxWidth,textLines) {
                          var words = (aText || "").split(" ");
                        var currWord = "";
                        var currlineText = "";
                        var currlinePx = 0;
                        for (var i = 0; i < words.length; i++) {
                                currWord = words[i];
                                currlinePx = ctx.measureText(currlineText + currWord).width;
                        if (currlinePx < aMaxWidth) {
                            currlineText += " " + currWord;
                        } else {
                            textLines.push(currlineText);
                            currlineText = currWord;
                        }
                        if (i === words.length-1) {
                            textLines.push(currlineText);
                            break;
                        }
                        }// for
                        return textLines;
                  }// fn _splitIntoLine

        }// renderLabel
}); 
