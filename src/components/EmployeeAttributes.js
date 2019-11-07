import React from "react";
import Checkbox from 'calcite-react/Checkbox';

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
//getColumnsFromFields,
import { parseEmployeesData, parseDomainValues} from '../redux/selectors';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class EmployeeAttributes extends React.Component {
  constructor(props) {
    super();
    // this.state ={
    //   data: props.projects
    // }
    this.renderEditable = this.renderEditable.bind(this);
  }//checked={(this._getAttribute('GasWork') === 1) ? true : false}
  renderEditable(cellInfo) {
    
    if (cellInfo.column.id.indexOf("IsWS") > -1){
      //console.log("cellInfo: ", cellInfo);
      //console.log("cellInfo.column.value: ", cellInfo.value);
      console.log("cellInfo.value === '1' ||  cellInfo.value === 1 || cellInfo.value === true: ", (cellInfo.value === "1" ||  cellInfo.value === 1 || cellInfo.value === true) ? true: false);
        
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center !important', verticalAlign: 'middle'}}>
          <Checkbox 
          id={cellInfo.column.id} 
          //value={cellInfo.value}
          checked={(cellInfo.value === "1" ||  cellInfo.value === 1 || cellInfo.value === true) ? true: false}

          onChange={ e => { 
            console.log("checkbox onChange event e.target: ", e.target) ;
            const data = [...this.props.employees];
            console.log("data[cellInfo.index][cellInfo.column.id]: ", data[cellInfo.index][cellInfo.column.id], "   e.target.checked: ", e.target.checked) ;
            data[cellInfo.index][cellInfo.column.id] = e.target.checked ? "1" : "NULL";
            //setEmployees: (_employees, _adjust=false) =>
            this.props.setEmployees(data, true);

            if (this.props.saveButton) {
              console.log("setSaveButton")
              this.props.setSaveButton()
            }
            console.log("data[cellInfo.index][cellInfo.column.id]: ", data[cellInfo.index][cellInfo.column.id]) ;
          }} 
        />
        </div>
          
       
      );
    }
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          console.log("blur event")
          
          const data = [...this.props.employees];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          if (this.props.saveButton){
            console.log("setSaveButton")
            this.props.setSaveButton()
          }
          //this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.props.employees[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  render() {
    //const { data } = this.state;
    const filterCol = this.props.fields.filter (col => {
        return col.name !== "OBJECTID"
    })
    const columns = filterCol.map((fld) => {
      //console.log(fld.name);
      var _filter =  fld.name.toUpperCase().indexOf("COST") > -1 ? false : true;
      return {Header: fld.alias,  Cell: this.renderEditable, id: fld.name, accessor: fld.name, resizable: true, sortable: true, filterable: _filter}
    })
    console.log("this.props.employees: ", this.props.employees);
    return (
      
      <div className="overflow-y">
          <ReactTable defaultPageSize={this.props.employees.length} className="-striped -highlight" columns={columns} data={this.props.employees}
          defaultFilterMethod = {(filter, row) => {
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id]).toUpperCase().indexOf(String(filter.value).toUpperCase()) > -1: true}
          }
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onDoubleClick: (e, handleOriginal) => {
                console.log('A Td Element was double clicked!')
                //console.log('it produced this event:', e)
                //console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo)
                //console.log('It was in this table instance:', instance)
                this.props.selectFeature(rowInfo.original);
                //this.props.setPanel("project_details")
                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
          }}
          />
      </div>
    );
  }
}

// selector functions to reshape the state
//getColumnsFromFields(state, "employees")
const mapStateToProps = state => ({
    fields: state.map.employees['fields'],
    employees: parseEmployeesData(state),
    isVisible: state.map.attributesComponent,
    domains: parseDomainValues(state),
    saveButton: state.attributes.saveButton
  });
    
    const mapDispatchToProps = dispatch => {
      return bindActionCreators({
        ...attributeActions, ...mapActions
      }, dispatch);
    } 
  
  export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (EmployeeAttributes);
