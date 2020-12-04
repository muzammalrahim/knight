/* eslint-disable no-restricted-imports */
import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, Checkbox, Radio } from "@material-ui/core";
import { Dropdown, FormControl, InputGroup, DropdownButton } from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {ChevronLeft} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import Grid from '@material-ui/core/Grid';
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
import {post} from '../helper/api';

class SpeakerRegistrationForm extends React.Component{
	constructor(props){
		super(props);
		this.speaker={
			foreignFlag: false,	accept_info: false,	name: "", father_name: "",	mother_name:"",	dob:"",
			birthplace:"", civil_state:"", scholarity: "", social_number: "", service_provider: "", country: "Select Counrty ...",
			state: "", city: "", neighborhood: "", cep: "", ddd: "", address:"", id_number: "", document_issue_date: "",
			emitting_organ: "", email: "", mobile: "", fax: "", linkedin: "", lattes: "", orcid: "", registration_in_city: false,
			social_security: false, person_type:""
		}
		this.state={
			speaker: this.speaker,
			currentTab: 0,
			onlyNums:'',
			countries:[{value:'Select country ....', label:'Select country ....'}]
		}
	}

	handleChange(event){
		let key = event.target.name;
		let value = event.target.value;
		let {speaker} = this.state;
		if(key==="foreignFlag" || key==="accept_info" || key==="registration_in_city" || key==="social_security"){
			speaker[key]=!(speaker[key])
		}
		else if(key==="id_number" || key==="fax" || key==="mobile"){
			if(event.keyCode !== 107 && event.keyCode !== 109){
				speaker[key]=value;
				this.setState({speaker});
			}
			else {
				event.target.value = speaker[key];
			}
		}
		else {
			speaker[key]= value;
		}
		this.setState({speaker})
		console.log(speaker)
	}

	handleTabChange(currentTab) {
		this.setState({currentTab});
	}
	handleSubmit(){
		let {speaker} = this.state;
		if(speaker.name && speaker.dob && speaker.birthplace && speaker.civil_state && speaker.scholarity && speaker.service_provider && speaker.country && speaker.state && speaker.city){
			post('api/speakers', speaker).then((response)=>{
				this.props.history.push('/speakers')
			}).catch((response)=>{
				console.log('response error', response)
			})
		}
	}
	componentDidMount(){
		fetch('https://restcountries.eu/rest/v2/all')
		.then(response => response.json())
		.then((data) => {
			let list_data = []
			data.map((country)=>{
				list_data.push({label:country.name, value: country.name})
			})
			this.setState({countries:list_data})});
	}
	render(){
		let {speaker:{foreignFlag, accept_info, person_type}, speaker, currentTab, countries} = this.state;

		return (
			<div style={styles.root}>
				<Grid container spacing={3}>
        			<Grid item xs={12}>	
						<h3 className="card-label text-center pt-4 pb-2">
							<FormattedMessage id="Speaker.Registration.Title"/>
						</h3>
						<AppBar position="static">
							<Tabs value={currentTab}>
								<Tab label="Step One" style={{cursor:'unset'}}/>
								<Tab label="Step Two" style={{cursor:'unset'}}/>
							</Tabs>
						</AppBar>
					</Grid>
				</Grid>
					<TabContainer>
						<form style={styles.container} noValidate autoComplete="off">
							<Grid container spacing={3}>
								{currentTab === 0 && <>
									<div className="col-md-3">
										<Checkbox
											name="foreignFlag"
											checked={foreignFlag}
											onChange={(event)=>{this.handleChange(event)}}
											inputProps={{
											'aria-label': 'primary checkbox',
											}}
										/>
										<strong>Foreign Flag</strong>
									</div>
									<div className="col-md-9">
										<Checkbox
											checked={accept_info}
											name="accept_info"
											onChange={(event)=>{this.handleChange(event)}}
											value={accept_info}
											inputProps={{
											'aria-label': 'primary checkbox',
											}}
										/>
										<strong>Accept Information Rule</strong>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="name"
											label="Full Name"
											style={styles.textField}
											defaultValue={speaker.name}
											onBlur={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									
									<div className="col-md-6">
										<TextField
											name="father_name"
											label="Father's Name"
											required={!foreignFlag}
											style={styles.textField}
											defaultValue={speaker.father_name}
											onBlur={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required={!foreignFlag}
											name="mother_name"
											label="Mother's Name"
											style={styles.textField}
											defaultValue={speaker.mother_name}
											onBlur={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="dob"
											label="Birthday"
											type="date"
											value={speaker.dob ? speaker.dob : getCurrentDate()}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
											onChange={(event) =>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="birthplace"
											label="Birthplace"
											style={styles.textField}
											defaultValue={speaker.birthplace}
											onBlur={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="civil_state"
											select
											label="Civil State"
											style={styles.textField}
											value={speaker.civil_state}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											// helperText="Please select your currency"
											margin="normal"
											variant="outlined"
										>
											{civilStatus.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="scholarity"
											label="Scholarity"
											style={styles.textField}
											value={speaker.scholarity}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required={!foreignFlag}
											name="social_number"
											label="Social Number"
											style={styles.textField}
											defaultValue={speaker.social_number}
											onBlur={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-3">
									<TextField
											required
											name="service_provider"
											label="Service Provider"
											style={styles.textField}
											defaultValue={speaker.service_provider}
											onBlur={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required
											select
											name="country"
											label="Country"
											style={styles.textField}
											value={speaker.country}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											// helperText="Please select your currency"
											margin="normal"
											variant="outlined"
										>
											{countries.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-4">
										<TextField
											required
											name="state"
											label="State / Province"
											defaultValue={speaker.state}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required
											name="city"
											label="City"
											defaultValue={speaker.city}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-5">
										<TextField
											required
											name="neighborhood"
											label="Neighborhood"
											defaultValue={speaker.neighborhood}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-5">
										<TextField
											required
											name="cep"
											label="CEP/ZIP"
											defaultValue={speaker.cep}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-2">
										<TextField
											required={!foreignFlag}
											name="ddd"
											label="DDD"
											defaultValue={speaker.ddd}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-12">
										<TextField
											required
											name="address"
											label="Address"
											defaultValue={speaker.address}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required={!foreignFlag}
											name="id_number"
											label="ID Number"
											style={styles.textField}
											defaultValue={speaker.id_number}
											type="number"
											margin="normal"
											variant="outlined"
											// onKeyUp={(e)=>{this.numberChange(e)}}
											onKeyUp={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required
											name="document_issue_date"
											label="Document Issue Date"
											type="date"
											value={speaker.document_issue_date ? speaker.document_issue_date : getCurrentDate()}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
											onChange={(event) =>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required={!foreignFlag}
											name="emitting_organ"
											label="emitting organ"
											style={styles.textField}
											defaultValue={speaker.emitting_organ}
											type="text"
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="email"
											label="Email"
											style={styles.textField}
											defaultValue={speaker.email}
											type="email"
											autoComplete="email"
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											label="Mobile"
											style={styles.textField}
											defaultValue={speaker.mobile}
											type="number"
											name="mobile"
											margin="normal"
											variant="outlined"
											// onKeyUp={(e)=>{this.numberChange(e)}}
											onKeyUp={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											name="fax"
											label="FAX"
											style={styles.textField}
											defaultValue={speaker.fax}
											type="number"
											margin="normal"
											variant="outlined"
											// onKeyUp={(e)=>{this.numberChange(e)}}
											onKeyUp={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											name="linkedin"
											label="LinkedIn URL"
											style={styles.textField}
											defaultValue={speaker.linkedin}
											type="text"
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											name="lattes"
											label="Lattes URL"
											style={styles.textField}
											defaultValue={speaker.lattes}
											type="text"
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											name="orcid"
											label="ORCID Link"
											style={styles.textField}
											defaultValue={speaker.orcid}
											type="text"
											margin="normal"
											variant="outlined"
											onBlur={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4 mt-4">
										<Checkbox
											name="registration_in_city"
											checked={speaker.registration_in_city}
											onChange={(event)=>{this.handleChange(event)}}
											inputProps={{
											'aria-label': 'primary checkbox',
											}}
										/>
										<strong>Registration in City</strong>
									</div>
									<div className="col-md-4 mt-4">
										<Checkbox
											name="social_security"
											checked={speaker.social_security}
											onChange={(event)=>{this.handleChange(event)}}
											inputProps={{
											'aria-label': 'primary checkbox',
											}}
										/>
										<strong>Social Security Contributor</strong>
									</div>
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="primary" style={styles.button} onClick={()=>{this.handleTabChange(1)}}>
											Next
											{/* This Button uses a Font Icon, see the installation instructions in the docs. */}
											<Icon style={styles.leftIcon}>send</Icon>
										</Button>
									</div>
								</>}
								{currentTab === 1 && <>
										<div className="col-md-6 text-center">
										<Radio checked={person_type==="physical"} onClick={()=>{speaker['person_type']="physical"; this.setState({speaker})}}/><strong>Physical Person Data</strong>
											<div style={{opacity: person_type!=="physical" && "0.5"}}>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="National ID"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="CPF (Brazilian only)"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<InputGroup className="pt-4 ml-2">
													<InputGroup.Prepend>
														<InputGroup.Text>UF - CRM</InputGroup.Text>
													</InputGroup.Prepend>
													<DropdownButton
														disabled={person_type !== "physical"}
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
													<FormControl aria-describedby="basic-addon1" disabled={person_type !== "physical"}/>
												</InputGroup>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-country"
													select
													label="Specialty"
													style={styles.textField}
													value={speaker.currency}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													SelectProps={{
														native: true,
														MenuProps: {
															style: styles.menu
														}
													}}
													// helperText="Please select your currency"
													margin="normal"
													variant="outlined"
													>
													{countries.map(option => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</TextField>
											
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="Account Owner"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-country"
													select
													label="Bank Name"
													style={styles.textField}
													value={speaker.currency}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													SelectProps={{
														native: true,
														MenuProps: {
															style: styles.menu
														}
													}}
													// helperText="Please select your currency"
													margin="normal"
													variant="outlined"
													>
													{countries.map(option => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</TextField>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="Bank Address"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="Swift / BIC"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="IBAN / Account"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "physical"}
													id="outlined-name"
													label="Agency"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
											</div>
										</div>
										<div className="col-md-6 text-center">
										<Radio checked={person_type==="juridcal"} onClick={()=>{speaker['person_type']="juridcal"; this.setState({speaker})}}/><strong>Juridical Person Data</strong>
											<div style={{opacity: person_type!=="juridcal" && "0.5"}}>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="Company Name"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="CNPJ (Brazilian only)"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<InputGroup className="pt-4 ml-2">
													<InputGroup.Prepend>
														<InputGroup.Text>UF / City</InputGroup.Text>
													</InputGroup.Prepend>
													<DropdownButton
														disabled={person_type !== "juridcal"}
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
													<FormControl aria-describedby="basic-addon1" disabled={person_type !== "juridcal"}/>
												</InputGroup>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="Address"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="Account Owner"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-country"
													select
													label="Bank Name"
													style={styles.textField}
													value={speaker.currency}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													SelectProps={{
														native: true,
														MenuProps: {
															style: styles.menu
														}
													}}
													// helperText="Please select your currency"
													margin="normal"
													variant="outlined"
												>
												{countries.map(option => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</TextField>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="Bank Address"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="Swift / BIC"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="IBAN / Account"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													id="outlined-name"
													label="Agency"
													style={styles.textField}
													value={speaker.name}
													onChange={(event)=>{this.handleChange('foreignFlag', null, event)}}
													margin="normal"
													variant="outlined"
												/>
											</div>
										</div>
										<div className="col-md-12 text-right pt-4">
											<Button variant="contained" color="default" style={styles.button} style={{float:'left'}} onClick={()=>{this.handleTabChange(0)}}>
												<ChevronLeft style={styles.rightIcon} />
												Back
											</Button>
											<Button variant="contained" color="default" style={styles.button}>
												Cancel
												{/* <DeleteIcon style={styles.rightIcon} /> */}
											</Button>
											<Button variant="contained" color="primary" style={styles.button} onClick={()=>{this.handleSubmit()}}>
												Submit
												{/* This Button uses a Font Icon, see the installation instructions in the docs. */}
												<Icon style={styles.rightIcon}>send</Icon>
											</Button>
										</div>
								</>}
							</Grid>
							</form>
							</TabContainer>
					</div>
					
	)};
}

export default SpeakerRegistrationForm;

const civilStatus = [
	{
		value: "Single",
		label: "Single"
	},
	{
		value: "Married",
		label: "Married"
	},
	{
		value: "Widowed",
		label: "Widowed"
	},
	{
		value: "Separated",
		label: "Separated"
	},
	{
		value: "Divorced",
		label: "Divorced"
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

const styles = {
	container: {
		display: "flex",
		flexWrap: "wrap"
	},
	textField: {
		marginLeft: "0.25rem",
		marginRight: "0.25rem"
	},
	menu: {
		width: 200
	},
	rightIcon: {
		marginLeft: "0.5rem",
	},
	leftIcon: {
		marginLeft: "0.5rem",
	},
	button: {
		margin: "0.25rem"
	},
	root: {
		flexGrow: 1,
	},
};
