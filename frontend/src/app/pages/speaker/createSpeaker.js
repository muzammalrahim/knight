/* eslint-disable no-restricted-imports */
import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab } from "@material-ui/core";
import { Dropdown, FormControl, InputGroup, DropdownButton } from "react-bootstrap";
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
						<h3 className="card-label text-center pt-4 pb-2">Speaker Registration</h3>
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
											label="Full Name"
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
											// helperText="Please select your currency"
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
									<div className="col-md-6">
										<TextField
											id="outlined-cep"
											label="CEP/ZIP"
											defaultValue="Hello World"
											className={classes.textField}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="outlined-email-input"
											label="Email"
											className={classes.textField}
											type="email"
											name="email"
											autoComplete="email"
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="outlined-email-input"
											label="Mobile"
											className={classes.textField}
											type="number"
											name="mobile"
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="outlined-email-input"
											label="LinkedIn URL"
											className={classes.textField}
											type="text"
											name="mobile"
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="outlined-email-input"
											label="Lattes URL"
											className={classes.textField}
											type="text"
											name="mobile"
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
											<strong>Physical Person Data</strong>
											<TextField
												id="outlined-name"
												label="National ID"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
											<TextField
												id="outlined-name"
												label="CPF (Brazilian only)"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
											<InputGroup className="pt-4 ml-2">
												<InputGroup.Prepend>
													<InputGroup.Text>UF - CRM</InputGroup.Text>
												</InputGroup.Prepend>
												<DropdownButton
													as={InputGroup.Prepend}
													variant="outlined"
													title=""
													id="input-group-dropdown-1"
												>
													<Dropdown.Item href="#">Action</Dropdown.Item>
													<Dropdown.Item href="#">Another action</Dropdown.Item>
													<Dropdown.Item href="#">Something else here</Dropdown.Item>
													<Dropdown.Divider />
													<Dropdown.Item href="#">Separated link</Dropdown.Item>
												</DropdownButton>
												<FormControl aria-describedby="basic-addon1" />
											</InputGroup>
											<TextField
												id="outlined-country"
												select
												label="Specialty"
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
										<TextField
											id="outlined-country"
											select
											label="Bank Name"
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
										<TextField
												id="outlined-name"
												label="Agency"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
											<TextField
												id="outlined-name"
												label="Account"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
										</div>
										<div className="col-md-6 text-center">
											<strong>Juridical Person Data</strong>
											<TextField
												id="outlined-name"
												label="Company Name"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
											<TextField
												id="outlined-name"
												label="CNPJ (Brazilian only)"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
											<InputGroup className="pt-4 ml-2">
												<InputGroup.Prepend>
													<InputGroup.Text>UF / City</InputGroup.Text>
												</InputGroup.Prepend>
												<DropdownButton
													as={InputGroup.Prepend}
													variant="outlined"
													title=""
													id="input-group-dropdown-1"
												>
													<Dropdown.Item href="#">Action</Dropdown.Item>
													<Dropdown.Item href="#">Another action</Dropdown.Item>
													<Dropdown.Item href="#">Something else here</Dropdown.Item>
													<Dropdown.Divider />
													<Dropdown.Item href="#">Separated link</Dropdown.Item>
												</DropdownButton>
												<FormControl aria-describedby="basic-addon1" />
											</InputGroup>
											<TextField
												id="outlined-name"
												label="Address"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
										<TextField
											id="outlined-country"
											select
											label="Bank Name"
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
										<TextField
												id="outlined-name"
												label="Agency"
												className={classes.textField}
												value={values2.name}
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
											<TextField
												id="outlined-name"
												label="Account"
												className={classes.textField}
												value={values2.name}Please select your currency
												onChange={handleChange2("name")}
												margin="normal"
												variant="outlined"
											/>
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

