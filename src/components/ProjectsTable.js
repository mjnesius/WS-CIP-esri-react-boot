import React from "react";

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {getColumnsFromFields, parseProjectData, parseDomainValues} from '../redux/selectors';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class ProjectsTable extends React.Component {
  constructor(props) {
    super();
    this.state ={
      data: props.projects
    }
    this.renderEditable = this.renderEditable.bind(this);
  }
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          //this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  render() {
    //const { data } = this.state;
    const columns = this.props.fields.map((fld) => {
      //console.log(fld.name.length);
        
      return {Header: fld.name,  Cell: this.renderEditable, id: fld.name, accessor: fld.name, resizable: true, sortable: true, filterable: true}
    })
    
    //console.log( "columns\n\t", JSON.stringify(columns));
    //{this.props.optionsStatus.map((e, key) => {
    //     return <option key={key} value={e}>{e}</option>;
    // })}
    return (
      <div className="overflow-y">
          <ReactTable defaultPageSize={10} className="-striped -highlight" columns={columns} data={this.props.projects}
          defaultFilterMethod = {(filter, row, column) => {
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
                this.props.setPanel("project_details")
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
const mapStateToProps = state => ({
    fields: getColumnsFromFields(state),
    projects: parseProjectData(state),
    isVisible: state.map.attributesComponent,
    domains: parseDomainValues(state)
  });
    
    const mapDispatchToProps = dispatch => {
      return bindActionCreators({
        ...attributeActions, ...mapActions
      }, dispatch);
    } 
  
  export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (ProjectsTable);
