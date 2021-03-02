import React, {useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, 
  Toolbar, Typography, Paper, FormControlLabel, Switch, Snackbar, Button, Icon } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import list, {put} from '../helper/api';
import { Alert, AlertTitle } from '@material-ui/lab';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {getDate} from '../../../_metronic/_helpers'

function createData(id, event_name, date, event_duration, speaker_duration, business_unit, price, email, status) {
  return { id, event_name, date, event_duration, speaker_duration, business_unit, price, email, status };
}
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Id' },
  { id: 'event_name', numeric: false, disablePadding: true, label: <FormattedMessage id="Approval.List.Column.EventName"/> },
  { id: 'date', numeric: true, disablePadding: false, label:<FormattedMessage id="Approval.List.Column.Date"/>},
  { id: 'event_duration', numeric: true, disablePadding: false, label: <FormattedMessage id="Approval.List.Column.EventDuration"/> },
  { id: 'speaker_duration', numeric: true, disablePadding: false, label: <FormattedMessage id="Approval.List.Column.SpeakerDuration"/> },
  { id: 'business_unit', numeric: true, disablePadding: false, label: <FormattedMessage id="Approval.List.Column.BusinessUnit"/> },
  { id: 'price', numeric: true, disablePadding: false, label:<FormattedMessage id="Approval.List.Column.Price"/>},
  { id: 'email', numeric: true, disablePadding: false, label:<FormattedMessage id="Approval.List.Column.Email"/>},
  { id: 'status', numeric: true, disablePadding: false, label:<FormattedMessage id="Approval.List.Column.Status"/>},
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map((row, index) => (
        <TableCell
            style={{display:row.id === 'id' ? 'none' : ''}}
            key={index}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root)}
    >
      <Typography variant="h6" id="tableTitle" style={{width:'100%'}}>
        <FormattedMessage id="Event.List.Title"/>
      </Typography>
      <div className="text-right" style={{width:'100%'}}>
        <Button variant="contained" color="primary" style={classes.button} onClick={()=>{props.save()}}>
          Download
          <PictureAsPdfIcon />
        </Button>
      </div>
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [status, setStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState({
    severity: '',
    message:'',
    title:''
  });
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }
  async function getEvents (){
    list('api/event_speaker').then((response)=>{
      let event_list = [];
      response.data.map((row)=>{
        event_list.push(createData(row.id, row.event.name, row.event.date, row.event.duration, 1, row.event.business_unit, 500, row.speaker.email, row.status))
      })
      setRows(event_list);
      setEvents(response.data);
    })
  }
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  function handleChangeStatus (id, value){
    let data = events.find(event => event.id === id);
    data['status'] = value;
    data['speaker'] = data.speaker.id;
    data['event'] = data.event.id;
    put(`api/event_speaker/${id}/`,data).then((response)=>{
      let data = alert;
      data.severity = 'success';
      data.title = "Success";
      data.message = "Record has been successfully Updated";
      setAlert(data);
      setOpen(true);
      getEvents();
  }).catch((error)=>{
    let data = alert;
      data.severity = 'error';
      data.title = "Error";
      data.message = "Something went wrong";
      setAlert(data);
      setOpen(true);
  })
  };

  useEffect(() => {
    getEvents();
  },[]);
  const doc = new jsPDF()
  doc.autoTable({ html: '#approvals_list' })
  return (
    <div className={classes.root}>
      <Snackbar 
        open={open} 
        autoHideDuration={4000} 
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        onClose={closeAlert} 
      >
        <Alert 
            onClose={closeAlert} 
            severity={alert.severity}
          >
          <AlertTitle>{alert.title}</AlertTitle>
          <strong>{alert.message}</strong>
        </Alert>
      </Snackbar> 
      <Paper className={classes.paper}>
        <EnhancedTableToolbar save={()=>{doc.save('approvals.pdf')}}/>
        <div className={classes.tableWrapper}>
          <Table
            id="approvals_list"
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      style={{cursor:'pointer'}}
                      onClick={()=>{props.history.push(`approval/${row.id}`)}}
                    >
                      
                      <TableCell style={{display:'none'}}>{row.id}</TableCell>
                      <TableCell>
                        {row.event_name}
                      </TableCell>
                      <TableCell>{getDate(row.date)}</TableCell>
                      <TableCell>{row.event_duration}</TableCell>
                      <TableCell>{row.speaker_duration}</TableCell>
                      <TableCell>{row.business_unit}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={row.status}
                              onChange={()=>{
                                handleChangeStatus(row.id, !row.status)
                              }}
                              color="primary"
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {rows.length < 1 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
