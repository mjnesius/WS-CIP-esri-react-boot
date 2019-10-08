// selector functions for reshaping Redux state during mapStateToProps
import { createSelector } from 'reselect';


const parseFields = (state) => {
    var _fields =[];
    //console.log("parseFields\n",JSON.stringify(state.map.fields))
    var fldList = state.map.fields["fields"];
    //console.log("fldList\n",JSON.stringify(fldList))
    fldList.forEach((fld) => {
        var _fld = {};
        //console.log(typeof fld);
        //console.log( fld);
        //console.log( fld['name']);
        _fld['name'] = fld['name'];//state.map.fields[fld].name;
        _fld['type'] = fld['type'];//state.map.fields[fld].type;
        //console.log("state.map.fields[fld]", JSON.stringify(state.map.fields[fld]));
        //console.log( project);
        _fields.push(_fld);
    })
    console.log(JSON.stringify(_fields));
    return _fields
}

const parseProjects = (projects) => {
    var _data = [];
    //console.log("parseAttributes\n",JSON.stringify(this.props.projects))
    //var fldList = this.props.features["fields"];
    //console.log("fldList\n",JSON.stringify(fldList))
    projects.forEach((prj) => {
        //console.log(typeof fld);
        //console.log( fld);
        //console.log( JSON.stringify(prj));
        _data.push(prj['attributes']);
    })
    console.log(JSON.stringify(_data));
    return _data
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
export const getColumnsFromFields = (state) => createSelector(
    [parseFields], (fields) => 
        fields || []
    )(state)

export const parseProjectData = (state) => createSelector(
    [parseProjects], (projects) =>
    projects || []
)(state)