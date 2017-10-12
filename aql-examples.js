var queryMap = {

    "BP+Pulse" :

"select bp/data[at0001|history|]/events[at0006|any event|]/Time as Time, " +
"bp/data[at0001|history|]/events[at0006|any event|]/data[at0003]/items[at0004|Systolic|]/value as Systolic, " +
"bp/data[at0001|history|]/events[at0006|any event|]/data[at0003]/items[at0005|Diastolic|]/value as Diastolic, " +
"c_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Pulse_Rate " +
"from EHR e " +
"contains COMPOSITION c " +    
"contains (OBSERVATION bp[openEHR-EHR-OBSERVATION.blood_pressure.v1] or OBSERVATION c_a[openEHR-EHR-OBSERVATION.pulse.v1])" +
"    where " +
"    c/archetype_details/template_id/value = 'triage' AND " +
" e/ehr_id/value = $ehrUid" +
" ORDER BY bp/data[at0001|history|]/events[at0006|any event|]/Time DESC" +
" offset 0 limit 4",

"Referral test1":
"select a_b/ism_transition[at0002]/current_state/value as Service_planned_current_state, e/ehr_id/value as EHRID, a as Composition from EHR e contains COMPOSITION a[openEHR-EHR-COMPOSITION.request.v1] contains ( INSTRUCTION a_a[openEHR-EHR-INSTRUCTION.request-procedure.v0] and ACTION a_b[openEHR-EHR-ACTION.service.v0]) where a/name/value='Remiss' order by a_b/time/value desc offset 0 limit 100",

"Planning test1":
"select e/ehr_id/value as EHRID, a as Composition from EHR e contains COMPOSITION a[openEHR-EHR-COMPOSITION.request.v1] where a/name/value='Beslut om kirurgisk åtgärd' order by a/context/start_time desc offset 0 limit 100",

"Empty query":
""

};

var csvMap = {
    

"VP temp Vladimir Dalton 41C":
{   remote: false,
    templateId: "Vital Signs",
    templateLanguage: "en",
    csv:
"ehrId,ctx/language,ctx/territory,vital_signs/body_temperature:0/any_event:0/temperature|magnitude,vital_signs/body_temperature:0/any_event:0/temperature|unit\n"+
"b51f3709-eeb6-49ed-afae-ef1468ec03fb,en,SE,41.3,°C"},

"VP temp Vladimir Dalton 37C":
{   remote: false,
    templateId: "Vital Signs",
    templateLanguage: "en",
    csv:
"ehrId,ctx/language,ctx/territory,vital_signs/body_temperature:0/any_event:0/temperature|magnitude,vital_signs/body_temperature:0/any_event:0/temperature|unit\n"+
"b51f3709-eeb6-49ed-afae-ef1468ec03fb,en,SE,37.1,°C"},

"VP temp":
{   remote: false,
    templateId: "Vital Signs",
    templateLanguage: "en",
    csv:
    "subjectId,ctx/language,ctx/territory,vital_signs/body_temperature:0/any_event:0/temperature|magnitude,vital_signs/body_temperature:0/any_event:0/temperature|unit\n"+
"1001,en,SI,37.1,°C"}

};

console.log("aql-examples.js loaded");