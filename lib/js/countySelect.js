var urlBusinessService = "http://njgin.state.nj.us/ArcGIS/rest/services/Framework/GovernmentBoundaries/MapServer";
var indexCounty = "10";
var indexMunicipal = "14";
var ddlCounty = "county";
var ddlMunicipal = "municipality";
var countyOutFields = ["GNIS","COUNTY"];
var muniOutFields =["GNIS","MUN_LABEL","COUNTY"];

function buildSelect(){
		//create the County QueryTask
        var queryTaskCounty = new esri.tasks.QueryTask(urlBusinessService + "/" + indexCounty);
        //create the municipal QueryTask
        var queryTaskMun = new esri.tasks.QueryTask(urlBusinessService + "/" + indexMunicipal);
		//create the County Query
		var queryCounty = new esri.tasks.Query();
		//create the Muni Query
		var queryMuni = new esri.tasks.Query();
        //define the County query parameters
		queryCounty.returnGeometry = false;
        queryCounty.outFields = countyOutFields;
        queryCounty.where = "1=1";
		//define the Municipal query parameters
		queryMuni.returnGeometry=false;
		queryMuni.outFields= muniOutFields;
		queryMuni.where="1=1"
		//the object that will hold the results
        var items = [];
		//connect the County Query onComplete event to retrieve the attribute
        dojo.connect(queryTaskCounty,"onComplete",function(featureSet){
        //build an array of attributes
        	var items = dojo.map(featureSet.features,function(feature){
            return feature.attributes;
        });
		
		//construct the JSON
        var data = {
			//define the identifier
            identifier:"COUNTY",
			//populate the items
            items:items};
		//create the County data store
        store = new dojo.data.ItemFileReadStore({data:data});
		     
		new dijit.form.FilteringSelect({
				store: store,
				autoComplete: true,
				style: "width:200px;",
				id: "county",
				searchAttr: "COUNTY",
				onChange: function(county) {
					if(dijit.byId(ddlMunicipal).disabled){
						dijit.byId(ddlMunicipal).disabled = false;
					}
					dijit.byId(ddlMunicipal).query.COUNTY = county ||"*";
					dijit.byId(ddlMunicipal).set('value','');
					dijit.byId(ddlMunicipal).focus();
					//queryMap("county", dijit.byId(ddlCounty).value);
					
				}
				},ddlCounty);
		});
		
		dojo.connect(queryTaskMun,"onComplete",function(featureSet){
			var items = dojo.map(featureSet.features,function(feature){
				return feature.attributes;
			});
			items.sort(function(a,b){
				return a.MUN_LABEL < b.MUN_LABEL ? -1:
				(a.MUN_LABEL > b.MUN_LABEL ? 1 : 0);
			});
			var munData ={
				identifier:"GNIS",
				items:items};
			munStore = new dojo.data.ItemFileReadStore({data:munData});
			
		new dijit.form.ComboBox({
				store:munStore,
				//fetchProperties:{sort:{attribute:"MUN_LABEL",descending:true}},
				autoComplete: true,
				style: "width:200px;",
				id:"municipality",
				disabled: true,
				searchAttr: "MUN_LABEL",
				//disabled: true,
				onChange: function(municipality){
					//queryMap("municipality",dijit.byId(ddlMunicipal).value);
				}
			}, ddlMunicipal);
		}
		)
		//execute the task
        queryTaskCounty.execute(queryCounty);
		queryTaskMun.execute(queryMuni);
    }
    
function queryMap(layer, value){
	var queryTask,query,queryURL,queryFields, queryText;
	var selectionSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([209,68,52, 1.0]),4);		
	if (layer == 'municipality'){
		queryURL = urlBusinessService + "/" + indexMunicipal;
		queryFields =["GNIS_NAME","SQ_MILES","POP2000","POP1990","POP1980"];
		queryText = "MUN_LABEL ='" + value +"' AND COUNTY ='" + dijit.byId(ddlCounty).value + "'";
		
	} else if (layer == 'county'){
		
		queryURL = urlBusinessService + "/" + indexCounty;
		queryFields = ["GNIS_NAME","SQ_MILES","POP2000","POP1990","POP1980"];
		queryText = "COUNTY = '" + value.toUpperCase() +"'";
	}
			
		queryTask = new esri.tasks.QueryTask(queryURL);
		query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outFields = queryFields;
		query.where = queryText;
			
		queryTask.execute(query, function(featureSet){
			  /*
			  globals.map.graphics.clear();
			  if(globals.map._infoWindowIsShowing){
				globals.map.infoWindow.hide();
			  }
			  var symbol = selectionSymbol;
			  var s = ""
		          //Loop through features and add them to the map.
		          for (var i = 0, il = featureSet.features.length; i < il; i++) {
					//Show feature as a graphic
					var graphic = featureSet.features[i];
					//var infoWindow = globals.map.infoWindow;
					graphic.setSymbol(symbol);
					//Add graphic to map graphics layer
					globals.map.graphics.add(graphic);
					//Zoom to the extent of graphics
					var selExtent = graphic.geometry.getExtent();
					globals.map.setExtent(selExtent.expand(1.25));
				}
			*/
			});
			
	}