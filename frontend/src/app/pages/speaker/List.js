
import React, {useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { FormattedMessage } from 'react-intl';
import list, {del} from '../helper/api';
import {Edit, Delete} from '@material-ui/icons';



function createData(id, name, father_name, mobile, email, city) {
  return { id, name, father_name, mobile,  email, city };
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
  { id: 'id', numeric: false, disablePadding: true, label: <FormattedMessage id="Id"/> },
  { id: 'name', numeric: false, disablePadding: true, label: <FormattedMessage id="Speaker.List.Column.Name"/> },
  { id: 'father_name', numeric: true, disablePadding: false, label: <FormattedMessage id="Speaker.List.Column.F_Name"/> },
  { id: 'mobile', numeric: true, disablePadding: false, label:<FormattedMessage id="Speaker.List.Column.Mobile_No"/> },
  { id: 'email', numeric: true, disablePadding: false, label:<FormattedMessage id= "Speaker.List.Column.Email"/> },
  { id: 'city', numeric: true, disablePadding: false, label: <FormattedMessage id= "Speaker.List.Column.City" />},
  { id: 'action', numeric: true, disablePadding: false, label: <FormattedMessage id= "Speaker.List.Column.Action" />},
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
      <Typography variant="h6" id="tableTitle">
        <FormattedMessage id="Speaker.List.Title"/>
      </Typography>
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

  function getSpeakers (){
    list('api/speakers').then((response)=>{
      let speaker_list = [];
      response.data.map((row)=>{
        speaker_list.push(createData(row.id, row.name, row.father_name, row.mobile, row.email, row.city))
      })
      setRows(speaker_list);
    })
  }
  useEffect(() => {
    getSpeakers();
  },[]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <div className={classes.tableWrapper}>
          <Table
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
                    >
                      
                      <TableCell style={{display:'none'}}>{row.id}</TableCell>
                      <TableCell>
                        {row.name}
                      </TableCell>
                      <TableCell>{row.father_name}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>
                        <Edit onClick={()=>{props.history.push(`/speaker/${row.id}`)}} style={{cursor:'pointer'}}/>
                        <Delete 
                          style={{cursor:'pointer'}}
                          onClick={()=>{
                            del(`api/speaker/${row.id}`,[row.id]).then((response)=>{
                              getSpeakers();
                          })}}
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

