// selector functions for reshaping Redux state during mapStateToProps
import { createSelector } from 'reselect';


//reshape state for the table components
const parseFields = (state, _propName) => {
    var _fields =[];
    switch (_propName){
        case "features":
            state.map.fields.forEach((fld) => {
                var _fld = {};
                _fld['name'] = fld['name'];//state.map.fields[fld].name;
                _fld['type'] = fld['type'];//state.map.fields[fld].type;
                _fields.push(_fld);
            })
            console.log("\nparseFields 'features'",JSON.stringify(_fields));
            var visibleFields = ["Project_Name", "Project_Type", "Project_Location", "Project_Originator", "Status", "Proposed_Year", "WRE_ProjectNo", "Project_Manager",
                "Total_Cost", "Inspector", "Contractor"]
            const _fieldsFiltered = _fields.filter(fld => visibleFields.indexOf(fld.name) > -1);
            //console.log(JSON.stringify(_fieldsFiltered));
            return _fieldsFiltered
        case "employees":
            state.map.employees['fields'].forEach((fld) => {
                var _fld = {};
                _fld['name'] = fld['name'];//state.map.fields[fld].name;
                _fld['type'] = fld['type'];//state.map.fields[fld].type;
                _fields.push(_fld);
            })
            return _fields
        case "contractors":
            state.map.contractors.forEach((emp) => {
                var _fld = {};
                emp['fields'].forEach((fld) => {
                    _fld['name'] = fld['name'];//state.map.fields[fld].name;
                    _fld['type'] = fld['type'];//state.map.fields[fld].type;
                    _fields.push(_fld);
                })
            })
            return _fields
        default:
            return _fields
    }
        

    
}

const parseProjects = (state) => {
    var _data = [];
    //console.log("parseAttributes\n",JSON.stringify(this.props.projects))
    //var fldList = this.props.features["fields"];
    //console.log("fldList\n",JSON.stringify(fldList))
    state.map.features.forEach((prj) => {
        //console.log(typeof fld);
        //console.log( fld);
        //console.log( JSON.stringify(prj));
        _data.push(prj['attributes']);
    })
    //console.log(JSON.stringify(_data));
    return _data
}

const parseContractors = (state) => {
    var _data = [];
    state.map.contractors['features'].forEach((con) => {
        _data.push(con['attributes']);
    })
    return _data
}

const parseEmployeess = (state) => {
    var _data = [];
    state.map.employees['features'].forEach((emp) => {
        //console.log(emp);
        _data.push(emp['attributes']);
    })
    return _data
}

const parseDomains = (state) => {
    var _fieldsWithDomains =[];
    state.map.fields.forEach((fld) => {
        if (!(fld['domain'] === undefined || fld['domain'] === null)){
          _fieldsWithDomains.push(fld['domain']);  
        }
        
    })
    //console.log("_fieldsWithDomains\n\t",JSON.stringify(_fieldsWithDomains));
    var _domains =[];
    _fieldsWithDomains.forEach((d) =>{
        var key = d.name.slice(0,-7);
        const val = d.codedValues.map(function(cv) {
            var _obj ={};
            _obj[cv.name]= cv.code
            return  _obj;
        });
        var obj = { };
        obj[key]=val;
        _domains.push(obj);
    })
    // [{"domain name": ["values"]}]
    //console.log("parse domains \n\t", JSON.stringify(_domains));
    return _domains
}
// fields array of obj
/* [{"alias":"OBJECTID","defaultValue":null,"editable":false,"length":-1,"name":"OBJECTID","nullable":false,"type":"esriFieldTypeOID"},
    {"alias":"MapID","defaultValue":null,"editable":true,"length":50,"name":"MapID","nullable":true,"type":"esriFieldTypeString"},
    {"alias":"Project_Type","defaultValue":null,"domain":{"name":"Project_Type_Domain","type":"codedValue",
        "codedValues":[
            {"name":"Water and Sewer","code":"Water and Sewer"},{"name":"Water","code":"Water"},
            {"name":"Sewer","code":"Sewer"},{"name":"Storm","code":"Storm"},{"name":"Street","code":"Street"},
            {"name":"Sidewalk","code":"Sidewalk"},{"name":"Gas","code":"Gas"},{"name":"Electric","code":"Electric"},
            {"name":"Blueprint 2000","code":"Blueprint 2000"},{"name":"County","code":"County"},
            {"name":"FDOT","code":"FDOT"},{"name":"Development","code":"Development"}
        ]},
        "editable":true,"length":50,"name":"Project_Type","nullable":true,"type":"esriFieldTypeString"},
    {"alias":"Project_Year","defaultValue":null,"editable":true,"length":-1,"name":"Proposed_Year",
        "nullable":true,"type":"esriFieldTypeSmallInteger"},
    {"alias":"Let_Date","defaultValue":null,"editable":true,"length":8,"name":"Let_Date","nullable":true,"type":"esriFieldTypeDate"},
     ...]
 */

//createSelector takes an array of input-selectors and a transform function as its arguments.
//If the Redux state tree is changed in a way that causes the value of an input-selector to change,
// the selector will call its transform function with the values of the input-selectors as arguments and return the result.
export const getColumnsFromFields = (state, _propName) => createSelector(
    [parseFields], (fields) => 
        fields || []
    )(state, _propName)

export const parseProjectData = (state) => createSelector(
    [parseProjects], (projects) =>
    projects || []
)(state)

export const parseDomainValues = (state) => createSelector(
    [parseDomains], (fields) =>
    fields || []
)(state)

export const parseContractorData = (state) => createSelector(
    [parseContractors], (contractor) =>
    contractor || []
)(state)

export const parseEmployeesData = (state) => createSelector(
    [parseEmployeess], (contractor) =>
    contractor || []
)(state)