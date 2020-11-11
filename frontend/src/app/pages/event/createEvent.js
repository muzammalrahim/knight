/* eslint-disable no-restricted-imports */
import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, ListItemText, Checkbox, ListItemIcon, ListItem, List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {ChevronLeft} from '@material-ui/icons';

const country = [
		{
			value: "Pakistan",
			label: "Pakistan"
		},
		{
			value: "Australia",
			label: "Australia"
		},
		{
			value: "India",
			label: "India"
		},
		{
			value: "China",
			label: "China"
		}
	];
	const province = [
		{
			value: "Punjab",
			label: "Punjab"
		},
		{
			value: "KPK",
			label: "KPK"
		},
		{
			value: "Sindh",
			label: "Sindh"
		}
	];
	function TabContainer(props) {
		return (
			<Typography component="div" style={{ padding: 8 * 3 }}>
				{props.children}
			</Typography>
		);
	}
	
	TabContainer.propTypes = {
		children: PropTypes.node.isRequired,
	};
// Example 2
const useStyles = makeStyles(theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap"
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1)
	},
	dense: {
		marginTop: theme.spacing(2)
	},
	menu: {
		width: 200
	},
	rightIcon: {
		marginLeft: theme.spacing(1),
	},
	
	button: {
		margin: theme.spacing(1)
	},
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}));



export default function TextFieldsExamplesPage() {
	const [values, setValues] = React.useState({
		name: "Cat in the Hat",
		age: "",
		multiline: "Controlled",
		currency: "EUR"
	});
	const [value, setValue] = React.useState(0);
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value });
	};

	// Example 2
	const classes = useStyles();
	const [values2, setValues2] = React.useState({
		name: "",
		age: "",
		multiline: "Controlled",
		currency: "EUR"
	});

	const handleChange2 = name => event => {
		setValues2({ ...values2, [name]: event.target.value });
	};
	function handleTabChange(event, newValue) {
		setValue(newValue);
	}
	return (
		<>
			<div className="row">
				<div className={classes.root}>
					<div className="col-md-12">
						<h3 className="card-label text-center pt-4 pb-2">Events Registration</h3>
						<AppBar position="static">
							{/* {value === 1 && <span className="pt-4 pl-4">
							<ChevronLeft/>
							Back
						</span>} */}
							<Tabs value={value}>
								<Tab label="Step One" style={{cursor:'unset'}}/>
								<Tab label="Step Two" style={{cursor:'unset'}}/>
							</Tabs>
						</AppBar>
						<TabContainer>
							<form className={classes.container} noValidate autoComplete="off">
								{value === 0 && <>
                  <div className="col-md-6">
                <TextField
                  id="outlined-name"
                  label="Event Name"
                  className={classes.textField}
                  value={values2.name}
                  onChange={handleChange2("name")}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <div className="col-md-6">
                <TextField
                  id="outlined-country"
                  select
                  label="Type"
                  className={classes.textField}
                  value={values2.currency}
                  onChange={handleChange("currency")}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText="Please select your currency"
                  margin="normal"
                  variant="outlined"
                >
                  {country.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </div>
              <div className="col-md-6">
                    <TextField
                      id="datetime-local"
                      label="Next appointment"
                      type="datetime-local"
                      defaultValue="2017-05-24T10:30"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
              </div>
              <div className="col-md-6">
                <TextField
                  id="outlined-name"
                  label="Duration"
                  className={classes.textField}
                  value={values2.name}
                  onChange={handleChange2("name")}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <div className="col-md-6">
                <TextField
                  id="outlined-country"
                  select
                  label="Web/Presential"
                  className={classes.textField}
                  value={values2.currency}
                  onChange={handleChange("currency")}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText="Please select your currency"
                  margin="normal"
                  variant="outlined"
                >
                  {country.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </div>
              <div className="col-md-6"/>
              <div className="col-md-6">
                <TextField
                  id="outlined-country"
                  select
                  label="Country"
                  className={classes.textField}
                  value={values2.currency}
                  onChange={handleChange("currency")}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText="Please select your currency"
                  margin="normal"
                  variant="outlined"
                >
                  {country.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </div>
              <div className="col-md-6">
                <TextField
                  id="outlined-select-currency-native"
                  select
                  label="State / Province"
                  className={classes.textField}
                  value={values2.currency}
                  onChange={handleChange("currency")}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText="Please select your currency"
                  margin="normal"
                  variant="outlined"
                >
                  {province.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </div>
              <div className="col-md-6">
                <TextField
                  id="outlined-uncontrolled"
                  label="City"
                  defaultValue=""
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <div className="col-md-6">
                <TextField
                  required
                  id="outlined-required"
                  label="Address"
                  defaultValue="Hello World"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="primary" className={classes.button} onClick={(event)=>{handleTabChange(event, 1)}}>
											Next
											{/* This Button uses a Font Icon, see the installation instructions in the docs. */}
											<Icon className={classes.rightIcon}>send</Icon>
										</Button>
									</div>
								</>}
								{value === 1 && <>
										<div className="col-md-6 text-center">
											<TextField
												id="outlined-name"
												label="Solicitant Name"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
                    </div>
										<div className="col-md-6">
                    <TextField
												id="outlined-country"
												select
												label="Business Unit"
												className={classes.textField}
												value={values2.currency}
												onChange={handleChange("currency")}
												SelectProps={{
													native: true,
													MenuProps: {
														className: classes.menu
													}
												}}
												// helperText="Please select your currency"
												margin="normal"
												variant="outlined"
											>
											{country.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
                    </div>
										<div className="col-md-6">
                    <TextField
												id="outlined-country"
												select
												label="Department"
												className={classes.textField}
												value={values2.currency}
												onChange={handleChange("currency")}
												SelectProps={{
													native: true,
													MenuProps: {
														className: classes.menu
													}
												}}
												// helperText="Please select your currency"
												margin="normal"
												variant="outlined"
											>
											{country.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
                    </div>
										<div className="col-md-6">
											<TextField
												id="outlined-name"
												label="Cost Center"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
                      </div>
										<div className="col-md-6">
                    <TextField
												id="outlined-country"
												select
												label="Speaker Name"
												className={classes.textField}
												value={values2.currency}
												onChange={handleChange("currency")}
												SelectProps={{
													native: true,
													MenuProps: {
														className: classes.menu
													}
												}}
												// helperText="Please select your currency"
												margin="normal"
												variant="outlined"
											>
											{country.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
                    </div>
										<div className="col-md-6">
                    <TextField
												id="outlined-country"
												select
												label="Virtual / Presential"
												className={classes.textField}
												value={values2.currency}
												onChange={handleChange("currency")}
												SelectProps={{
													native: true,
													MenuProps: {
														className: classes.menu
													}
												}}
												// helperText="Please select your currency"
												margin="normal"
												variant="outlined"
											>
											{country.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
                    </div>
										<div className="col-md-6">
                    <TextField
												id="outlined-country"
												select
												label="Duration"
												className={classes.textField}
												value={values2.currency}
												onChange={handleChange("currency")}
												SelectProps={{
													native: true,
													MenuProps: {
														className: classes.menu
													}
												}}
												// helperText="Please select your currency"
												margin="normal"
												variant="outlined"
											>
											{country.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
                    </div>
                    <div className="col-md-12 pt-4">
											<h5>Displacement</h5>
                      <List className={classes.root}>
                        {['Local (at the same State', 'Regional (at the same Country)','International (at different Country)'].map(value => {
                          const labelId = `checkbox-list-label-${value}`;

                          return (
                            <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={checked.indexOf(value) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={value} />
                              {/* <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="Comments">
                                  <CommentIcon />
                                </IconButton>
                              </ListItemSecondaryAction> */}
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
										<div className="col-md-12 text-right pt-4">
											<Button variant="contained" color="default" className={classes.button} style={{float:'left'}} onClick={(event)=>{handleTabChange(event, 0)}}>
												Back
												{/* <DeleteIcon className={classes.rightIcon} /> */}
											</Button>
											<Button variant="contained" color="default" className={classes.button}>
												Cancel
												{/* <DeleteIcon className={classes.rightIcon} /> */}
											</Button>
											<Button variant="contained" color="primary" className={classes.button}>
												Submit
												{/* This Button uses a Font Icon, see the installation instructions in the docs. */}
												<Icon className={classes.rightIcon}>send</Icon>
											</Button>
										</div>
								</>}
							</form>
							</TabContainer>
					</div>
					<div className="separator separator-dashed my-7"></div>
				</div>
			</div>
		</>
	);
}

