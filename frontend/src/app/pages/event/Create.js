import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Snackbar } from "@material-ui/core";
import PropTypes from 'prop-types';
import {ChevronLeft} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
  import list, {post} from '../helper/api';
  import { Alert, AlertTitle } from '@material-ui/lab';

class EventRegistrationForm extends React.Component {
	constructor(props){
		super(props);
		this.event={
			name:"", _type:"", date:"", duration:"", web_presential:"", country:"",	state:"",
			city:"", address:"", solicitant:"", business_unit:"", despartment:"", cost_center:"",
			speaker:"", virtual_presential:"", displacement:''
		}
		this.validateEvent={
			name:false, _type:false, date:false, duration:false, web_presential:false, country:false,	state:false,
			city:false, address:false, solicitant:false, business_unit:false, despartment:false, cost_center:false,
			speaker:false, virtual_presential:false, displacement:false
		}
		this.alert={
            open: false, 
            severity: '',
            message:'',
            title:''
        }
		this.state={
			event: this.event,
			validateEvent: this.validateEvent,
			alert: this.alert,
			currentTab: 0,
			speaker_list:[],
			countries:[]
		}
	}

	handleChange(e){
		let [key, value, {event, validateEvent}] = [e.target.name, e.target.value, this.state];
		event[key]=value;
		if(validateEvent[key]){
			if(key === "web_presential" && value==="web"){
				validateEvent["country"] = false;
				validateEvent["state"] = false;
				validateEvent["cit"] = false;
				validateEvent["address"] = false;

				event["country"] = "";
				event["state"] = "";
				event["cit"] = "";
				event["address"] = "";
			}else{
            	validateEvent[key] = event[key] ? false : true;
			}
        }
        this.setState({event, validateEvent});
	}

	handleTabChange(value) {
		this.setState({currentTab:value});
	}
	submitHandler(){
		let {event, validateEvent} = this.state;
		let isSubmit = null;
		Object.keys(validateEvent).map((key)=>{
			if(event["web_presential"]!=="Presential" && (key === "country" || key === "state" || key ==="city" || key === "address")){
				validateEvent[key] = false;
			}else{
				validateEvent[key] = event[key] ? false : true;
				isSubmit = event[key] && isSubmit !== false ? true : false;
			}
        })
        this.setState({validateEvent});
        isSubmit && post('api/events', event).then((response)=>{
                this.setState({alert:{open:true, severity:"success", title:"success", message:'User Created Sucessfully'}})
				setTimeout(()=>{this.props.history.push('/events')}, 1000)
			}).catch((error)=>{
				Object.keys(error.response.data).map((key)=>{
					this.setState({alert:{open:true, severity:"error", title:"Error", message:`${key+": "+error.response.data[key][0]}`}})
				})
			})
    }
	getSpeakers (){
		list('api/speakers').then((response)=>{
		  let speaker_list = [];
		  response.data.map((row)=>{
			  speaker_list.push({label:row.name, value:row.id})
		  })
		  this.setState({speaker_list});
		})
	}
	handleClose(){
        this.setState({alert:{open:false, severity: '', message:'' }})
    }   
	componentDidMount(){
		this.getSpeakers();
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
		let {event:{web_presential}, event, currentTab, speaker_list, countries, validateEvent, alert:{open, severity, message, title}} = this.state;
		return (
			<div className="row">
				<Snackbar open={open} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'right' }} onClose={()=>{this.handleClose()}}>
                    <Alert onClose={()=>{this.handleClose()}} severity={severity}>
                        <AlertTitle>{title}</AlertTitle>
                        <strong>{message}</strong>
                    </Alert>
                </Snackbar>
				<div style={styles.root}>
					<div className="col-md-12">
						<h3 className="card-label text-center pt-4 pb-2">
							<FormattedMessage id="Event.Create.Title"/>
						</h3>
						<AppBar position="static">
							<Tabs value={currentTab}>
								<Tab label="Step One" style={{cursor:'unset'}}/>
								<Tab label="Step Two" style={{cursor:'unset'}}/>
							</Tabs>
						</AppBar>
						<TabContainer>
							<form style={styles.container} noValidate autoComplete="off">
								{currentTab === 0 && <>
									<div className="col-md-6">
										<TextField
											required
											name="name"
											label={<FormattedMessage id="Event.Create.Eve_Name"/>}
											style={styles.textField}
											value={event.name}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
											error={validateEvent['name']}
                                    		helperText={validateEvent['name'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="_type"
											label={<FormattedMessage id="Event.Create.Type"/>}
											style={styles.textField}
											value={event._type}
											onChange={(e)=>{this.handleChange(e)}}
											SelectProps={{
												native: true,
												MenuProps: {
													className: styles.menu
												}
											}}
											error={validateEvent['_type']}
                                    		helperText={validateEvent['_type'] && 'this field is required'}
											margin="normal"
											variant="outlined"
											>
											<option value={null}>
												Select Type....
											</option>
											{type.map(option => (
												<option key={option.value} value={option.value}>
												{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="date"
											label={<FormattedMessage id="Event.Create.Date"/>}
											type="date"
											value={event.date ? event.date : getCurrentDate()}
											onChange={(e) =>{this.handleChange(e)}}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
											error={validateEvent['date']}
                                    		helperText={validateEvent['date'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="duration"
											label={<FormattedMessage id="Event.Create.Duration"/>}
											type="number"
											style={styles.textField}
											value={event.duration}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
											error={validateEvent['duration']}
                                    		helperText={validateEvent['duration'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="web_presential"
											label={<FormattedMessage id="Event.Create.Web_OR_pres"/>}
											style={styles.textField}
											value={event.web_presential}
											onChange={(e)=>{this.handleChange(e)}}
											SelectProps={{
												native: true,
												MenuProps: {
												className: styles.menu
												}
											}}
											// helperText="Please select your currency"
											margin="normal"
											variant="outlined"
											error={validateEvent['web_presential']}
                                    		helperText={validateEvent['web_presential'] && 'this field is required'}
											>
											<option value={null}>
												Select Web / Presential....
											</option>
											{web_presential_options.map(option => (
												<option key={option.value} value={option.value}>
												{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-6"/>
									{web_presential === "Presential" && <>
										<div className="col-md-6">
											<TextField
												required
												select
												name="country"
												label={<FormattedMessage id="Event.List.Column.Country"/>}
												style={styles.textField}
												value={event.country}
												onChange={(e)=>{this.handleChange(e)}}
												SelectProps={{
													native: true,
													MenuProps: {
													className: styles.menu
													}
												}}
												helperText="Please select your currency"
												margin="normal"
												variant="outlined"
												error={validateEvent['country']}
												helperText={validateEvent['country'] && 'this field is required'}
												>
												<option value={null}>
													Select Country....
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
												required
												select
												name="state"
												label={<FormattedMessage id="Speaker.Registration.Form.state_OR_province"/>}
												style={styles.textField}
												value={event.state}
												onChange={(e)=>{this.handleChange(e)}}
												SelectProps={{
													native: true,
													MenuProps: {
													className: styles.menu
													}
												}}
												error={validateEvent['state']}
												helperText={validateEvent['state'] && 'this field is required'}
												margin="normal"
												variant="outlined"
												>
												<option value={null}>
													Select State / Province....
												</option>
												{province.map(option => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</TextField>
										</div>
										<div className="col-md-6">
											<TextField
												required
												name="city"
												label={<FormattedMessage id="Speaker.Registration.Form.City"/>}
												value={event.city}
												style={styles.textField}
												onChange={(e)=>{this.handleChange(e)}}
												margin="normal"
												variant="outlined"
												error={validateEvent['city']}
												helperText={validateEvent['city'] && 'this field is required'}
											/>
										</div>
										<div className="col-md-6">
										<TextField
											required
											name="address"
											label={<FormattedMessage id="Speaker.Registration.Form.Address"/>}
											value={event.address}
											style={styles.textField}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
											error={validateEvent['address']}
											helperText={validateEvent['address'] && 'this field is required'}
										/>
									</div>
									</>}
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="primary" style={styles.button} onClick={()=>{this.handleTabChange(1)}}>
											Next
											{/* This Button uses a Font Icon, see the installation instructions in the docs. */}
											<Icon style={styles.rightIcon}>send</Icon>
										</Button>
									</div>
								</>}
								{currentTab === 1 && <>
									<div className="col-md-6 text-center">
										<TextField
											required
											name="solicitant"
											label={<FormattedMessage id="Event.List.Column.Solicitant"/>}
											style={styles.textField}
											value={event.solicitant}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
											error={validateEvent['solicitant']}
											helperText={validateEvent['solicitant'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="business_unit"
											label={<FormattedMessage id="User.Registration.Form.Business_Unit"/>}
											style={styles.textField}
											value={event.business_unit}
											onChange={(e)=>{this.handleChange(e)}}
											SelectProps={{
												native: true,
												MenuProps: {
													className: styles.menu
												}
											}}
											error={validateEvent['business_unit']}
											helperText={validateEvent['business_unit'] && 'this field is required'}
											margin="normal"
											variant="outlined"
										>	
											<option value={null}>
												Select Business Unit....
											</option>
											{b_unit.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="despartment"
											label={<FormattedMessage id="Event.List.Column.Department"/>}
											style={styles.textField}
											value={event.despartment}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
											error={validateEvent['despartment']}
											helperText={validateEvent['despartment'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="cost_center"
											label={<FormattedMessage id="Event.List.Column.Cost"/>}
											style={styles.textField}
											value={event.cost_center}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
											error={validateEvent['cost_center']}
											helperText={validateEvent['cost_center'] && 'this field is required'}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="speaker"
											label={<FormattedMessage id="Event.List.Column.Speaker"/>}
											style={styles.textField}
											value={event.speaker}
											onChange={(e)=>{this.handleChange(e)}}
											SelectProps={{
												native: true,
												MenuProps: {
													className: styles.menu
												}
											}}
											error={validateEvent['speaker']}
											helperText={validateEvent['speaker'] && 'this field is required'}
											margin="normal"
											variant="outlined"
										>
											<option value={null}>
												Select Speaker....
											</option>
											{speaker_list.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="virtual_presential"
											label={<FormattedMessage id="Event.List.Column.Virtual"/>}
											style={styles.textField}
											value={event.virtual_presential}
											onChange={(e)=>{this.handleChange(e)}}
											SelectProps={{
												native: true,
												MenuProps: {
													className: styles.menu
												}
											}}
											error={validateEvent['virtual_presential']}
											helperText={validateEvent['virtual_presential'] && 'this field is required'}
											margin="normal"
											variant="outlined"
										>	
											<option value={null}>
												Select Virtual / Presential....
											</option>
											{virtual_presential.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									{/* <div className="col-md-6">
										<TextField
											required
											select
											name="_duration"
											label="Duration"
											style={styles.textField}
											value={event._duration}
											onChange={(e)=>{this.handleChange(e)}}
											SelectProps={{
												native: true,
												MenuProps: {
													className: styles.menu
												}
											}}
											error={validateEvent['_duration']}
											helperText={validateEvent['_duration'] && 'this field is required'}
											margin="normal"
											variant="outlined"
										>
											<option value={null}>
												Select Duration....
											</option>
											{country.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div> */}
									<div className="col-md-12 pt-4 ml-4">
										<h5>Displacement</h5>
										<div className="col-md-12 pt-4 ml-4">
											<FormControl component="fieldset" style={styles.formControl}>
												<RadioGroup
													aria-label="Gender"
													name="displacement"
													style={styles.group}
													value={event.displacement}
													onChange={(e)=>{this.handleChange(e)}}
												>
													<FormControlLabel value="local" control={<Radio />} label="Local (at the same State)" />
													<FormControlLabel value="regional" control={<Radio />} label="Regional (at the same Country)" />
													<FormControlLabel value="international" control={<Radio />} label="International (at different Country)" />
												</RadioGroup>
											</FormControl>
										</div>
									</div>
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="default" style={styles.button} style={{float:'left'}} onClick={()=>{this.handleTabChange( 0)}}>
											<ChevronLeft/>
											Back
										</Button>
										<Button variant="contained" color="default" style={styles.button}>
											Cancel
										</Button>
										<Button variant="contained" color="primary" style={styles.button} onClick={()=>{this.submitHandler()}}>
											Submit
											<Icon style={styles.rightIcon}>send</Icon>
										</Button>
									</div>
								</>}
							</form>
						</TabContainer>
					</div>
					<div className="separator separator-dashed my-7"></div>
				</div>
			</div>
		)
	};
}

export default EventRegistrationForm;

const b_unit = [
	{
		value: "Unit 1",
		label: "Unit 1"
	},
	{
		value: "Unit 2",
		label: "Unit 2"
	},
	{
		value: "Unit 3",
		label: "Unit 3"
	},
	{
		value: "Unit 4",
		label: "Unit 4"
	}
];
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
const virtual_presential = [
	{
		value: "Test 1",
		label: "Test 1"
	},
	{
		value: "Test 2",
		label: "Test 2"
	},
	{
		value: "Test 3",
		label: "Test 3"
	},
	{
		value: "Test 4",
		label: "Test 4"
	}
];
const department = [
	{
		value: "Department 1",
		label: "Department 1"
	},
	{
		value: "Department 2",
		label: "Department 2"
	},
	{
		value: "Department 3",
		label: "Department 3"
	},
	{
		value: "Department 4",
		label: "Department 4"
	}
];
const type = [
	{
		value: "Type 1",
		label: "Type 1"
	},
	{
		value: "Type 2",
		label: "Type 2"
	},
	{
		value: "Type 3",
		label: "Type 3"
	},
	{
		value: "Type 4",
		label: "Type 4"
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
const web_presential_options = [
	{
		value: "Web",
		label: "Web"
	},
	{
		value: "Presential",
		label: "Presential"
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
		marginLeft: "0.25rem",
	},
	
	button: {
		margin: "0.25rem"
	},
	root: {
		flexGrow: 1,
	},
};

