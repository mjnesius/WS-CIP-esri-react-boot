import React from "react";
import { render } from "react-dom";

import { bindActionCreators } from 'redux';
import { actions as filterActions } from '../redux/reducers/filters';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {getColumnsFromFields, parseProjectData} from '../redux/selectors';
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
        return {Header: fld.name, Cell: this.renderEditable, id: fld.name, accessor: fld.name, resizable: true, sortable: true, filterable: true}
    })
    
    //console.log( "data\n\t", JSON.stringify(data));
    //{this.props.optionsStatus.map((e, key) => {
    //     return <option key={key} value={e}>{e}</option>;
    // })}
    return (
      <div className="overflow-y">
          <ReactTable defaultPageSize={10} className="-striped -highlight" columns={columns} data={this.props.projects}/>
        {/* <ReactTable
          data={data}
          columns={[
            {
              Header: "First Name",
              accessor: "firstName",
              Cell: this.renderEditable
            },
            {
              Header: "Last Name",
              accessor: "lastName",
              Cell: this.renderEditable
            },
            {
              Header: "Full Name",
              id: "full",
              accessor: d =>
                <div
                  dangerouslySetInnerHTML={{
                    __html: d.firstName + " " + d.lastName
                  }}
                />
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br /> */}
      </div>
    );
  }
}

// selector functions to reshape the state
const mapStateToProps = state => ({
    fields: getColumnsFromFields(state),
    projects: parseProjectData(state.map.features),
    isVisible: state.map.attributesComponent
  });
    
    const mapDispatchToProps = dispatch => {
      return bindActionCreators({
        ...filterActions
      }, dispatch);
    } 
  
  export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (ProjectsTable);
