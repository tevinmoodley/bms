// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;

import { translate } from 'react-i18next';

// import Select from 'react-select';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

// Animation
import { Motion, spring } from 'react-motion';
import Transition from 'react-motion-ui-pack'

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getMaterials } from '../../reducers/Operations/MaterialsReducer';
import { getClients } from '../../reducers/Operations/ClientsReducer';
import { getOvertimeApplications } from '../../reducers/HR/OvertimeApplicationsReducer';

// Components
import ComboBox from '../../components/shared/ComboBox';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Message from '../../components/shared/Message';
import CustomButton, { ButtonsGroup } from '../../components/shared/Button';
import { Field, Part, Row } from '../../components/shared/Part';
import Logo from '../../components/settings/_partials/profile/Logo';

import Modal from 'react-modal';

// Styles
import styled from 'styled-components';

import _withFadeInAnimation from '../../components/shared/hoc/_withFadeInAnimation';
import
{
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../../components/shared/Layout';


const modalStyle =
{
  content :
  {
    top                   : '15%',
    left                  : '7%',
    right                 : 'auto',
    bottom                : 'auto',
    border                : '2px solid black',
    minWidth              : window.outerWidth-160, // '950px'
  }
};

export class OvertimeApplications extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editOvertime = this.editOvertime.bind(this);
    this.deleteOvertime = this.deleteOvertime.bind(this);
    this.duplicateOvertime = this.duplicateOvertime.bind(this);
    this.setOvertimeStatus = this.setOvertimeStatus.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    
    // this.creator_ref = React.createRef();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.col_toggles_container = null;
    this.col_width = 235;
    this.state =
    {
                    filter: null,
                    is_new_overtime_modal_open: false,
                    is_overtime_items_modal_open: false,
                    selected_overtime: null,
                    active_row: null,
                    column_toggles_top: -200,
                    // Table Column Toggles
                    col_id_visible: false,
                    col_object_number_visible: true,
                    col_employee_visible: false,
                    col_job_visible: false,
                    col_time_in_visible: true,
                    col_time_out_visible: true,
                    col_date_visible: false,
                    col_status_visible: true,
                    col_creator_visible: false,
                    col_date_logged_visible: false,
    };
  }

  // Load OvertimeApplications & add event listeners
  componentDidMount()
  {
    // Add Event Listener
    ipc.on('confirmed-delete-overtime', (event, index, overtimeId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteOvertime(overtimeId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-overtime');
  }

  // Open Confirm Dialog
  deleteOvertime(overtimeId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteOvertime:title'),
        message: t('dialog:deleteOvertime:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-overtime',
      overtimeId
    );
  }

  // Confirm Delete an overtime
  confirmedDeleteOvertime(overtimeId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteOvertime(overtimeId));
  }

  // set the overtime status
  setOvertimeStatus(overtimeId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setOvertimeStatus(overtimeId, status));
  }

  editOvertime(overtime)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editOvertime(overtime));
  }

  duplicateOvertime(overtime)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateOvertime(overtime));
  }

  setFilter(event)
  {
    const currentFilter = this.state.filter;
    const newFilter = event.target.dataset.filter;
    this.setState({ filter: currentFilter === newFilter ? null : newFilter });
  }

  getCaret(direction)
  {
    if (direction === 'asc')
    {
      return (
        <img src="../static/open-iconic-master/svg/caret-top.svg" alt='up' />
      );
    }
    if (direction === 'desc')
    {
      return (
        <img src="../static/open-iconic-master/svg/caret-bottom.svg" alt='down' />
      );
    }
    return (
      <span>
        <img src="../static/open-iconic-master/svg/info.svg" alt='info' style={{width: '13px', height: '13px', marginLeft: '10px'}} />
        (click&nbsp;to&nbsp;sort)
      </span>
    );
  }

  onAfterSaveCell(row, cellName, cellValue)
  {
    // alert(`After cell save ${cellName} with value ${cellValue}`);
  
    // let rowStr = '';
    /* for (const prop in row) {
      rowStr += prop + ': ' + row[prop] + '\n';
    } */
  
    // alert('Thw whole row :\n' + rowStr);
  }
  
  onBeforeSaveCell(row, cellName, cellValue)
  {
    // alert(`Before cell save ${cellName} with value ${cellValue}`);
    // You can do any validation on here for editing value,
    // return false for reject the editing
    return true;
  }

  isExpandableRow(row)
  {
    // (row.object_number < 50) ? return true : return false;
    return true;
  }

  expandComponent(row)
  {
    return (<div />);
  }

  expandColumnComponent({ isExpandableRow, isExpanded })
  {
    if (isExpandableRow)
    {
      if(isExpanded)
        return (<span className="ion-arrow-down-b" />);
      return (<span className="ion-arrow-right-b" />);
    } 
    return(<span />);
  }

  openModal()
  {
    this.setState({ is_new_overtime_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_overtime_modal_open: false});
  }

  // Render
  render()
  {
    const { overtimeApplications, t } = this.props;
    
    const cellEditProp =
    {
      mode: 'click',
      nonEditableRows: () => ['_id', 'object_number', 'date_logged', 'creator', 'creator_name'],
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };

    const options =
    {
      defaultSortName: 'object_number',  // default sort column name
      defaultSortOrder: 'desc',
      expandRowBgColor: 'rgba(0, 0, 0, .4)'
    };

    const clientFormatter = (cell, row) => `<i class='glyphicon glyphicon-${cell.client_name}'></i> ${cell.client_name}`;

    return (
      <PageContent bare>
        <div style={{maxHeight: 'auto'}}>
          {/* OvertimeApplications table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            {/* OvertimeApplications Table column toggles */}
            <Transition
              component={false}
              enter={{
                translateY: this.state.column_toggles_top,
                // translateX: (window.innerWidth * 0.09)
              }}
              leave={{
                translateY: this.state.column_toggles_top,
                // translateX: (window.innerWidth * 0.09)
              }}
              ref={(el)=> this.col_toggles_container = el}
              style={{
                position: 'fixed',
                zIndex: '10',
                background: 'rgb(180, 180, 180)',
                // left: window.innerWidth * 0.010 + '%',
              }}
            >  
              {/* , maxWidth: (window.innerWidth * 0.82) + 'px' */}
              { window.onresize = () => {
                Object.assign(this.toggle_container.style, {marginLeft: (-45 + (window.outerWidth * 0.01)) + 'px'});
              }}
              <div ref={(r)=>this.toggle_container = r} key='overtime_applications_col_toggles' style={{boxShadow: '0px 10px 35px #343434', marginLeft: '-35px', position: 'fixed', top:  '130px'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Overtime&nbsp;App&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="toggle_overtime_id"
                          type="checkbox"
                          checked={this.state.col_id_visible}
                          onChange={() =>
                          {
                            const is_id_visible = !this.state.col_id_visible;
                            this.setState(
                            {
                              col_id_visible: is_id_visible,
                              col_id_end: is_id_visible ? 190 + this.col_width : 190
                            });
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Object # column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Overtime&nbsp;App&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="toggle_overtime_number"
                          type="checkbox"
                          checked={this.state.col_object_number_visible}
                          onChange={() =>
                          {
                            const is_num_visible = !this.state.col_object_number_visible;

                            this.setState(
                            {
                              col_object_number_visible: is_num_visible,
                              col_object_number_end: is_num_visible ? this.col_id_end + this.col_width : this.col_id_end
                              // col_object_number_end: this.state.col_object_number_visible ? this.state.col_id_end : this.state.col_id_end + 190
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Employee column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Employee</label>
                      <label className="switch">
                        <input
                          name="toggle_employee"
                          type="checkbox"
                          checked={this.state.col_employee_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_employee_visible: !this.state.col_employee_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Job column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Job</label>
                      <label className="switch">
                        <input
                          name="toggle_job"
                          type="checkbox"
                          checked={this.state.col_job_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_job_visible: !this.state.col_job_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Date column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Date</label>
                      <label className="switch">
                        <input
                          name="toggle_date"
                          type="checkbox"
                          checked={this.state.col_date_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_date_visible: !this.state.col_date_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Time in column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Time&nbsp;in</label>
                      <label className="switch">
                        <input
                          name="toggle_time_in"
                          type="checkbox"
                          checked={this.state.col_time_in_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_time_in_visible: !this.state.col_time_in_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>
                    
                    {/* Time out column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Time&nbsp;out</label>
                      <label className="switch">
                        <input
                          name="toggle_time_out"
                          type="checkbox"
                          checked={this.state.col_time_out_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_time_out_visible: !this.state.col_time_out_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Status column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Status</label>
                      <label className="switch">
                        <input
                          name="toggle_status"
                          type="checkbox"
                          checked={this.state.col_status_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_status_visible: !this.state.col_status_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Creator column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Creator</label>
                      <label className="switch">
                        <input
                          name="toggle_creator"
                          type="checkbox"
                          checked={this.state.col_creator_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_creator_visible: !this.state.col_creator_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Date Logged column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Date&nbsp;Logged</label>
                      <label className="switch">
                        <input
                          name="toggle_date_logged"
                          type="checkbox"
                          checked={this.state.col_date_logged_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_date_logged_visible: !this.state.col_date_logged_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>
                  </Row>
                  <Row>
                    <CustomButton onClick={this.openModal} success>New Overtime Application</CustomButton>
                    <CustomButton
                      success
                      style={{ marginLeft: '20px' }}
                      onClick={() => 
                      {
                        if(this.state.column_toggles_top < -80)
                          this.setState({column_toggles_top: -80});
                        else
                          this.setState({column_toggles_top: -200});
                      }}
                    >
                  Toggle Filters
                    </CustomButton>
                  </Row>
                </Part>
              </div>
            </Transition>

            {/* List of Overtime Applications */}
            { overtimeApplications.length === 0 ? (
              <Message danger text='No overtime applications were found in the system' style={{marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '20px', marginLeft: '-40px', backgroundColor: '#2BE8A2'}}>
                <BootstrapTable
                  id='tblOvertimeApplications'
                  key='tblOvertimeApplications'
                  data={overtimeApplications}
                  striped
                  hover
                  insertRow={false}
                  selectRow={{bgColor: '#3c3c3c'}}
                  expandableRow={this.isExpandableRow}
                  expandComponent={this.expandComponent}
                  trStyle={(row) => ({background: 'lightblue'})}
                  expandColumnOptions={{
                    expandColumnVisible: true,
                    expandColumnComponent: this.expandColumnComponent,
                    columnWidth: 50}}
                  cellEdit={cellEditProp}
                  dataFormatter={clientFormatter}
                  options={options}
                  // onScroll={}
                  version='4' // bootstrap version
                >
                  <TableHeaderColumn  
                    // isKey
                    dataField='_id'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', left: '190px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_id_visible}
                  > Overtime&nbsp;App&nbsp;ID
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    isKey
                    dataField='object_number'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={() => {this.state.col_id_visible?({position: 'fixed', background: 'red' }):({background: 'lime'})}}
                    // thStyle={this.state.col_id_visible?{position: 'fixed', left: '400px',background: 'lime'}:{position: 'fixed', background: 'red'}}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 'px', background: 'lime'}}
                    tdStyle={() => {({'fontWeight': 'lighter'})}}
                    hidden={!this.state.col_object_number_visible}
                  > Overtime&nbsp;App&nbsp;Number
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='usr'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_employee_visible}
                    customEditor={{
                      getElement: (func, props) =>
                        <ComboBox items={this.props.employees} selected_item={props.row.contact} label='name' />
                    }}
                  > Employee
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='start_date'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_job_visible}
                  > Start&nbsp;date
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='end_date'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_time_in_visible}
                  > End&nbsp;date
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='return_date'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_time_out_visible}
                  > Date&nbsp;Returned
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='status'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_status_visible}
                  > Status
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='creator_name'
                    dataSort
                    ref={this.creator_ref}
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', right: this.width, border: 'none' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_creator_visible}
                  > Creator
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='date_logged'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', right: '-20px', border: 'none' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_date_logged_visible}
                  > Date&nbsp;Logged
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            )}
          </div>
        </div>
      </PageContent>
    );
  }
}

// PropTypes Validation
OvertimeApplications.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  overtimeApplications: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  overtimeApplications: getOvertimeApplications(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(OvertimeApplications);
