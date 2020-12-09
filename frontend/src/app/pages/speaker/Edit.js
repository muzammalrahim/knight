import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, Checkbox, Radio, Grid, Typography, Snackbar } from "@material-ui/core";
import { Dropdown, FormControl, InputGroup, DropdownButton } from "react-bootstrap";
import PropTypes from 'prop-types';
import {ChevronLeft} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
import list, {put} from '../helper/api';
import { Alert, AlertTitle } from '@material-ui/lab';

class SpeakerEditForm extends React.Component{
	constructor(props){
		super(props);
		this.speaker={ id: this.props.match.params.id, name: "", father_name: "",	
			mother_name:"",	dob:"", birthplace:"", civil_state:"", scholarity: "", social_number: "", service_provider: "", 
			country: "Select Counrty ...", state: "", city: "", neighborhood: "", cep: "", ddd: "", address:"", id_number: "", 
			document_issue_date: "", emitting_organ: "", email: "", mobile: "", fax: "", linkedin: "", lattes: "", orcid: "", 
			person_type:""
		}
		this.validateSpeaker={ foreignFlag: false,	accept_info: false,	name: false, father_name: false,	
			mother_name:false,	dob:false, birthplace:false, civil_state:false, scholarity: false, social_number: false, service_provider: false, 
			country: false, state: false, city: false, neighborhood: false, cep: false, ddd: false, address:false, id_number: false, 
			document_issue_date: false, emitting_organ: false, email: false, mobile: false, fax: false, linkedin: false, lattes: false, orcid: false, 
			registration_in_city: false, social_security: false, person_type:false
		}
        this.alert={
            open: false, 
            severity: '',
            message:'',
            title:''
        }
		this.state={
			speaker: this.speaker,
			validateSpeaker: this.validateSpeaker,
			alert: this.alert,
			currentTab: 0,
			onlyNums:'',
			countries:[{value:'Select country ....', label:'Select country ....'}]
		}
	}

	handleChange(event){
		let [key, value, {speaker, validateSpeaker}] = [event.target.name, event.target.value, this.state];
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
		if(validateSpeaker[key]){
			validateSpeaker[key] = speaker[key] ? false : true;
        }
        this.setState({speaker, validateSpeaker});
	}

	handleTabChange(currentTab) {
		this.setState({currentTab});
	}
	handleSubmit(){
		let {speaker, validateSpeaker} = this.state;
        let isSubmit = null;
		Object.keys(validateSpeaker).map((key)=>{
			validateSpeaker[key] = speaker[key] ? false : true;
        })
        this.setState({validateSpeaker});
		isSubmit && put(`api/speaker/${speaker.id}`, speaker).then((response)=>{
				this.setState({alert:{open:true, severity:"success", title:"success", message:'User has been updated Sucessfully'}})
				setTimeout(()=>{
					this.props.history.push('/speakers')
				}, 1000)
				}).catch((error)=>{
					Object.keys(error.response.data).map((key)=>{
						this.setState({alert:{open:true, severity:"error", title:"Error", message:`${key+": "+error.response.data[key][0]}`}})
					})
				})
	}
	getSpeaker(){
		let {speaker} = this.state;
		list(`api/speaker/${speaker.id}`).then((response)=>{
			this.setState({speaker: response.data})
		})
	}
	componentDidMount(){
		this.getSpeaker();
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
		let {speaker:{foreignFlag, accept_info, person_type}, speaker, currentTab, countries, validateSpeaker, alert:{severity, message, title, open}} = this.state;

		return (
			<div style={styles.root}>
				<Snackbar open={open} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'right' }} onClose={()=>{this.handleClose()}}>
					<Alert onClose={()=>{this.handleClose()}} severity={severity}>
						<AlertTitle>{title}</AlertTitle>
						<strong>{message}</strong>
					</Alert>
				</Snackbar>
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
										<strong> {<FormattedMessage id="Speaker.Registration.Form.F_Flag"/>}</strong>
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
										<strong>{<FormattedMessage id="Speaker.Registration.Form.Accept_Info"/>}</strong>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="name"
											label={<FormattedMessage id="Speaker.Registration.Form.F_Name"/>}
											style={styles.textField}
											value={speaker.name}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['name']}
											helperText={validateSpeaker['name'] && 'this field is required'}
										/>
									</div>
									
									<div className="col-md-6">
										<TextField
											name="father_name"
											label={<FormattedMessage id="Speaker.Registration.Form.Fath_Name"/>}
											required={!foreignFlag}
											style={styles.textField}
											value={speaker.father_name}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['father_name']}
											helperText={validateSpeaker['father_name'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required={!foreignFlag}
											name="mother_name"
											label={<FormattedMessage id="Speaker.Registration.Form.moth_name"/>}
											style={styles.textField}
											value={speaker.mother_name}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['mother_name']}
											helperText={validateSpeaker['mother_name'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="dob"
											label={<FormattedMessage id="Speaker.Registration.Form.Birthday"/>}
											type="date"
											value={speaker.dob ? speaker.dob : getCurrentDate()}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
											onChange={(event) =>{this.handleChange(event)}}
											error={validateSpeaker['dob']}
											helperText={validateSpeaker['dob'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="birthplace"
											label={<FormattedMessage id="Speaker.Registration.Form.Birth_p"/>}
											style={styles.textField}
											value={speaker.birthplace}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['birthplace']}
											helperText={validateSpeaker['birthplace'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											name="civil_state"
											select
											label={<FormattedMessage id="Speaker.Registration.Form.Civil_state"/>}
											style={styles.textField}
											value={speaker.civil_state}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											error={validateSpeaker['civil_state']}
											helperText={validateSpeaker['civil_state'] && 'this field is required'}
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
											label={<FormattedMessage id="Speaker.Registration.Form.Scholarity"/>}
											style={styles.textField}
											value={speaker.scholarity}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['scholarity']}
											helperText={validateSpeaker['scholarity'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required={!foreignFlag}
											name="social_number"
											label={<FormattedMessage id="Speaker.Registration.Form.Social_No"/>}
											style={styles.textField}
											value={speaker.social_number}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['social_number']}
											helperText={validateSpeaker['social_number'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-3">
									<TextField
											required
											name="service_provider"
											label={<FormattedMessage id="Speaker.Registration.Form.Service_prov"/>}
											style={styles.textField}
											value={speaker.service_provider}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['service_provider']}
											helperText={validateSpeaker['service_provider'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required
											select
											name="country"
											label={<FormattedMessage id="Speaker.Registration.Form.Country"/>}
											style={styles.textField}
											value={speaker.country}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											error={validateSpeaker['country']}
											helperText={validateSpeaker['country'] && 'this field is required'}
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
											label={<FormattedMessage id="Speaker.Registration.Form.state_OR_province"/>}
											value={speaker.state}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['state']}
											helperText={validateSpeaker['state'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required
											name="city"
											label={<FormattedMessage id="Speaker.Registration.Form.City"/>}
											value={speaker.city}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['city']}
											helperText={validateSpeaker['city'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-5">
										<TextField
											required
											name="neighborhood"
											label={<FormattedMessage id="Speaker.Registration.Form.Neighborhood"/>}
											value={speaker.neighborhood}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['neighborhood']}
											helperText={validateSpeaker['neighborhood'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-5">
										<TextField
											required
											name="cep"
											label={<FormattedMessage id="Speaker.Registration.Form.Cep_OR_Zip"/>}
											value={speaker.cep}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['cep']}
											helperText={validateSpeaker['cep'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-2">
										<TextField
											required={!foreignFlag}
											name="ddd"
											label={<FormattedMessage id="Speaker.Registration.Form.DDD"/>}
											value={speaker.ddd}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={!foreignFlag && validateSpeaker['cep']}
											helperText={!foreignFlag && validateSpeaker['cep'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-12">
										<TextField
											required
											name="address"
											label={<FormattedMessage id="Speaker.Registration.Form.Address"/>}
											value={speaker.address}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['address']}
											helperText={validateSpeaker['address'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required={!foreignFlag}
											name="id_number"
											label={<FormattedMessage id="Speaker.Registration.Form.Id_No"/>}
											style={styles.textField}
											value={speaker.id_number}
											type="number"
											margin="normal"
											variant="outlined"
											error={validateSpeaker['id_number']}
											helperText={validateSpeaker['id_number'] && 'this field is required'}
											onKeyUp={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required
											name="document_issue_date"
											label={<FormattedMessage id="Speaker.Registration.Form.Document_issue_Date"/>}
											type="date"
											value={speaker.document_issue_date ? speaker.document_issue_date : getCurrentDate()}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
											onChange={(event) =>{this.handleChange(event)}}
											error={validateSpeaker['document_issue_date']}
											helperText={validateSpeaker['document_issue_date'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											required={!foreignFlag}
											name="emitting_organ"
											label={<FormattedMessage id="Speaker.Registration.Form.Emitting_Organ"/>}
											style={styles.textField}
											value={speaker.emitting_organ}
											type="text"
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['emitting_organ']}
											helperText={validateSpeaker['emitting_organ'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="email"
											label={<FormattedMessage id="Speaker.Registration.Form.Email"/>}
											style={styles.textField}
											value={speaker.email}
											type="email"
											autoComplete="email"
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={validateSpeaker['email']}
											helperText={validateSpeaker['email'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											required
											label={<FormattedMessage id="Speaker.Registration.Form.Mobile"/>}
											style={styles.textField}
											value={speaker.mobile}
											type="number"
											name="mobile"
											margin="normal"
											variant="outlined"
											error={validateSpeaker['mobile']}
											helperText={validateSpeaker['mobile'] && 'this field is required'}
											onKeyUp={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-3">
										<TextField
											name="fax"
											label={<FormattedMessage id="Speaker.Registration.Form.Fax"/>}
											style={styles.textField}
											value={speaker.fax}
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
											label={<FormattedMessage id="Speaker.Registration.Form.Linkedin_Url"/>}
											style={styles.textField}
											value={speaker.linkedin}
											type="text"
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											name="lattes"
											label={<FormattedMessage id="Speaker.Registration.Form.Latter_Url"/>}
											style={styles.textField}
											value={speaker.lattes}
											type="text"
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
										/>
									</div>
									<div className="col-md-4">
										<TextField
											name="orcid"
											label={<FormattedMessage id="Speaker.Registration.Form.Orcid_Url"/>}
											style={styles.textField}
											value={speaker.orcid}
											type="text"
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
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
						<strong> {<FormattedMessage id="Speaker.Registration.Form.Reg_City"/>}</strong>
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
										<strong> {<FormattedMessage id="Speaker.Registration.Form.Social_sec"/>} </strong>
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

export default SpeakerEditForm;

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

