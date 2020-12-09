import React, { useState, useEffect } from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import { FormattedMessage } from 'react-intl';
import list, {del} from '../helper/api';
import {Edit, Delete} from '@material-ui/icons';

function createData(id, username, first_name, last_name, email, business_unit) {
  return { id, username, first_name, last_name, email, business_unit };
}
const headRows = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Id', hidden:true  },
  { id: 'username', numeric: false, disablePadding: true, label:<FormattedMessage id="User.List.Column.User_Name"/> },
  { id: 'first_name', numeric: true, disablePadding: false, label: <FormattedMessage id="User.List.Column.First_Name"/> },
  { id: 'last_name', numeric: true, disablePadding: false, label: <FormattedMessage id="User.List.Column.Last_Name"/> },
  { id: 'email', numeric: true, disablePadding: false, label: <FormattedMessage id="User.List.Column.Email"/> },
  { id: 'business_unit', numeric: true, disablePadding: false, label: <FormattedMessage id="User.List.Column.Bus_Un"/> },
  { id: 'action', numeric: true, disablePadding: false, label: <FormattedMessage id="User.List.Column.Action"/> },
];
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
            key={index}
            sortDirection={orderBy === row.id ? order : false}
            style={{display:row.id==='id' ? 'none' : ''}}
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
        <FormattedMessage id="User.List.Title"/>
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
  function getUsers(){
    list('users').then((response)=>{
      let user_list = [];
      response.data.map((row)=>{
        user_list.push(createData(row.id, row.username, row.first_name, row.last_name, row.email, row.business_unit))
      })
      setRows(user_list);
    })
  }
  useEffect(() => {
    getUsers();
  },[]);


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell style={{display:'none'}}>
                        {row.id}
                      </TableCell>
                      <TableCell 
                        id={labelId} 
                        scope="row" 
                        onClick={()=>{props.history.push(`user/${row.id}`)}} 
                        >
                        {row.username}
                      </TableCell>
                      <TableCell>{row.first_name}</TableCell>
                      <TableCell>{row.last_name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.business_unit}</TableCell>
                      <TableCell>
                        <Edit onClick={()=>{props.history.push(`/user/${row.id}`)}} style={{cursor:'pointer'}}/>
                        <Delete 
                          style={{cursor:'pointer'}}
                          onClick={()=>{
                            del(`users/${row.id}/`,[row.id]).then((response)=>{
                              getUsers();
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
