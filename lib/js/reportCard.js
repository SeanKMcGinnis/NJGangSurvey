var ftURL = "https://www.googleapis.com/fusiontables/v1/query";
var gr;
var t;
function showTownReportCard(munid){
    //dijit.byId("dialogTown").show();
    var query = new esri.tasks.Query();	query.where = "MUN_CODE = '" + munid +"'";
    gangLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW, buildTownReport);
}
function showGangReportCard(munid){
    dijit.byId("dialogGang").show();
    //may have to do some upfront handling here...
    var requestHandle = esri.request({
        "url": ftURL,
        "content": {
            "sql": "SELECT * FROM 1QnDAwLE8XnlBWzPrsVj51iHqGM4nveuGl5liijk WHERE MUNCODE = '" + munid + "'",
            "key": "AIzaSyBChvf1l7vAjanliGAM3ziYBgpOupmXqP4"
            },
        "callbackParamName": "callback",
    });
    requestHandle.then(buildGangReport, requestError);
}
function buildTownReport(features){
    var dlg = dijit.byId("dialogTown");
    var f = features[0].attributes;	var gangList = [];
    var schoolGangs = dojo.byId("gang-list");
    tc = dijit.byId("tabGangs");
    dlg.set("title", f.MUN_LABEL + "'s Report Card as reported by "+ f.AGENCY);
    dojo.byId("GANGAWARE").innerHTML = f.GANGAWARE;
    dojo.byId("ProbGang").innerHTML = f.ProbGang;
    dojo.byId("ActGang").innerHTML = f.ActGang;
    dojo.byId("IncarCtrl").innerHTML = f.IncarCtrl;	dojo.byId("JailRcrt").innerHTML = f.JailRcrt;
    dojo.byId("Ideology").innerHTML = f.Ideology;
    dojo.byId("ExtConn").innerHTML = f.ExtConn;
    dojo.byId("CrimNet").innerHTML = f.CrimNet;
    dojo.byId("ActChange").innerHTML = f.ActChange;	dojo.byId("StaHouse").innerHTML = f.Stahouse;
    dojo.byId("SAP_Refer").innerHTML = f.SAP_Refer;	dojo.byId("GangEd").innerHTML = f.GangEd;
    dojo.byId("SchTru").innerHTML = f.SchTru;
    dojo.byId("SchPres").innerHTML = f.SchPres;
    dojo.byId("SchInc").innerHTML = f.SchInc;
    dojo.byId("SchIncCnt").innerHTML = f.SchIncCnt;
    /*	
     * buildGangList("Bloods", f.SchBlood, gangList);
     * buildGangList("Crips", f.SchCrip, gangList);
     * buildGangList("Latin Kings", f.SchLK, gangList);
     * buildGangList("La Mugre", f.SchMugre, gangList);
     * buildGangList("MS-13", f.SchMS, gangList);
     * buildGangList("18th Street Gang", f.SchEtnth, gangList);
     * buildGangList("Neta", f.SchNeta, gangList);
     * buildGangList("Dominicans Don\'t Play", f.SchDDP, gangList);
     * buildGangList("Vatos Locos", f.SchVL, gangList);
     * buildGangList("Trinitarios", f.SchTrin, gangList);
     * buildGangList("Surenos", f.SchSureno, gangList);
     * if(f.SchOther != ""){
     *     buildGangList(f.SchOther, "Y", gangList);
     * };	
     */
    clearGrid();
    fillGrid(f.schVandal, 'vandal');
    fillGrid(f.SchTheft, 'theft');
    fillGrid(f.SchExtort,'extort');
    fillGrid(f.SchAssault, 'assault');
    fillGrid(f.SchAggAslt, 'aggasslt');
    fillGrid(f.SchHom, 'homicide');
    fillGrid(f.SchAttHom, 'atthom');
    fillGrid(f.SchNarc, 'narcotics');
    fillGrid(f.Schweapons, 'weapons');
    fillGrid(f.SchTrspass, 'trespass');
    fillGrid(f.SchRecruit, 'recruit');
    fillGrid(f.SchGangSign, 'gangsign');
    dlg.show();}
function buildGangReport(response, io){
    var fieldInfo;
    var title;
    dojo.toJsonIndentStr = " ";
    if(response.hasOwnProperty("rows")){
        tc = dijit.byId("tabGangs");
        fieldInfo = dojo.map(response.rows, function(f){
            gr = new gangReport(f);
            content = buildGangContent(gr);
            if(gr.GangSet.length > 30){
                title = singleQuoteClean(gr.GangSet.substring(0,30));
            } else {
                title = singleQuoteClean(pad(gr.GangSet, 30));
            }
            t = new dijit.layout.ContentPane({
                title: singleQuoteClean(title),
                content: content
            });
            tc.addChild(t);
            var ageChartName = gr.GangSet + "_age";
            if(gr.AgeArray.length >= 2){
                buildChart(gr.AgeArray, ageChartName);
            } else {
                dojo.byId(ageChartName).innerHTML = "No Age Information Provided<br /><br /><br /><br /><br /><br /><br /><br />";
            }
            var sexChartName = gr.GangSet + "_sex";
            if (gr.SexArray.length >= 2){
                buildChart(gr.SexArray, sexChartName);
            } else {
                dojo.byId(sexChartName).innerHTML = "No Gender Information Provided<br /><br /><br /><br /><br /><br /><br /><br />";
            }
            var raceChartName= gr.GangSet + "_race";
            if(gr.RaceArray.length >= 2){
                buildChart(gr.RaceArray, raceChartName);
            } else {
                dojo.byId(raceChartName).innerHTML = "No Race Information Provided<br /><br /><br /><br /><br /><br /><br /><br />";
            }
            checkHandler(gr.GangSet +"_img-assault", gr.Assault);
            checkHandler(gr.GangSet +"_img-agg-assault", gr.AggAssault);
            checkHandler(gr.GangSet +"_img-assault", gr.Assault);
            checkHandler(gr.GangSet +"_img-att-homicide", gr.AttHomicide);
            checkHandler(gr.GangSet +"_img-homicide", gr.Homicide);
            checkHandler(gr.GangSet +"_img-kidnap", gr.Kidnap);
            checkHandler(gr.GangSet +"_img-sexual-assault", gr.SexualAssault);
            checkHandler(gr.GangSet +"_img-car-jack", gr.CarJack);
            checkHandler(gr.GangSet +"_img-no-violent-crime", gr.NoCrime);
            checkHandler(gr.GangSet +"_img-robbery", gr.Robbery);
            checkHandler(gr.GangSet +"_img-cargo-theft", gr.CargoTheft);
            checkHandler(gr.GangSet +"_img-shoplift", gr.Shoplift);
            checkHandler(gr.GangSet +"_img-prop-dist", gr.StolenPropDist);
            checkHandler(gr.GangSet +"_img-com-burglary", gr.CommercialBurglary);
            checkHandler(gr.GangSet +"_img-res-burglary", gr.ResidentialBurglary);
            checkHandler(gr.GangSet +"_img-bank-fraud", gr.BankFraud);
            checkHandler(gr.GangSet +"_img-cc-fraud", gr.CCFraud);
            checkHandler(gr.GangSet +"_img-extortion", gr.Extortion);
            checkHandler(gr.GangSet +"_img-forgery", gr.Forgery);
            checkHandler(gr.GangSet +"_img-ins-fraud", gr.InsuranceFraud);
            checkHandler(gr.GangSet +"_img-tax-fraud", gr.TaxFraud);
            checkHandler(gr.GangSet +"_img-vehicle-theft", gr.VehicleTheft);
            checkHandler(gr.GangSet +"_img-bribery", gr.Bribery);
            checkHandler(gr.GangSet +"_img-counterfeit", gr.CounterfeitCurrency);
            checkHandler(gr.GangSet +"_img-cft-merchandise", gr.CounterfeitMerch);
            checkHandler(gr.GangSet +"_img-cyber-gambling", gr.CyberGambling);
            checkHandler(gr.GangSet +"_img-doc-fraud", gr.DocumentFraud);
            checkHandler(gr.GangSet +"_img-human-traffic", gr.HumanTraf);
            checkHandler(gr.GangSet +"_img-casino", gr.IllegalCasino);
            checkHandler(gr.GangSet +"_img-loan-shark", gr.LoanShark);
            checkHandler(gr.GangSet +"_img-money-laundering", gr.MoneyLaundering);
            checkHandler(gr.GangSet +"_img-official-corruption", gr.OfficialCorruption);
            checkHandler(gr.GangSet +"_img-policy-betting", gr.PolicyBetting);
            checkHandler(gr.GangSet +"_img-sports-betting", gr.SportsBetting);
            checkHandler(gr.GangSet +"_img-prostitution", gr.Prostitution);
            checkHandler(gr.GangSet +"_img-weapons-trafficking", gr.WeaponsTrafficking);
            checkHandler(gr.GangSet +"_img-witness-tamper", gr.WitenessTampering);
            })
    }
}
function buildChart(chartData, chartName){
    var chartData = google.visualization.arrayToDataTable(chartData);
    new google.visualization.ImagePieChart(dojo.byId(chartName)).draw(chartData,{
        backgroundColor: '#F5F5F5', 
        height: 140, 
        width: 205 
        });
}
function buildGangContent(gang){
    var content = "<div><dl><dt>General Information</dt><dd class='gang-info'>";
    content += "<table class='gang-info'><tr><td>";
    content += "Parent Gang: ";
    if(gang.SubGang == 'Yes'){
        content += gang.ParentGang;		
    } else {
        content += "N/A";
    }
    content += "</td><td>Gang Members: ";
    if(gang.GangMems >= 1){
        content += gang.GangMems;
    } else {
        content += "Not Reported";
    }
    content += "</td></tr><tr><td>Gang Dues: ";
    if(gang.GangDues != ''){
        content += gang.GangDues;
    } else {
        content += "Not Reported";
    }
    content += "</td><td>Gang Taxes: ";
    if(gang.GangTaxes != ''){
        content += gang.GangTaxes;
    } else {
        content += "Not Reported";
    }
    content += "</td></tr><tr><td>Gang Meetings: ";
    if(gang.GangMeetings != ''){
        content += gang.GangMeetings;
    } else {
        content += "Not Reported";
    }
    content += "</td><td>Rival Gang: ";
    if(gang.RivalGang != ''){
        content += gang.RivalGang;
    } else {
        content += "None Reported";
    }
    content += "</td></tr><tr><td>Military Recruiting: ";
    if(gang.RecruitMilitary != ''){
        content += gang.RecruitMilitary;
    } else {
        content += "Not Reported";
    }
    content += "</td><td>Military Skills: ";
    if(gang.MilitarySkills != ''){
        content += gang.MilitarySkills;
    } else {
        content += "Not Reported";
    }
    content += "</td></tr><tr><td>Legitimate Business: ";
    if(gang.LegBusiness != ''){
        content += gang.LegBusiness;
    } else {
        content += "Not Reported"
    }
    content += "</td><td>Legitimate Real Estate: ";
    if(gang.LegRealEstate != ''){
        content += gang.LegRealEstate;
    } else {
        content += "Not Reported";
    }
    content += "</td></tr></table>";
    content += "</dd></dl>";
    content += "<dl class='small-chart'><dt>Age Distribution</dt><dd class='small-chart' >";
    content += "<span id='" + singleQuoteClean(gang.GangSet) + "_age' class='chart-display'></span></dd></dl>";
    content += "<dl class='small-chart'><dt>Gender Distribution</dt><dd class='small-chart'>";
    content += "<span id='" + singleQuoteClean(gang.GangSet) + "_sex' class='chart-display' ></span>";
    content +="</dd></dl>";
    content += "<dl class='small-chart'><dt>Race Distribution</dt><dd class='small-chart' >";
    content += "<span id='" + singleQuoteClean(gang.GangSet) + "_race' class='chart-display'></span></dd></dl>";
    content += "<dl class='small-chart'><dt>Violent Crimes</dt><dd class='small-chart'>";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-assault' class='middle'>&nbsp;Assault<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-agg-assault' class='middle'>&nbsp;&nbsp;Aggravated Assault<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-att-homicide' class='middle'>&nbsp;&nbsp;Attempted Homicide<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-homicide' class='middle'>&nbsp;&nbsp;Homicide<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-kidnap' class='middle'>&nbsp;&nbsp;Kidnapping<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-sexual-assault' class='middle'>&nbsp;&nbsp;Sexual Assault<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-car-jack' class='middle'>&nbsp;&nbsp;Car Jacking<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-no-violent-crime' class='middle'>&nbsp;&nbsp;No Violent Crime<br />";
    content += "</dd></dl>";
    content += "<dl class='small-chart'><dt>Theft Crimes</dt><dd class='small-chart'>";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-robbery' class='middle'>&nbsp;&nbsp;Robbery<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-cargo-theft' class='middle'>&nbsp;&nbsp;Cargo Theft<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-shoplift' class='middle'>&nbsp;&nbsp;Shoplifting<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-prop-dist' class='middle'>&nbsp;&nbsp;Stolen Property Distribution<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-com-burglary' class='middle'>&nbsp;&nbsp;Commercial Burglary<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-res-burglary' class='middle'>&nbsp;&nbsp;Residential Burglary<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-bank-fraud' class='middle'>&nbsp;&nbsp;Bank Fraud<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-cc-fraud' class='middle'>&nbsp;&nbsp;Credit Card Fraud<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-extortion' class='middle'>&nbsp;&nbsp;Extortion<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-forgery' class='middle'>&nbsp;&nbsp;Forgery<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-ins-fraud' class='middle'>&nbsp;&nbsp;Insurance Fraud<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-tax-fraud' class='middle'>&nbsp;&nbsp;Tax Fraud<br />";
    content += "<img id='" + singleQuoteClean(gang.GangSet) + "_img-vehicle-theft' class='middle'>&nbsp;&nbsp;Vehichle Theft<br /><br /><br />";
    content += "</dd></dl>";	content += "<dl class='small-chart'><dt>Other Crimes</dt><dd class='small-chart'>";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-bribery' class='middle'>&nbsp;Bribery<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-counterfeit' class='middle'>&nbsp;Counterfeit Currency<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-cft-merchandise' class='middle'>&nbsp;Counterfeit Merchandise<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-cyber-gambling' class='middle'>&nbsp;Cyber Gambling<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-doc-fraud' class='middle'>&nbsp;Document Fraud<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-human-traffic' class='middle'>&nbsp;Human Trafficking<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-casino' class='middle'>&nbsp;Illegal Casinos<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-loan-shark' class='middle'>&nbsp;Loan Sharking<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-money-laundering' class='middle'>&nbsp;Money Laundering<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-official-corruption' class='middle'>&nbsp;Official Corruption<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-policy-betting' class='middle'>&nbsp;Policy Betting<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-sports-betting' class='middle'>&nbsp;Sports Betting<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-prostitution' class='middle'>&nbsp;Prostitution<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-weapons-trafficking' class='middle'>&nbsp;Weapons Trafficking<br />";
    content += "<img id='"+ singleQuoteClean(gang.GangSet) +"_img-witness-tamper' class='middle'>&nbsp;Witness Tampering<br />";
    content += "</dd></dl>";
    content += "</div>";
    return content
}
function requestError(error, io){
    console.log("Error; ", error);
}
function fillGrid(value, id){
    var cell;
    switch(value){
        case 'Never':
            cell = id + "-never";
            break;
        case 'Don\'t Know':
            cell = id + "-dk";
            break;
        case 'Rarely (Once or Twice a Year)':
            cell = id + "-rare";
            break;
        case 'Occasionally (Once or Twice a Month)':
            cell = id + "-occ";
            break;
        case 'Frequently (Once or Twice a Week)':
            cell = id + "-freq";
            break;
        case 'N/A':
        default:
            cell = id + "-na";
            break;
    }
    dojo.addClass(cell, "positive");
}
function responseFormat(value){
    switch(value){
        case 'Yes':
        case 'Y':
            value = 'Yes';
            break;
        case 'No':
            value = 'No';
            break;
        case 'Don\'t Know':
            value = 'Don\'t Know';
            break;
        default:
            value = '';
            break
    }
    return value
}
function clearGrid(){
    var crimeList = ["vandal","theft","extort","assault","aggasslt","homicide","atthom","narcotics","weapons","trespass","recruit","gangsign"];
    var suffixList = ["-never","-dk","-rare","-occ","-freq","-na"];
    dojo.forEach(crimeList, function(crime){
        dojo.forEach(suffixList, function(suff){
            var node = crime + suff;
            if(dojo.hasClass(node, "positive")){
                dojo.removeClass(node, "positive");
            }
        })
    })
}
function buildGangList(gang, value, list){
    if(value == 'Y'){
        list.push(gang);
    }
}
function checkHandler(imgId, value){
    var img = dojo.byId(imgId);
    if(value == ''){
        dojo.setAttr(img, 'src', 'lib/images/unchecked.png');
    } else {
        dojo.setAttr(img, 'src', 'lib/images/checked.png');	}
    }