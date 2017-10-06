var namespace = {};
window.EHRhelper = namespace;


$(document).ready(function() {


var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';
var username = 'lio.se1'; 	// readonly-demo-user
var password = 'lio.se123';				// readonly-demo-user
var ehrId = "b51f3709-eeb6-49ed-afae-ef1468ec03fb"; //Vladimir
var firstname = "Henry";
var lastname = "Stockholm";
//var ehrId = "e7732b37-e119-4fb1-a44f-b3f4325aa11d";

namespace.username = username;
namespace.password = password;
namespace.sessionId = "";

var now = new Date();
var h = now.getHours();
var m = now.getMinutes();
var s = now.getSeconds();

console.log("HEJ!");

console.log(h+":"+m+":"+s);

var currentTime = h+":"+m+":"+s;

//POSTFlatVitalParameter(ehrId);
//AQLQueriesNONJSON();

//GetComposition("7bc8b2dc-004f-4f9a-9fba-9799e1716997::lio.ehrscape.com::1");
//getAllPatients();
//GetAQLData(ehrId);

//CreatePatient("Test", "Tolvansson");
//CreateComposition(ehrId);

//DeleteComposition("81489687-2a64-4e58-a8c5-b398218c350d::lio.ehrscape.com::1");
//DeleteTemplate();

//GetPatientByEHR(ehrId);
//GetPatientByName(firstname, lastname);
//GetVitalParameter(ehrId);
//GetTemplate();
//getForm(ehrId, "Beslut om kirurgi", "1.0.2");
//listForms();


//Used for authentication
function getSessionId(user,pass) {

	console.log("getSessionId called with", user,pass)
	if (!user) {
		user = namespace.username
	} else {
		namespace.username = user
	}
	if (!pass) {
		pass = namespace.password;
	} else {
		namespace.password = pass;
	}
	
	//TODO: Fix to ask for credentials only when needed -perhaps an asynchronus checkSession(sessionID, callbackFunction){...}?
	console.log("getSessionId calls server with", user,pass)
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(user) +
                "&password=" + encodeURIComponent(pass),
        async: false
    });
	
	var JSONresponse = JSON.parse(response.responseText);
	namespace.sessionId = JSONresponse.sessionId;
    return JSONresponse.sessionId;
}

namespace.getSessionId = getSessionId;


//Fungerar ej
function POSTFlatVitalParameter(ehrId) {

	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	// var flatdata = {
		// "vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/diastolic|magnitude":92,
		// "vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/diastolic|unit":"mm[Hg]",
		// "vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/systolic|magnitude":83,
		// "vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/systolic|unit":"mm[Hg]",
		// "vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/time":"2017-04-05T" + currentTime + ".178Z",
		// "vitalparametrar/vitalparametrar/blood_pressure:0/encoding|code":"UTF-8", 
		// "vitalparametrar/vitalparametrar/blood_pressure:0/encoding|terminology":"IANA_character-sets", 
		// "vitalparametrar/vitalparametrar/blood_pressure:0/language|code":"sv" "vitalparametrar/vitalparametrar/blood_pressure:0/language|terminology":"ISO_639-1"
	// };
	
	//var flatdata = {"vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/diastolic|magnitude": 91, "vitalparametrar/vitalparametrar/blood_pressure:0/any_event:0/diastolic|unit":"mm[Hg]"};
	
	
	var queryParams = {
		"ehrId": ehrId,
		templateId: 'triage',
		format: 'FLAT',
		committer: 'Carlos Test',
	};

	$.ajax({
		url: baseUrl  + "/composition?" + $.param(queryParams),//+ "20cf36c0-5003-4c08-9e59-a82b037d766d::lio.ehrscape.com::1",
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(flatdata),
		success: function(res) {
			console.log(res);
			$("#result").val(JSON.stringify(res));
		}
	});
}

function GetComposition(compid) {
	
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	//You get the uId from the composition creater/template viewer, recieved internally.
	$.ajax({
		url: baseUrl + "/composition/" + compid + "?format=STRUCTURED",
		type: 'GET',
		contentType: 'application/json',
		templateId: 'Beslut om kirugi',
		success: function (res) {
			console.log(res.composition);
			$("#result").html(JSON.stringify(res.composition));
		}
	});

}




function getAllPatients(returnCallback) {
	console.log("Getting all patients...");
	var resultArray = [];

	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	var searchData = [{key: "firstNames", value: "*"}];
	
	$.ajax({
		url: baseUrl + "/demographics/party/query",
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(searchData),
		success: function (res) {
			console.log(res);
			
			for (i in res.parties) {
								
				var party = res.parties[i];
				var flatResultObject = party;
				var ehrId;
				var pnum = "yyyymmdd-nnnn"
				for (j in party.partyAdditionalInfo) {
					flatResultObject[(party.partyAdditionalInfo[j].key)] = party.partyAdditionalInfo[j].value; 
					if (party.partyAdditionalInfo[j].key === 'ehrId') {
						ehrId = party.partyAdditionalInfo[j].value;
					}
					if (party.partyAdditionalInfo[j].key === 'Personnummer') {
						pnum = party.partyAdditionalInfo[j].value;
					}
				}
				
				var dob = '????-??-??'
				if (party.dateOfBirth) {
					dob = party.dateOfBirth.substring(0, 10)	
				}

				//$("#patientlist").append(  pnum+'\t'+ party.firstNames + '\t' + party.lastNames + '\t' + party.gender + '\t' + dob +
				//	'\t(ehrId = ' + ehrId + ')<br>');
				resultArray[i] = flatResultObject;
			}
			//console.log("resultArray",resultArray)
			returnCallback(resultArray);
			//$('#result').val(res);
		}
		
	});
		
}
namespace.getAllPatients = getAllPatients;
	

//Get patientdata via ajax from EHR API.
function GetAQLData(ehrId) {

        console.log("Start");
		
		$.ajaxSetup({
			headers: {
				"Ehr-Session": getSessionId()
			}
		});
		
        var aql = "select bp/data[at0001|history|]/events[at0006|any event|]/Time as Time, " +
        "bp/data[at0001|history|]/events[at0006|any event|]/data[at0003]/items[at0004|Systolic|]/value as Systolic, " +
        "bp/data[at0001|history|]/events[at0006|any event|]/data[at0003]/items[at0005|Diastolic|]/value as Diastolic, " +
        "c_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Pulse_Rate " +
        "from EHR e " +
        "contains COMPOSITION c " +    
        "contains (OBSERVATION bp[openEHR-EHR-OBSERVATION.blood_pressure.v1] or OBSERVATION c_a[openEHR-EHR-OBSERVATION.pulse.v1])" +
        "    where " +
        "    c/archetype_details/template_id/value = 'triage' AND " +
        " e/ehr_id/value = '" + ehrId + "'" +
        " ORDER BY bp/data[at0001|history|]/events[at0006|any event|]/Time DESC" +
        " offset 0 limit 4"

        $.ajax({
            url: baseUrl + "/query?" + $.param({ "aql": aql }),
            type: 'GET',
            success: function (res) {           

                try {
					var party = res.party;
					data = res.resultSet;
					console.log("ajax success");
					JSONS = JSON.stringify(data, undefined, 2);
					console.log(JSONS);
					$('#result').val(JSONS);
					//paintGraf(data);
                }
                catch (err) {

                }
            }
        });
    
}



function CreatePatient(firstname, lastname, gender, dateOfBirth, personnummer, tags) {

	if(!dateOfBirth) dateOfBirth = "1991-12-18T19:30";
	if(!personnummer && !dateOfBirth) personnummer = "19121212-1212";	
	if(!personnummer && dateOfBirth) personnummer = dateOfBirth.substring(0,3)+dateOfBirth.substring(5,6)+dateOfBirth.substring(8,9)+"-????";
	if(!tags) tags = "";
	
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	$.ajax( {

    	url: baseUrl + "/ehr",
   	 	type: 'POST',

    	success: function (data) {
     	   	var ehrId = data.ehrId;
			
			$("#header").html("EHR: " + ehrId);
			console.log("EHRID: " + ehrId);

        	// build party data
        	var partyData = {
				firstNames: firstname,
				lastNames: lastname,
				dateOfBirth: dateOfBirth,
				gender: gender,
				partyAdditionalInfo: [
					{
					   key: "ehrId",
					   value: ehrId
					},
					{
						key: "Personnummer",
						value: personnummer
					},
					{
						key: "tags",
						value: tags
					}
				]
			};
			
        	$.ajax({
        	url: baseUrl + "/demographics/party",
          	type: 'POST',
         	contentType: 'application/json',
          	data: JSON.stringify(partyData),
          	success: function (party) {
          	    if (party.action == 'CREATE') {
          	          $("#result").html("Created: " + party.meta.href);
          	    }
          	}
			});
    	}
	});
}

namespace.CreatePatient = CreatePatient;


function CreateComposition(ehrId) {
	
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	
	//e7732b37-e119-4fb1-a44f-b3f4325aa11d
	//composition for TriageHenrikv2
	// var compositionData = {"vitalparametrar":{"_uid":["d7fc20eb-a20b-4939-ac19-fee29b4630fb::lio.ehrscape.com::1"],"language":[{"|code":"sv","|terminology":"ISO_639-1"}],"territory":[{"|code":"SE","|terminology":"ISO_3166-1"}],"context":[{"start_time":["2017-04-05T"+ currentTime+".178+02:00"],"setting":[{"|code":"238","|value":"other care","|terminology":"openehr"}]}],"vitalparametrar":[{"indirect_oximetry":[{"any_event":[{"spo2":[{"|numerator":57,"|denominator":100,"":0.56}],"time":["2017-04-05T"+currentTime+".178+02:00"]}],"language":[{"|code":"sv","|terminology":"ISO_639-1"}],"encoding":[{"|code":"UTF-8","|terminology":"IANA_character-sets"}]}],"pulse_heart_beat":[{"any_event":[{"pulse_rate":[{"|magnitude":61,"|unit":"/min"}],"time":["2017-04-05T"+currentTime+".178+02:00"]}],"language":[{"|code":"sv","|terminology":"ISO_639-1"}],"encoding":[{"|code":"UTF-8","|terminology":"IANA_character-sets"}]}],"blood_pressure":[{"any_event":[{"systolic":[{"|magnitude":81,"|unit":"mm[Hg]"}],"diastolic":[{"|magnitude":91,"|unit":"mm[Hg]"}],"time":["2017-04-05T"+currentTime+".178+02:00"]}],"language":[{"|code":"sv","|terminology":"ISO_639-1"}],"encoding":[{"|code":"UTF-8","|terminology":"IANA_character-sets"}]}],"body_weight":[{"any_event":[{"weight":[{"|magnitude":97,"|unit":"kg"}],"time":["2017-04-05T"+currentTime+".178+02:00"]}],"language":[{"|code":"sv","|terminology":"ISO_639-1"}],"encoding":[{"|code":"UTF-8","|terminology":"IANA_character-sets"}]}]}],"composer":[{"|name":"Carlos.Ortiz@regionostergotland.se"}]}};
	
	// var compositionData = 
	// {"ctx": {"language": "sv","territory": "se","composer_name": "carlos"}, "beslut_om_kirurgisk_åtgärd":{"beställning_av_kirurgisk_åtgärd":[{"_uid":["7ce57adf-fff8-4f1e-bcef-aa1143175715"],"request":[{"planerad_kirurgisk_huvudåtgärd":["KCC10 Cystoprostatovesikulektomi"],"medicinsk_brådskandegrad":["Inom 6 timmar"],"timing":[{"|value":"x","|formalism":"timing"}]}],"narrative":["Beslut om kirurgisk åtgärd ska utföras eller ej"],"language":[{"|code":"sv","|terminology":"ISO_639-1"}],"encoding":[{"|code":"UTF-8","|terminology":"IANA_character-sets"}]}]}};
	
	var compositionData = 
	{"beslut_om_kirurgisk_åtgärd":{"context":[{"start_time":[],"setting":[]}],"beställning_av_kirurgisk_åtgärd":[{"request":[{"planerad_kirurgisk_huvudåtgärd":["KCC10 Cystoprostatovesikulektomi"],"medicinsk_brådskandegrad":["Urakut"],"timing":[{"|formalism":"text/html","|value":"Lorem"}],"action_archetype_id":[]}],"requestor_identifier":[],"receiver_identifier":[],"request_status":["Lorem"],"narrative":["Lorem"]}],"status_valmöjlighet":[{"ism_transition":[{"current_state":[{"|code":"526","|value":"planned","|terminology":"local"}],"transition":[],"careflow_step":[{"|code":null,"|value":null,"|terminology":null}]}],"patienten_har_fått_möjlighet_att_välja_behandling":["Ja"],"review_date":[],"time":[]}],"status_samtycke":[{"ism_transition":[{"current_state":[{"|code":"526","|value":"planned","|terminology":"local"}],"transition":[],"careflow_step":[]}],"patienten_samtycker_till_planerad_kirurgisk_åtgärd":["Ja"],"review_date":[],"time":[]}],"status_delaktighet":[{"ism_transition":[{"current_state":[{"|code":"526","|value":"planned","|terminology":"local"}],"transition":[],"careflow_step":[]}],"patienten_är_delaktig_i_beslutet_om_kirurgisk_åtgärd":["Nej"],"review_date":[],"time":[]}],"status_beslut":[{"ism_transition":[{"current_state":[{"|code":"524","|value":"initial","|terminology":"local"}],"transition":[],"careflow_step":[]}],"beslut":["Nej, patienten ska inte opereras"],"motivering_till_beslut":["Lorem"],"time":[]}],"underlag_citat_länkar_relevanta_för_beslutet":[{"citat_länk":[{"citat":[{"|formalism":"","|value":""}],"comment":[""],"description":[""],"länk_uri_till_källdata":[""]}],"citat_länk:1":[{"citat":[{"|formalism":"","|value":""}],"comment":[""],"description":[""],"länk_uri_till_källdata":[""]}],"citat_länk:2":[{"citat":[{"|formalism":"","|value":""}],"comment":[""],"description":[""],"länk_uri_till_källdata":[""]}]}]},"ctx":{"language":"sv","territory":"SE"}};
	
	var queryParams = {
		"ehrId": ehrId,
		templateId: 'Beslut om kirurgi m citations',
		format: 'STRUCTURED',
		committer: 'Carlos Test',
	};

	$.ajax({
		url: baseUrl + "/composition?" + $.param(queryParams), 
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(compositionData),
		success: function (data) {
			console.log(data);
			$("#result").html(data.meta.href);
		}
	});
}


function DeleteComposition(compid) {
	
	var uid = compid;
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	//e7732b37-e119-4fb1-a44f-b3f4325aa11d
	//composition for TriageHenrikv2
	
	var queryParams = {
		uid: uid
	};

	$.ajax({
		url: baseUrl + "/composition/" + uid, //$.param(queryParams), 
		type: 'DELETE',
		contentType: 'application/json',
		success: function (data) {
			console.log(data);
		}
	});
}

function DeleteTemplate() {
	
	var tempid = "samling_beslut";
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	//e7732b37-e119-4fb1-a44f-b3f4325aa11d
	//composition for TriageHenrikv2
	
	var queryParams = {
		templateId: tempid
	};

	$.ajax({
		url: baseUrl + "/template/" + tempid, //$.param(queryParams), 
		type: 'DELETE',
		contentType: 'application/json',
		success: function (data) {
			console.log(data);
		}
	});
}


function GetPatientByEHR(ehrId) {
	
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	
	$.ajax({
		url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
		type: 'GET',
		headers: {
			"Authorization": getSessionId()
		},
		success: function (data) {
			var party = data.party;
			$("#header").append(party.firstNames + " " + party.lastNames)
		}
	});
}
namespace.getPatientByEHRID = GetPatientByEHR


function GetPatientByName(firstname, lastname) {
	
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	var searchData = [
		{key: "firstNames", value: firstname},
		{key: "lastNames", value: lastname}
	];

	$.ajax({
		url: baseUrl + "/demographics/party/query",
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(searchData),
		success: function (res) {
			$("#header").html("Search for " + firstname+ " " + lastname);
			for (i in res.parties) {
				var party = res.parties[i];
				var ehrId;
				for (j in party.partyAdditionalInfo) {
					if (party.partyAdditionalInfo[j].key === 'ehrId') {
						ehrId = party.partyAdditionalInfo[j].value;
						break;
					}
				}
				
				$("#result").html(party.firstNames + ' ' + party.lastNames +
					' (ehrId = ' + ehrId + ')<br>');
			}
		}
	});
}

function GetVitalParameter(ehrId) {
	
	$.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	$.ajax({
		url: baseUrl + "/view/"+ ehrId + "/blood_pressure",
		type: 'GET',
		contentType: 'application/json',
		
		success: function(res) {
			console.log(res);
		}
	});
	
}

function GetTemplate() {
    $.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	$.ajax({
		url: baseUrl + "/template/Beslut om kirurgi"  ,
		type: 'GET',
		contentType: 'application/json',
		
		success: function(res) {
			var obj = {};
			obj = res
			//console.log(JSON.stringify(obj.webTemplate.tree));
			console.log(obj);
			//$("#result").html(JSON.stringify(res.webTemplate.tree));
		}
	});
}

function getForm(ehrId, name, version, callbackFn) {
	
    $.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	$.ajax({
		url: baseUrl + "/form/" + name + "/" + version + '?resources=SOURCE',
		type: 'GET',
		contentType: 'application/json',
		
		success: function(res) {
			// var obj = {};
			// obj.form = res.forms[26]
			// //initRendererInternal()
			console.log(res);
			if (callbackFn) callbackFn(res);
			//console.log(obj);
			//$("#result").html(JSON.stringify(res.webTemplate.tree));
		}
	});
}
namespace.getForm = getForm;

function listForms(callback){
	
    $.ajaxSetup({
		headers: {
			"Ehr-Session": getSessionId()
		}
	});
	
	$.ajax({
		url: baseUrl + "/form/",
		type: 'GET',
		contentType: 'application/json',	
		success: function(res) {
			//console.log(res);
			callback(res.forms);
		}
	});
}
namespace.listForms = listForms;



// function initRendererInternal(formObject, formValues) {
	// this.formModel = _thinkehrForms4Dist2	.default.thinkehr.f4.parseFormDescription(this.formContext, formObject.desc, formValues, formObject.deps);

	// if (this.afterModelFunc) {
		// this.afterModelFunc(this.compositionBusinessService, this.formModel, this._routeParams);
	// }

	// return this.formModel;
// }
		
// function initRenderer(formObject) {
	// var _this2 = this;

	// console.log("formObject", formObject);

	// this._context = {
		// language: "sv",
		// //configService.language,
		// territory: "se",
		// //configService.territory,
		// locale: "sv-se",
		// //configService.locale,
		// getTerminologyList: function getTerminologyList(terminologyStr, code, language, callbackFn) {
			// return _this2.termService.getList(terminologyStr, code, language, callbackFn);
		// },
		// getTerminologyItem: function getTerminologyItem(terminologyStr, code, language, callbackFn) {
			// return _this2.termService.getItem(terminologyStr, code, language, callbackFn);
		// }
	// };

	// if (this.isQuery) {
		// console.log('eval ', this._form);
		// this._queryService.query("select top 1 c1/uid/value as cid from EHR e[ehr_id/value='" + this._configService.ehrUid + "'] contains COMPOSITION c1 where c1/archetype_details/template_id/value = '" + this.templateId + "' order by c1/context/start_time desc", {}).then(function (result) {

			// var cid = result[0].cid;
			// _this2._cid = cid;
			// console.log('RESULT QUERY', cid);

			// _this2.compositionService.getComposition(cid).then(function (composition) {
				// console.log('composition', JSON.stringify(composition));

				// console.log("fd", formObject.desc);

				// _this2.initRendererInternal(formObject, composition);
			// });
		// });
	// } else {
		// this.initRendererInternal(formObject, {});
	// }
// }

// function drawForm () {
	
// }

}); // end of document ready

// **********************************
/*
*/
// **********************************







