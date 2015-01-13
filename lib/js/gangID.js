function findGangs(evt){
    var selectionQuery = new esri.tasks.Query();
    var tol = map.extent.getWidth()/map.width * 1;
    var x = evt.mapPoint.x;
    var y = evt.mapPoint.y;
    var queryExtent = new esri.geometry.Extent(x-tol,y-tol,x+tol,y+tol,evt.mapPoint.spatialReference);
    selectionQuery.returnGeometry = true;
    selectionQuery.geometry = queryExtent;
    gangLayer.queryCount(selectionQuery, function(count){
        switch(count){
            case 1:
                gangLayer.selectFeatures(selectionQuery,esri.layers.FeatureLayer.SELECTION_NEW);
                break;
            default:
                var warningDialog = new dijit.Dialog({
                        title: "Aaahh, Houston. We have a problem...",
                        content: "It looks like you clicked in an area that has no gang data. Please close this dialog and click within the State of New Jersey. If you did click in the State of New Jersey and are seeing this message, I must have hosed the data somehow. Sorry.",
                        style: "width: 320px;"
                    });
                    warningDialog.show();
                    break;
                    }
     })
}
function getGangInfo(features){
    paneControl();
    gLayer.clear();
    dojo.forEach(features,function(feature){
        var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([51,204,255]), 4);
        gLayer.add(new esri.Graphic(feature.geometry,symbol));
        townCode = feature.attributes.MUN_CODE;
        dojo.byId("municipality_name").innerHTML = feature.attributes.MUN_LABEL;
        dojo.byId("county-name").innerHTML = "County: " + feature.attributes.COUNTY;
        dojo.byId("population").innerHTML = "Population (2010): " + feature.attributes.POP2010;
        populateResults("gang-activity", feature.attributes.GANGPRES);
        populateResults("gang-anniversary", feature.attributes.ANN_DATE);
        populateResults("gang-congregate", feature.attributes.PARK_PROP);
        populateResults("gang-event", feature.attributes.GANGEVT);
        populateResults("gang-schools", feature.attributes.SchPres);
    });	}
function populateResults(detail, value){
    dojo.removeClass(detail)
    var message = "";
    var reportContainer = dojo.byId("town-report-card");
    var imgActivity = dojo.byId("img-gang-activity");
    var imgAnniversary = dojo.byId("img-gang-anniversary");
    var imgCongregate = dojo.byId("img-gang-congregate");
    var imgEvent = dojo.byId("img-gang-event");
    var imgSchools = dojo.byId("img-gang-schools");
    switch(detail){
        case "gang-activity":
            reportContainer.innerHTML = "";
            if (value=="Yes"){
                imgActivity.setAttribute("src", "lib/images/bullet-red.png");
                var a = document.createElement("a");
                a.innerHTML = "Town Report Card";
                var scriptContent = "javascript:showTownReportCard('" + townCode + "')";
                a.setAttribute("href", scriptContent);
                reportContainer.appendChild(a);
                var br = document.createElement("br");
                reportContainer.appendChild(br);
                var b = document.createElement("a");
                b.innerHTML = "Gang Report Card";
                scriptContent = "javascript:showGangReportCard('"+ townCode + "')";
                b.setAttribute("href", scriptContent);
                reportContainer.appendChild(b);
            } else if (value=="No") {
                imgActivity.setAttribute("src", "lib/images/bullet-green.png");
                var p = document.createElement("p");
                p.innerHTML = "Your town does not appear to have any gangs, so no report card for you!";
                reportContainer.appendChild(p);
            } else {
                imgActivity.setAttribute("src", "lib/images/bullet-grey.png");
            }
            break;
        case "gang-anniversary":
            if (value=="Yes"){imgAnniversary.setAttribute("src", "lib/images/bullet-red.png");}
            else if (value=="No"){imgAnniversary.setAttribute("src", "lib/images/bullet-green.png");}
            else{imgAnniversary.setAttribute("src", "lib/images/bullet-grey.png");}
            break;
        case "gang-congregate":
            if (value=="Yes"){imgCongregate.setAttribute("src", "lib/images/bullet-red.png");}
            else if (value=="No"){imgCongregate.setAttribute("src", "lib/images/bullet-green.png");}
            else{imgCongregate.setAttribute("src", "lib/images/bullet-grey.png");}
            break;
        case "gang-event":
            if (value=="Yes"){imgEvent.setAttribute("src", "lib/images/bullet-red.png");}
            else if (value=="No"){imgEvent.setAttribute("src", "lib/images/bullet-green.png");}
            else{imgEvent.setAttribute("src", "lib/images/bullet-grey.png");}
            break;
        case "gang-schools":
            if (value=="Yes"){imgSchools.setAttribute("src", "lib/images/bullet-red.png");}
            else if (value=="No"){imgSchools.setAttribute("src", "lib/images/bullet-green.png");}
            else{imgSchools.setAttribute("src", "lib/images/bullet-grey.png");}
            break;
        default:
            console.log("Houston, we have a problem....")
    }
    if(value=="Yes"){dojo.addClass(detail, "gang-yes");}
    else if (value =="No"){dojo.addClass(detail, "gang-no");}
    else{dojo.addClass(detail, "gang-maybe");}
}
	  

