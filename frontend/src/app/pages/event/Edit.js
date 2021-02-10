import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, Typography, Table, Checkbox, 
		Radio, RadioGroup, FormControlLabel, FormControl, Snackbar, Grid } from "@material-ui/core";
import PropTypes from 'prop-types';
import {ChevronLeft, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Delete, Edit} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
  import list, {put, del, post} from '../helper/api';
  import { Alert, AlertTitle } from '@material-ui/lab';
import {Modal} from 'react-bootstrap'

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
class EventRegistrationForm extends React.Component {
	constructor(props){
		super(props);
		this.event={
			id:this.props.match.params.id,	name:"", _type:"", date:"", duration:"", web_presential:"", country:"",	state:"",
			city:"", address:"", solicitant:"", business_unit:"", despartment:"", cost_center:"",
			speaker:[], virtual_presential:"",
		}
		this.validateEvent={
			name:false, _type:false, date:false, duration:false, web_presential:false, country:false,	state:false,
			city:false, address:false, solicitant:false, business_unit:false, despartment:false, cost_center:false, virtual_presential:false,

		}
		this.validateEventSpeaker={
			duration:false, role: false, speaker:false,displacement:false
		}
		this.alert={
            open: false, 
            severity: '',
            message:'',
            title:''
		}
		this.speaker = {
			speaker:'',
			role:'',
			price:0,
			duration:'',
			displacement:''
		}
		this.state={
			event: this.event,
			validateEvent: this.validateEvent,
			validateEventSpeaker: this.validateEventSpeaker,
			alert: this.alert,
			currentTab: 0,
			speaker_list:[],
			speakers:[],
			countries:[],
			specialty:[],
			event_speaker:[],
			current_speaker:this.speaker,
			show:false,
			speaker: []
		}
		this.handleTabChange = this.handleTabChange.bind(this);
	}

	handleChangeSpeaker(e){
		let [key, value, {current_speaker, validateEventSpeaker}] = [e.target.name, e.target.value, this.state];
			current_speaker[key]=value;
		if(validateEventSpeaker[key]){
            validateEventSpeaker[key] = current_speaker[key] ? false : true;
        }
		this.setState({current_speaker, validateEventSpeaker})
	}
	handleAddSpeaker(){
		let {event_speaker, event, current_speaker, validateEventSpeaker, speakers} = this.state;
		let isSubmit = null;
		Object.keys(validateEventSpeaker).map((key)=>{
			validateEventSpeaker[key] = current_speaker[key] ? false : true;
			isSubmit = current_speaker[key] && isSubmit !== false ? true : false;
		})
		this.setState({validateEventSpeaker})

		let speaker = speakers.find(data => data.id == current_speaker.speaker)
		if(!isSubmit) return false
		isSubmit && list(`api/price`, {specialty:speaker.specialty, program_type:event._type, tier:speaker.tier, role:current_speaker.role, event:event.id, speaker:speaker.id}).then((response)=>{
			// if(response.data) return false	
			// current_speaker['price'] = response?.data[0]?.hour_price
			current_speaker['price'] = response?.data[0]?.hour_price*parseInt(current_speaker.duration);
				event['speaker'].push(current_speaker.speaker);
				event_speaker.push(current_speaker);
				let eventspeaker = {specialty:speaker.specialty, program_type:event._type, price:current_speaker.price, duration:current_speaker.duration, tier:speaker.tier, role:current_speaker.role, event:event.id, speaker:speaker.id} 
				post("api/event_speaker", eventspeaker).then((res)=>{
					this.getEvent()
					this.setState({
						event_speaker, 
						event, 
						current_speaker:{speaker:'', price:0, duration:'',displacement:''}
					});
				}).catch((err)=>{
					console.log(err)
				})
			
		})
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
			}else if(key === "speaker"){
				validateEvent[key] = event[key].length > 0 ? false : true;
			}else{
            	validateEvent[key] = event[key] ? false : true;
			}
        }
        this.setState({event, validateEvent});
	}

	handleTabChange(event, value) {
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
		event['event_speaker']=this.state.event_speaker;
        isSubmit ?  put(`api/event/${event.id}/`, event).then((response)=>{
                this.setState({alert:{open:true, severity:"success", title:"success", message:'User Created Sucessfully'}})
				setTimeout(()=>{this.props.history.push('/events')}, 1000)
			}).catch((error)=>{
				Object.keys(error.response.data).map((key)=>{
					this.setState({alert:{open:true, severity:"error", title:"Error", message:`${key+": "+error.response.data[key][0]}`}})
				})
			}) : this.setState({currentTab:0});
    }
	getSpeakers (){
		list('api/speakers').then((response)=>{
		  let speaker_list = [];
		  response.data.map((row)=>{
			  speaker_list.push({id:row.id, label:row.name, value:row.id})
		  })
		  this.setState({speaker_list, speakers:response.data});
		})
	}

	handleDeleteSpeaker(id){
		del(`api/event_speaker/${id}`).then((response)=>{
			this.getEvent();
			this.setState({event_speaker:this.state.event_speaker})

				})
	}
	getEvent (){
		let {event} = this.state;
		list(`api/event/${event.id}`).then((response)=>{
		  	this.setState({event:response.data, speaker:response.data.speaker})
			this.getSpeakers();
		})
	}
	handleClose(){
        this.setState({alert:{open:false, severity: '', message:'' }})
    }   
	componentDidMount(){
		this.getEvent();
		fetch('https://restcountries.eu/rest/v2/all')
		.then(response => response.json())
		.then((data) => {
			let list_data = []
			data.map((country)=>{
				list_data.push({label:country.name, value: country.name})
			})
			this.setState({countries:list_data})
		});
		list('api/specialty').then((response)=>{
			this.setState({specialty:response.data})
		})
	}
	handleOpen= ()=>{
		const show = true
		this.setState({show})
	}
	handleClose= ()=>{
		let show = false
		this.setState({show})
	}
	countId = (speaker)=>{
		let uniqueId = new Set();
		console.log(speaker)
		for(let ord of speaker){
			uniqueId.add(ord.id);
		}
		// the size of the set is the number of unique items we added
		return uniqueId.size;
	}
	render(){
		let {event:{web_presential}, event, currentTab, speaker_list, speakers, countries, event_speaker,
			validateEvent, alert:{open, severity, message, title}, specialty, current_speaker, validateEventSpeaker, speaker } = this.state;
			// console.log(current_speaker)
			console.log(speaker)
		let spk_total_price = 0;
		event.speaker.map(speaker=>{
			speakers.find(data=>data.id === speaker.id)
			spk_total_price += parseInt(speaker.event_speaker.price)
		})
		// let total_speaker = 0;
		let total_speaker = new Set(speaker.map(x => x.id)).size
		event.speaker.filter(speaker=>{
			speakers.find(data=>data.id === speaker.id)
			total_speaker += (speaker.id !== speaker.id)
		})
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
							<Tabs value={currentTab} onChange={this.handleTabChange}>
								<Tab label="Step One"/>
								<Tab label="Step Two"/>
								<Tab label="Step Three"/>
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
										<Button variant="contained" color="primary" style={styles.button} onClick={(e)=>{this.handleTabChange(e,1)}}>
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
									<Modal show={this.state.show}>
										<Modal.Header closeButton>
										<Modal.Title>Event Speaker</Modal.Title>
										</Modal.Header>
										<Modal.Body>
										<div className="container">
										<div className="row" style={{border:'1px solid gray', margin:'1rem', padding:'1rem'}}>
											<div className="col-md-6">
												<TextField
													required
													select
													name="speaker"
													label={<FormattedMessage id="Event.List.Column.Speaker"/>}
													style={styles.textField}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													SelectProps={{
														native: true,
														MenuProps: {
															className: styles.menu
														}
													}}
													error={validateEventSpeaker['speaker']}
													helperText={validateEventSpeaker['speaker'] && 'this field is required'}
													margin="normal"
													variant="outlined"
												>
													<option>
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
													name="role"
													label={<FormattedMessage id="Event.List.Column.Role"/>}
													style={styles.textField}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													SelectProps={{
														native: true,
														MenuProps: {
															className: styles.menu
														}
													}}
													error={validateEventSpeaker['role']}
													helperText={validateEventSpeaker['role'] && 'this field is required'}
													margin="normal"
													variant="outlined"
												>
													<option>
														Select Role....
													</option>
													{role_list.map(option => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</TextField>
											</div>
											<div className="col-md-6">
												<TextField
													required
													name="duration"
													label={<FormattedMessage id="Event.Create.Duration"/>}
													type="number"
													style={styles.textField}
													value={current_speaker.duration}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													margin="normal"
													variant="outlined"
													error={validateEventSpeaker['duration']}
													helperText={validateEventSpeaker['duration'] && 'this field is required'}
												/>
											</div>
											<div className="col-md-12 pt-4 ml-4">
											<h5>Displacement</h5>
											<div className="col-md-12 pt-4 ml-4">
												<FormControl component="fieldset" style={styles.formControl}>
													<RadioGroup
														aria-label="Gender"
														name="displacement"
														style={styles.group}
														value={current_speaker.displacement}
														onChange={(e)=>{this.handleChangeSpeaker(e)}}
													>
														<FormControlLabel value="local" control={<Radio />} label="Local (at the same State)" />
														<FormControlLabel value="regional" control={<Radio />} label="Regional (at the same Country)" />
														<FormControlLabel value="international" control={<Radio />} label="International (at different Country)" />
													</RadioGroup>
												</FormControl>
											</div>
										</div>

										</div>
									</div>
										</Modal.Body>
										<Modal.Footer>
										<Button variant="secondary" onClick={this.handleClose}>
											Close
										</Button>
										<Button variant="primary" onClick={this.handleClose}>
											Save Changes
										</Button>
										</Modal.Footer>
									</Modal>
									<div className="container">
										<div className="row" style={{border:'1px solid gray', margin:'1rem', padding:'1rem'}}>
											<div className="col-md-6">
												<TextField
													required
													select
													name="speaker"
													label={<FormattedMessage id="Event.List.Column.Speaker"/>}
													style={styles.textField}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													SelectProps={{
														native: true,
														MenuProps: {
															className: styles.menu
														}
													}}
													error={validateEventSpeaker['speaker']}
													helperText={validateEventSpeaker['speaker'] && 'this field is required'}
													margin="normal"
													variant="outlined"
												>
													<option>
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
													name="role"
													label={<FormattedMessage id="Event.List.Column.Role"/>}
													style={styles.textField}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													SelectProps={{
														native: true,
														MenuProps: {
															className: styles.menu
														}
													}}
													error={validateEventSpeaker['role']}
													helperText={validateEventSpeaker['role'] && 'this field is required'}
													margin="normal"
													variant="outlined"
												>
													<option>
														Select Role....
													</option>
													{role_list.map(option => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</TextField>
											</div>
											<div className="col-md-6">
												<TextField
													required
													name="duration"
													label={<FormattedMessage id="Event.Create.Duration"/>}
													type="number"
													style={styles.textField}
													value={current_speaker.duration}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													margin="normal"
													variant="outlined"
													error={validateEventSpeaker['duration']}
													helperText={validateEventSpeaker['duration'] && 'this field is required'}
												/>
											</div>
											{/* <div className="col-md-4">
												<TextField
													disabled
													name="price"
													label={<FormattedMessage id="Event.Create.Price"/>}
													type="number"
													style={styles.textField}
													value={current_speaker.price}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
													margin="normal"
													variant="outlined"
													error={validateEventSpeaker['price']}
													helperText={validateEventSpeaker['price'] && 'this field is required'}
												/>
											</div> */}
											<div className="col-md-12 pt-4 ml-4">
											<h5>Displacement</h5>
											<div className="col-md-12 pt-4 ml-4">
												<FormControl component="fieldset" style={styles.formControl}>
													<RadioGroup
														aria-label="Gender"
														name="displacement"
														style={styles.group}
														value={current_speaker.displacement}
														onChange={(e)=>{this.handleChangeSpeaker(e)}}
													>
														<FormControlLabel value="local" control={<Radio />} label="Local (at the same State)" />
														<FormControlLabel value="regional" control={<Radio />} label="Regional (at the same Country)" />
														<FormControlLabel value="international" control={<Radio />} label="International (at different Country)" />
													</RadioGroup>
												</FormControl>
											</div>
										</div>

											<div className="col-md-12 text-right pt-4">
												<Button variant="contained" color="primary" style={styles.button} onClick={()=>{this.handleAddSpeaker()}}>
													Add Speaker
													<Icon style={styles.rightIcon}>add</Icon>
												</Button>
											</div>
										</div>
									</div>
									{event.speaker.length > 0 && <div className="col-md-12 m-4">
										<h5>Selected Speakers</h5>
										<Table striped bordered hover className="ml-4 mr-4">
											<thead>
												<tr>
												<th>Name</th>
												<th>Specialty</th>
												<th>Tier</th>
												<th>Role</th>
												<th>Cost(hour)</th>
												<th>Total hours</th>
												<th>Total Cost</th>
												<th style={{textAlign:'center'}}>Action</th>
												</tr>
											</thead>
											<tbody>
												{
													event.speaker.map((speaker)=>{
														let spk = speakers.find(data => data.id == speaker.id)
														return spk && <tr>
															<td>{spk.name}</td>
															<td>{spk.specialty && specialty.find(specialty => spk.specialty == specialty.id).name}</td>
															<td>{speaker.tier}</td>
															<td>{speaker.event_speaker.role}</td>
															<td>{parseInt(speaker.event_speaker.price)/parseInt(speaker.event_speaker.duration)}</td>
															<td>{speaker.event_speaker.duration}</td>
															<td>{speaker.event_speaker.price}</td>
															<td style={{textAlign:'center'}}>
																<Edit style={{cursor:'pointer'}} onClick={this.handleOpen}/>
																<Delete style={{cursor:'pointer'}} onClick={()=>{
																	// event.speaker = event.speaker.filter(e => e !== speaker)
																	this.handleDeleteSpeaker(speaker.event_speaker.id)
																	this.setState({event})
																}}
															/></td>
														</tr>
													})
												}
											</tbody>
										</Table>
									</div>}
								{/*	<div className="col-md-12 pt-4 ml-4">
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
											</div> */}
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="default" style={styles.button} style={{float:'left'}} onClick={(e)=>{this.handleTabChange(e, 0)}}>
											<ChevronLeft/>
											Back
										</Button>
										<Button variant="contained" color="primary" style={styles.button} onClick={(e)=>{this.handleTabChange(e,2)}}>
											Next
											<Icon style={styles.rightIcon}>send</Icon>
										</Button>
									</div>
								</>}
								{currentTab === 2 && <>
									<Grid container spacing={3}>
											<Grid item xs={12} md={12}>
											<div className="kt_section__detail">
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Name</div>
														<div>{event.name ? event.name : '---'}</div>
													</div>
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Event Type</div>
														<div>{event._type ? event._type : '---'}</div>
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Date</div>
														<div>{event.date ? event.date : '---'}</div>
													</div>
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Duration</div>
														<div>{event.duration ? event.duration : '---'}</div>
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Web / Presential</div>
														<div>{event.web_presential ? event.web_presential : '---'}</div>
													</div>
												</div>
												{event.webpresential === "react-router-dom" && 
													<>
														<div className="row mb-4">
															<div className="col-md-6 col-12">
																<div className="kt_detail__item_title">Country</div>
																<div>{event.country ? event.country : '---'}</div>
															</div>
														</div>
														<div className="row mb-4">
															<div className="col-md-6 col-12">
																<div className="kt_detail__item_title">State / Province</div>
																<div>{event.state ? event.state : '---'}</div>
															</div>
														</div>
														<div className="row mb-4">
															<div className="col-md-6 col-12">
																<div className="kt_detail__item_title">City</div>
																<div>{event.city ? event.city : '---'}</div>
															</div>
														</div>
														<div className="row mb-4">
															<div className="col-md-6 col-12">
																<div className="kt_detail__item_title">Address</div>
																<div>{event.address ? event.address : '---'}</div>
															</div>
														</div>
													</>
												}
												<hr/>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Solicitant Name</div>
														<div>{event.solicitant ? event.solicitant : '---'}</div>
													</div>
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Business Unit</div>
														<div>{event.business_unit ? event.business_unit : '---'}</div>
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Department</div>
														<div>{event.despartment ? event.despartment : '---'}</div>
													</div>
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Cost Center</div>
														<div>{event.cost_center ? event.cost_center : '---'}</div>
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Virtual Presential</div>
														<div>{event.virtual_presential ? event.virtual_presential : '---'}</div>
													</div>
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Displacement</div>
														<div>{current_speaker.displacement ? current_speaker.displacement : '---'}</div>
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
													<div className="kt_detail__item_title">Speakers</div>
														<Table striped bordered hover className="ml-4 mr-4">
															<thead>
																<tr>
																	<th className="p-2">Name</th>
																	<th className="p-1">Specialty</th>
																	<th className="p-1">Tier</th>
																	<th className="p-1">Role</th>
																	<th className="p-1">Cost(hour)</th>
																	<th className="p-1">Duration</th>
																	<th className="p-1">Total Cost</th>
																</tr>
															</thead>
															<tbody>
																{
																	event.speaker.map((speaker)=>{
																		let spk = speakers.find(data => data.id == speaker.id)
																		return spk && <tr>
																			<td className="p-2">{spk.name}</td>
																			<td className="p-1">{spk.specialty && specialty.find(specialty => spk.specialty == specialty.id).name}</td>
																			<td className="p-1">{speaker.tier}</td>
																			<td className="p-1">{speaker.event_speaker.role}</td>
																			<td className="p-1">{parseInt(speaker.event_speaker.price)/parseInt(speaker.event_speaker.duration)}</td>
																			<td className="p-1">{speaker.event_speaker.duration}</td>
																			<td className="p-1">{speaker.event_speaker.price}</td>
																		</tr>
																	})
																}
															</tbody>
														</Table>
													<hr />
													<span><h3>Event Total</h3> Speaker Quantity = {total_speaker} <br /> 
													Total Event = {spk_total_price} </span>
													</div>
												</div>
											</div>
											</Grid>
									</Grid>
    
									<div className="col-md-12 text-right pt-4">
										<Button variant="contained" color="default" style={styles.button} style={{float:'left'}} onClick={(e)=>{this.handleTabChange(e, 0)}}>
											Edit
											<Edit/>
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
const type = [
	{
		value: "Small Meetings",
		label: "Small Meetings"
	},
	{
		value: "Symposia",
		label: "Symposia"
	},
	{
		value: "Webinars",
		label: "Webinars"
	},
	{
		value: "EIF (Expert Input Forum)",
		label: "EIF (Expert Input Forum)"
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
const role_list = [
	{
		value: "Chair",
		label: "Chair"
	},
	{
		value: "Participant",
		label: "Participant"
	},
	{
		value: "Speaker",
		label: "Speaker"
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

