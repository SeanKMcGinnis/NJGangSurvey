var gangReport = function(f){
    var ageArray = new Array();
    ageArray.push(newArray('Age Range', 'Percentage'));
    var sexArray = new Array();
    sexArray.push(newArray('Sex', 'Percentage'));
    var raceArray = new Array();
    raceArray.push(newArray('Race','Percentage'));
    this.GangSet = f[1];
    this.SubGang = f[2];
    this.ParentGang = f[3];
    this.GangMems = f[4];
    this.TransientMembers = f[5];
    this.ResidentMembers = f[6];
    this.UnknownMembers = f[7];
    this.DKMembers = f[8];
    this.TransientCrime = f[9];
    this.ResidentCrime = f[10];
    this.NeitherCrime = f[11];
    this.DKCrime = f[12];
    //Age Array
    this.Age_LT15 = f[13];
    if(this.Age_LT15 != ""){ageArray.push(newArray('<15', parseInt(f[13])));}
    this.Age_15_17 = f[14];
    if(this.Age_15_17 != ""){ageArray.push(newArray('15-17', parseInt(f[14])));	}
    this.Age_18_24 = f[15];
    if(this.Age_18_24 != ""){ageArray.push(newArray('18-24', parseInt(f[15])));	}
    this.Age_GT24 = f[16];
    if(this.Age_GT24 != ""){ageArray.push(newArray('>24', parseInt(f[16])));}
    this.AgeArray = ageArray;
    this.Age_DK = f[17];
    //Gender Array
    this.PercentMale = parseInt(f[18]);
    if(!isNaN(this.PercentMale)){sexArray.push(newArray('Male', this.PercentMale));	}
    this.PercentFemale = parseInt(f[19]);
    if(!isNaN(this.PercentFemale)){sexArray.push(newArray('Female',this.PercentFemale));}
    this.PercentDK = parseInt(f[20]);
    if(!isNaN(this.PercentDK)){sexArray.push(newArray('Unknown', this.PercentDK));}
    this.SexArray = sexArray;
    //Race Array
    var whiteFolks = raceHandling(f[21]);
    if(!isNaN(whiteFolks)){raceArray.push(newArray('White', whiteFolks));}
    var latinFolks = raceHandling(f[22]); 
    if(!isNaN(latinFolks)){raceArray.push(newArray('Latino', latinFolks));	}
    var blackFolks = raceHandling(f[23]);
    if(!isNaN(blackFolks)){raceArray.push(newArray('Black', blackFolks));}
    var asianFolks = raceHandling(f[24]);
    if(!isNaN(asianFolks)){	raceArray.push(newArray('Asian', asianFolks));}
    var otherFolks = raceHandling(f[25]);
    if(!isNaN(otherFolks)){raceArray.push(newArray('Other', otherFolks));}
    this.RaceArray = raceArray;
    //Violent Crimes
    this.Assault = f[26];
    this.AggAssault = f[27];
    this.AttHomicide = f[28];
    this.Homicide = f[29];this.Kidnap = f[30];
    this.SexualAssault = f[31];
    this.CarJack = f[32];
    this.NoCrime = f[33];
    //Theft Crimes
    this.Robbery = f[34];
    this.CargoTheft = f[35];
    this.Shoplift = f[36];
    this.StolenPropDist = f[37];
    this.CommercialBurglary = f[38];
    this.ResidentialBurglary = f[39];
    this.BankFraud = f[40];
    this.CCFraud = f[41];
    //this.CyberCrime = f[42];
    //this.Embezzle = f[43];
    this.Extortion = f[44];
    this.Forgery = f[45];
    //this.HealthFraud = f[46];
    this.InsuranceFraud = f[47];
    //this.MortgageFraud = f[48];
    //this.SecurityFraud = f[49];
    this.TaxFraud = f[50];
    //this.TelephoneFraud = f[51];
    this.VehicleTheft = f[52];
    //Drug Trafficing
    this.MJRetail = f[54];
    this.MJMidLevel = f[55];
    this.MJWholesale = f[56];
    this.CocaineRetail = f[59];
    this.CocaineMidLevel = f[60];
    this.CocaineWholesale = f[61];
    this.HeroinRetail = f[64];
    this.HeroinMidLevel = f[65];
    this.HeroinWholesale = f[66];
    this.EcstasyRetail = f[69];
    this.EcstasyMidLevel = f[70];
    this.EcstasyWholesale = f[71];
    this.MethRetail = f[74];
    this.MethMidLevel = f[75];
    this.MethWholesale = f[76];
    this.PLDRetail = f[79];
    this.PLDMidLevel = f[80];
    this.PLDWholesale = f[81];
    this.OtherRetail = f[84];
    this.OtherMidLevel = f[85];
    this.OtherWholesale = f[86];
    this.OtherDrugTraf = f[89];
    //Other crimes
    this.Bribery = f[90];
    this.CounterfeitCurrency = f[91];
    this.CounterfeitMerch = f[92];
    this.CyberGambling = f[93];
    this.DocumentFraud = f[94];
    this.HumanTraf = f[95];
    this.IllegalCasino = f[96];
    this.LoanShark = f[97];
    this.MoneyLaundering = f[98];
    this.OfficialCorruption = f[99];
    this.PolicyBetting = f[100];
    this.SportsBetting = f[101];
    this.Prostitution = f[102];
    this.WeaponsTrafficking = f[103];
    this.WitnessTampering = f[104];
    //Other Gang Details
    this.GangCooperate = f[106];
    this.GangConflict = f[107];
    this.RivalGang = f[108];
    this.RecruitMilitary = f[109];
    this.MilitarySkills = f[110];
    this.LegBusiness = f[111];
    this.LegRealEstate = f[112];
    this.NoBusiness = f[113];
    this.GangDues = f[115];
    this.GangTaxes = f[116];
    this.GangMeetings = f[117];
    this.LEThreat = f[118];
    this.LEAssault = f[119];
    this.PublicViolence = f[122];
    this.PublicOfficialViolence = f[123];
}
function newArray(val1, val2){
    var value = new Array();
    value.push(val1);
    value.push(val2);
    return value;
}
function raceHandling(percentage){
    var response;
    switch(percentage){
        case '< 10':
            response = 10;
            break;
        default:
            if(!isNaN(percentage)){
                response = parseInt(percentage);
            } else {
                response = NaN;
            }
            break;
    }
    return response;
}