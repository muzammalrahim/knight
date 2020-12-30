import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, Checkbox, Grid, Typography, Snackbar } from "@material-ui/core";
import { Dropdown, FormControl, InputGroup, DropdownButton, FormText } from "react-bootstrap";
import PropTypes from 'prop-types';
import {ChevronLeft} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
import list, {put} from '../helper/api';
import { Alert, AlertTitle } from '@material-ui/lab';
import {defineMessages, injectIntl, intlShape} from 'react-intl';


const civilStatus = defineMessages({
    one: {
        id: 'Speaker.Registration.CivilStatus.One',
        defaultMessage: 'Single',
    },
    two: {
        id: 'Speaker.Registration.CivilStatus.Two',
        defaultMessage: 'Married',
    },
    three: {
        id: 'Speaker.Registration.CivilStatus.Three',
        defaultMessage: 'Widowed',
    },
    four: {
        id: 'Speaker.Registration.CivilStatus.Four',
        defaultMessage: 'Separated',
    },
    five: {
        id: 'Speaker.Registration.CivilStatus.Five',
        defaultMessage: 'Divorced',
    }
});

class SpeakerEditForm extends React.Component{
	constructor(props){
		super(props);
		this.speaker={
			id:this.props.match.params.id, name: "", accept_information_rule: true, father_name: "", mother_name:"", dob:"", birthplace:"", civil_state:"", 
			scholarity: "", social_number: "", service_provider: "", country: "Brasil", state: "", city: "", neighborhood: "",
			cep: "", ddd: "", address:"", id_number: "", document_issue_date: "", emitting_organ: "", email: "", mobile: "", fax: null, 
			linkedin: "", lattes: "", orcid: "", juridcal_person:false, national_id:"", company_name:"", cpf:"", cnpj:"", uf_crm:"", uf_city:"", 
			specialty:"", tier:"", juridical_address:"",	account_owner: "", bank_name: "", bank_address: "", swift_bic: "", iban_account: "", agency: ""
		}
		this.validateSpeaker={ 
			foreign_flag: false,	accept_information_rule: false,	name: false, father_name: false,	
			mother_name: false,	dob: false, birthplace: false, civil_state: false, scholarity: false, social_number: false, service_provider: false, 
			country: false, state: false, city: false, neighborhood: false, cep: false, ddd: false, address: false, id_number: false, 
			document_issue_date: false, emitting_organ: false, email: false, mobile: false, fax: false, linkedin: false, lattes: false, orcid: false, 
			registration_in_city: false, social_security: false, juridcal_person: false, national_id: false, company_name: false, cpf: false, cnpj: false,
			uf_crm: false, uf_city: false, specialty: false, tier: false, juridical_address:false, account_owner: false, bank_name: false, bank_address: false, 
			swift_bic: false, iban_account: false, agency: false
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
			countries:[{value:'Select country ....', label:'Select country ....'}],
			specialty_list:[]
		}
		this.handleTabChange = this.handleTabChange.bind(this);
	}

	handleChange(event){
		let [key, value, {speaker, validateSpeaker}] = [event.target.name, event.target.value, this.state];
		// if(speaker['juridcal_person'] === "juridcal"){
		// 	validateSpeaker['national_id'] = false;
		// 	validateSpeaker['cpf'] = false;
		// 	validateSpeaker['uf_crm'] = false;
		// 	validateSpeaker['specialty'] = false;

		// 	speaker['national_id'] = "";
		// 	speaker['cpf'] = "";
		// 	speaker['uf_crm'] = "";
		// 	speaker['specialty'] = "";

		// }else 
		if (speaker['juridcal_person'] === false){
			validateSpeaker['company_name'] = false;
			validateSpeaker['cnpj'] = false;
			validateSpeaker['uf_city'] = false;
			validateSpeaker['juridical_address'] = false;

			speaker['company_name'] = "";
			speaker['cnpj'] = "";
			speaker['uf_city'] = "";
			speaker['juridical_address'] = "";
		}
		if(key==="foreign_flag" || key==="registration_in_city" || key==="social_security" || key == "juridcal_person"){
			speaker[key]=!(speaker[key]);
			validateSpeaker[key] = false;

		}
		else if(key==="id_number" || key==="fax" || key==="mobile"){
			if(event.keyCode !== 107 && event.keyCode !== 109 && event.keyCode !== 187 && event.keyCode !== 189){
				speaker[key]=value;
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

	handleTabChange(event, currentTab) {
		this.setState({currentTab});
	}
	handleSubmit(){
		let {speaker, validateSpeaker} = this.state;
		let isSubmit = null;
		
		Object.keys(validateSpeaker).map((key)=>{
			// if(speaker['juridcal_person'] === true && (key === "national_id" || key === "cpf" || key === "uf_crm" || key === "specialty" )){
			// 	validateSpeaker[key] = false;
			// }else 
			if(speaker['juridcal_person'] === false && (key === "company_name" || key === "cnpj" || key === "uf_city" || key === "juridical_address" )){
				validateSpeaker[key] = false;
			}
			//Skip Optional Fields form Validation
			else if(key === "lattes" || key === "linkedin" || key === "ddd" || key === "fax" || key === "orcid" || key === "juridcal_person"){
				validateSpeaker[key] = false;
			}
			else if(key==="foreign_flag" || key==="registration_in_city" || key==="social_security"){
				validateSpeaker[key] = false;
	
			}
			else{
				validateSpeaker[key] = speaker[key] ? false : true;
				isSubmit = speaker[key] && isSubmit !== false ? true : false;
			}
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
			this.setState({speaker: response.data, show:true})
		})
	}

	componentDidMount(){
		this.getSpeaker();
		fetch('https://restcountries.eu/rest/v2/all')
		.then(response => response.json())
		.then((data) => {
			let list_data = []
			data.map((country)=>{	
				if(country.name === "Brazil"){
					list_data.push({label:"Brasil", value: "Brasil"})
				}else{
					list_data.push({label:country.name, value: country.name})
				}
			})
			this.setState({countries:list_data})
		});
		list('api/specialty').then((response)=>{
			let data = [];
			response.data.map((option)=>{
				data.push({label:option.name, value:option.id})
			})
			this.setState({specialty_list: data})
		})
	}
    handleClose(){
        this.setState({alert:{open:false, severity: '', message:'' }})
    }
	render(){
		let {speaker:{foreign_flag, accept_information_rule, juridcal_person}, speaker, currentTab, countries, 
			validateSpeaker, alert:{severity, message, title, open}, specialty_list} = this.state;
		const {formatMessage} = this.props.intl;
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
							<Tabs value={currentTab} onChange={this.handleTabChange}>
								<Tab label="Step One"/>
								<Tab label="Step Two"/>
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
											name="foreign_flag"
											checked={foreign_flag ? true : false}
											onChange={(event)=>{this.handleChange(event)}}
											inputProps={{
											'aria-label': 'primary checkbox',
											}}
										/>
										<strong> {<FormattedMessage id="Speaker.Registration.Form.F_Flag"/>}</strong>
									</div>
									<div className="col-md-9">
										<Checkbox
											checked={accept_information_rule ? true : false}
											name="accept_information_rule"
											onChange={(event)=>{this.handleChange(event)}}
											value={accept_information_rule}
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
											required={!foreign_flag}
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
											required={!foreign_flag}
											name="mother_name"
											label={<FormattedMessage id="Speaker.Registration.Form.Moth_Name"/>}
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
										{/* <option value={null}>
											Select Civil State....
										</option> */}
										{/* <option value="value1">{formatMessage(messages.firstoption)}</option> */}
											{Object.keys(civilStatus).map((key, index) => {
												return <option key={index} value={civilStatus[key].defaultMessage}>
													{formatMessage(civilStatus[key])}
												</option>
											})}
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
											required={!foreign_flag}
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
									<div className="col-md-6">
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
									<div className="col-md-6">
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
											required={!foreign_flag}
											name="id_number"
											label={<FormattedMessage id="Speaker.Registration.Form.Id_No"/>}
											style={styles.textField}
											value={speaker.id_number}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['id_number']}
											helperText={validateSpeaker['id_number'] && 'this field is required'}
											onKeyUp={(event)=>{this.handleChange(event)}}
											onChange={(event)=>{this.handleChange(event)}}
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
											required={!foreign_flag}
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
											required={!foreign_flag}
											name="ddd"
											label={<FormattedMessage id="Speaker.Registration.Form.DDD"/>}
											value={speaker.ddd}
											style={styles.textField}
											margin="normal"
											variant="outlined"
											onChange={(event)=>{this.handleChange(event)}}
											error={!foreign_flag && validateSpeaker['cep']}
											helperText={!foreign_flag && validateSpeaker['cep'] && 'this field is required'}
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
									<div className="col-md-6">
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
									<div className="col-md-6">
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
									<div className="col-md-6">
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
									<div className="col-md-6">
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
											checked={speaker.registration_in_city ? true : false}
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
											checked={speaker.social_security ? true : false}
											onChange={(event)=>{this.handleChange(event)}}
											inputProps={{
											'aria-label': 'primary checkbox',
											}}
										/>
										<strong> {<FormattedMessage id="Speaker.Registration.Form.Social_sec"/>} </strong>
									</div>
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="primary" style={styles.button} onClick={(e)=>{this.handleTabChange(e,1)}}>
											Next
											{/* This Button uses a Font Icon, see the installation instructions in the docs. */}
											<Icon style={styles.leftIcon}>send</Icon>
										</Button>
									</div>
								</>}
								{currentTab === 1 && <>
									<div className="col-md-12 text-center">
										<Checkbox 
											name="juridcal_person" 
											value={juridcal_person}
											checked={juridcal_person ? true : false} 
											onClick={(event)=>{this.handleChange(event)}}
										/><strong>Juridical Person Data</strong>
									</div>
									<div className="col-md-6 text-center">
										<TextField
											name="national_id"
											label="National ID"
											style={styles.textField}
											value={speaker.national_id ? speaker.national_id : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['national_id']}
											helperText={validateSpeaker['national_id'] && 'this field is required'}
										/> 
										<TextField
											name="cpf"
											label="CPF (Brazilian only)"
											style={styles.textField}
											value={speaker.national_id ? speaker.cpf : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['cpf']}
											helperText={validateSpeaker['cpf'] && 'this field is required'}
										/>
										<>
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
												<FormControl 
													name="uf_crm"
													aria-describedby="basic-addon1" 
													value={speaker.national_id ? speaker.uf_crm : ''}
													onChange={(event)=>{this.handleChange(event)}}
												/>
											</InputGroup> 
											{validateSpeaker['uf_crm'] && <FormText className="text-danger">this field is required</FormText>}
										</>
										<TextField
											name="specialty"
											select
											label="specialty"
											style={styles.textField}
											value={speaker.national_id ? speaker.specialty : ''}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											error={validateSpeaker['specialty']}
											helperText={validateSpeaker['specialty'] && 'this field is required'}
											margin="normal"
											variant="outlined"
											>
											<option value={null}>
												Select Specialty....
											</option>
											{specialty_list.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField> 
										<TextField
											name="tier"
											select
											label="tier"
											style={styles.textField}
											value={speaker.national_id ? speaker.tier : ''}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											error={validateSpeaker['tier']}
											helperText={validateSpeaker['tier'] && 'this field is required'}
											margin="normal"
											variant="outlined"
											>
											<option value={null}>
												Select Tier....
											</option>
											{tier.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField> 
									</div>
									<div className="col-md-6 text-center">
										<div style={{opacity: !juridcal_person && "0.5"}}>
												<TextField
													disabled={!juridcal_person}
													name="company_name"
													label="Company Name"
													style={styles.textField}
													value={juridcal_person ? speaker.company_name : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['company_name']}
													helperText={validateSpeaker['company_name'] && 'this field is required'}
												/>
												<TextField
													disabled={!juridcal_person}
													name="cnpj"
													label="CNPJ (Brazilian only)"
													style={styles.textField}
													value={juridcal_person ? speaker.cnpj : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['cnpj']}
													helperText={validateSpeaker['cnpj'] && 'this field is required'}
												/>
												<>
													<InputGroup className="pt-4 ml-2">
													<InputGroup.Prepend>
														<InputGroup.Text>UF / City</InputGroup.Text>
													</InputGroup.Prepend>
													<DropdownButton
														disabled={!juridcal_person}
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
													<FormControl 
														name="uf_city"
														aria-describedby="basic-addon1" 
														disabled={!juridcal_person}
														value={juridcal_person ? speaker.uf_city : ''}
														onChange={(event)=>{this.handleChange(event)}}/>
												</InputGroup>
												{validateSpeaker['uf_city'] && <FormText className="text-danger">this field is required</FormText>}</>
												
												<TextField
													disabled={!juridcal_person}
													name="juridical_address"
													label="Address"
													style={styles.textField}
													value={juridcal_person ? speaker.juridical_address : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['juridical_address']}
													helperText={validateSpeaker['juridical_address'] && 'this field is required'}
												/>
												{/* <TextField
													disabled={person_type !== "juridcal"}
													name="account_owner"
													label="Account Owner"
													style={styles.textField}
													value={person_type === "juridcal" ? speaker.account_owner :''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['account_owner']}
													helperText={validateSpeaker['account_owner'] && 'this field is required'}
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													name="bank_name"
													select
													label="Bank Name"
													style={styles.textField}
													value={person_type === "juridcal" ? speaker.bank_name : ''}
													onChange={(event)=>{this.handleChange(event)}}
													SelectProps={{
														native: true,
														MenuProps: {
															style: styles.menu
														}
													}}
													error={validateSpeaker['bank_name']}
													helperText={validateSpeaker['bank_name'] && 'this field is required'}
													margin="normal"
													variant="outlined"
													>
													<option value={null}>
														Select Bank Name....
													</option>
													{countries.map(option => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</TextField>
												<TextField
													disabled={person_type !== "juridcal"}
													name="bank_address"
													label="Bank Address"
													style={styles.textField}
													value={person_type === "juridcal" ? speaker.bank_address : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['bank_address']}
													helperText={validateSpeaker['bank_address'] && 'this field is required'}
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													name="swift_bic"
													label="Swift / BIC"
													style={styles.textField}
													value={person_type === "juridcal" ? speaker.swift_bic : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['swift_bic']}
													helperText={validateSpeaker['swift_bic'] && 'this field is required'}
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													name="iban_account"
													label="IBAN / Account"
													style={styles.textField}
													value={person_type === "juridcal" ? speaker.iban_account : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['iban_account']}
													helperText={validateSpeaker['iban_account'] && 'this field is required'}
												/>
												<TextField
													disabled={person_type !== "juridcal"}
													name="agency"
													label="Agency"
													style={styles.textField}
													value={person_type === "juridcal" ? speaker.agency : ''}
													onChange={(event)=>{this.handleChange(event)}}
													margin="normal"
													variant="outlined"
													error={validateSpeaker['agency']}
													helperText={validateSpeaker['agency'] && 'this field is required'}
												/> */}
											</div>
										</div>
									<div className="col-md-6">
										<TextField
											name="account_owner"
											label="Account Owner"
											style={styles.textField}
											value={speaker.national_id ? speaker.account_owner : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['account_owner']}
											helperText={validateSpeaker['account_owner'] && 'this field is required'}
										/>
									</div>	
									<div className="col-md-6">
										<TextField
											name="bank_name"
											select
											label="Bank Name"
											style={styles.textField}
											value={speaker.national_id ? speaker.bank_name : ''}
											onChange={(event)=>{this.handleChange(event)}}
											SelectProps={{
												native: true,
												MenuProps: {
													style: styles.menu
												}
											}}
											error={validateSpeaker['bank_name']}
											helperText={validateSpeaker['bank_name'] && 'this field is required'}
											margin="normal"
											variant="outlined"
											>
											<option value={null}>
												Select Bank Name....
											</option>
											{countries.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>	
									<div className="col-md-6">
										<TextField
											name="bank_address"
											label="Bank Address"
											style={styles.textField}
											value={speaker.national_id ? speaker.bank_address : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['bank_address']}
											helperText={validateSpeaker['bank_address'] && 'this field is required'}
										/>
									</div>	
									<div className="col-md-6">
										<TextField
											name="swift_bic"
											label="Swift / BIC"
											style={styles.textField}
											value={speaker.national_id ? speaker.swift_bic : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['swift_bic']}
											helperText={validateSpeaker['swift_bic'] && 'this field is required'}
										/>
										
									</div>	
									<div className="col-md-6">
										<TextField
											name="iban_account"
											label="IBAN / Account"
											style={styles.textField}
											value={speaker.national_id ? speaker.iban_account : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['iban_account']}
											helperText={validateSpeaker['iban_account'] && 'this field is required'}
										/>
									</div>	
									<div className="col-md-6">
										<TextField
											name="agency"
											label="Agency"
											style={styles.textField}
											value={speaker.national_id ? speaker.agency : ''}
											onChange={(event)=>{this.handleChange(event)}}
											margin="normal"
											variant="outlined"
											error={validateSpeaker['agency']}
											helperText={validateSpeaker['agency'] && 'this field is required'}
										/>
									</div>	
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="default" style={styles.button} style={{float:'left'}} onClick={(e)=>{this.handleTabChange(e,0)}}>
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

export default injectIntl(SpeakerEditForm)

const tier = [
	{
		value: "1",
		label: "Tier 1"
	},
	{
		value: "2",
		label: "Tier 2"
	},
	{
		value: "3",
		label: "Tier 3"
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

