import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab, Typography, Table, Checkbox, 
		Radio, RadioGroup, FormControlLabel, FormControl, Snackbar, Grid } from "@material-ui/core";
import PropTypes from 'prop-types';
import {ChevronLeft, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Delete, Edit} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import FormHelperText from '@material-ui/core/FormHelperText';
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
import list, {post} from '../helper/api';
import { Alert, AlertTitle } from '@material-ui/lab';
import {Modal} from 'react-bootstrap'
// import DatePicker from 'react-datepicker'

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
class EventRegistrationForm extends React.Component {
	constructor(props){
		super(props);
		this.event={
			name:"", _type:"", date:"", duration:"", web_presential:"", country:"",	state:"",
			city:"", address:"", solicitant:"", business_unit:"", despartment:"", cost_center:"", products:[],
			speaker:[], virtual_presential:"", editspeaker:[],
		}
		this.validateEvent={
			name:false, _type:false, date:false, duration:false, web_presential:false, country:false,	state:false,
			city:false, address:false, solicitant:false, business_unit:false, despartment:false, cost_center:false, virtual_presential:false,

		}

		this.alert={
			open: false,
			severity: '',
			message:'',
			title:''
		}

		this.validateEventSpeaker={
			duration:false, role: false, speaker:false , displacement:false
		}
		this.validateEventProducts={
			product:false, percent: false,
		}
		this.editspeaker = {
			speaker:'',
			role:'',
			price:0,
			duration:'',
			displacement:'',
			id:'',
		}
		this.speaker = {
			speaker:'',
			role:'',
			price:0,
			duration:'',
			displacement:''
		}
		this.products ={
			product: '',
			percent: 0,
		}
		this.state={
			event: this.event,
			validateEvent: this.validateEvent,
			alert: this.alert,
			currentTab: 0,
			speaker_list:[],
			speakers:[],
			countries:[],
			specialty:[],
			validateEventSpeaker: this.validateEventSpeaker,
			validateEventProducts:this.validateEventProducts,
			event_speaker:[],
			event_product:[{product:"", percent:0}],
			current_speaker:this.speaker,
			add_product : this.products,
			show:false,
			edit_speaker:this.editspeaker,
			spk_to_edit:{spk:{}, data:{}},
			dateFormat:'',
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
	handleChangeProduct(e,key){
		let {event_product} = this.state;
		event_product[key][e.target.name] = e.target.value;
		this.setState({event_product: event_product});
	}
	handleSubmitSpeaker(){
		let {event_speaker, spk_to_edit, event, current_speaker, validateEventSpeaker, speakers} = this.state;
		let isSubmit = null;
		Object.keys(validateEventSpeaker).map((key)=>{
			validateEventSpeaker[key] = event_speaker[key] ? false : true;
			isSubmit = event_speaker[key] && isSubmit !== false ? true : false;
		})
		this.setState({validateEventSpeaker})
		let speaker = speakers.find(data => data.id == event_speaker.speaker)
		 isSubmit && list(`api/price`, {specialty:speaker.specialty, program_type:event._type, tier:speaker.tier})
		 .then((response)=>{
			if(response===[]) return false
			if(!event['speaker'].includes(event_speaker.speaker)){
				event_speaker['price'] = response.data[0].hour_price*parseInt(current_speaker.duration);
				event['speaker'].push(event_speaker.speaker);
				spk_to_edit.push(event_speaker)
			}
			this.setState({
				spk_to_edit,
				event,
			});
		})
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
		 isSubmit && list(`api/price`, {specialty:speaker.specialty, program_type:event._type, tier:speaker.tier})
		 .then((response)=>{
			if(response===[]) return false
			if(!event['speaker'].includes(current_speaker.speaker)){
				current_speaker['price'] = response.data[0].hour_price*parseInt(current_speaker.duration);
				// current_speaker['price'] = 200*current_speaker.duration;
				event['speaker'].push(current_speaker.speaker);
				event_speaker.push(current_speaker)
			}
			this.setState({
				event_speaker,
				event,
				current_speaker:{speaker:'', price:0, duration:'',displacement:''}
			});
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
			}else if(key === "speaker"){
				validateEvent[key] = event[key].length > 0 ? false : true;
			}else{
				validateEvent[key] = event[key] ? false : true;
				isSubmit = event[key] && isSubmit !== false ? true : false;
			}
        })
		this.setState({validateEvent});
		event['event_speaker']=this.state.event_speaker;
		event['event_product']=this.state.event_product;
        isSubmit ? post('api/events', event).then((response)=>{
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
			  speaker_list.push({label:row.name, value:row.id})
		  })
		  this.setState({speaker_list, speakers:response.data});
		})
	}
	handleClose(){
        this.setState({alert:{open:false, severity: '', message:'' }})
    }
	handleAddFields = ()=>{
	 const {add_product, event,  validateEventProducts, event_product} = this.state
	 let isSubmit = null;
		Object.keys(validateEventProducts).map((key)=>{
			validateEventProducts[key] = add_product[key] ? false : true;
			isSubmit = add_product[key] && isSubmit !== false ? true : false;
		})
	  event_product.push(add_product)
	  this.setState({event_product, event, add_product:{product:"", percent:0,}})
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
			this.setState({countries:list_data})
		});
		list('api/specialty').then((response)=>{
			this.setState({specialty:response.data})
		})
	}
	handleEditSpeaker(e){
		let [key, value, {spk_to_edit, validateEventSpeaker}] = [e.target.name, e.target.value, this.state];
		spk_to_edit[key]=value;
		if(validateEventSpeaker[key]){
            validateEventSpeaker[key] = spk_to_edit[key] ? false : true;
        }
		this.setState({spk_to_edit, validateEventSpeaker})
	}
	modalOpen= (spk, data)=>{
		// const {event, speakers, event_speaker } = this.state
		// console.log(event_speaker)
		const show = true
		// let spk = speakers.find (data=> data.id === event_speaker)
		// let data = event_speaker.find(data =>  data.speaker == speaker)
		this.setState({show,spk_to_edit:{
			spk, data
		}})
	}
	modalClose= ()=>{
		let show = false
		this.setState({show})
	}
	handleRemoveField = (index)=>{
		console.log('index', index);
		const event_product =  this.state.event_product.filter((p, i) => i !== index)
		this.setState({event_product})
	}

	render(){
		let {event:{web_presential}, event, currentTab, speaker_list, speakers, countries, event_speaker, event_product,
			validateEvent, alert:{open, severity, message, title}, specialty, current_speaker, validateEventSpeaker, validateEventProducts, add_product,
			spk_to_edit} = this.state;
		let spk_total_price = 0;
		event_speaker.map(speaker=>{
			speakers.find(data=>data.id === speaker)
			spk_total_price += parseInt(speaker?.price)})
		
		console.log(event_product)
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
										{/* <DatePicker 
											required
											name="date"
											label={<FormattedMessage id="Event.Create.Date"/>}
											dateFormat='Pp'
											value={event.date ? event.date : ''}
											onChange={(e) =>{this.handleChange(e)}}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
											error={validateEvent['date']}
                                    		helperText={validateEvent['date'] && 'this field is required'}
										/> */}
										<TextField
											required
											name="date"
											defaultValue={this.state.dateFormat}
											label={<FormattedMessage id="Event.Create.Date"/>}
											type="date"
											value={event.date ? event.date : ''}
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
									{/* <div className="col-md-6"/> */}
									{/* {web_presential === "Presential" && <> */}
										<div className="col-md-6">
											<TextField
												required={web_presential === "Presential"? true : false}
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
												required={web_presential === "Presential"? true : false}
												name="state"
												label={<FormattedMessage id="Speaker.Registration.Form.state_OR_province"/>}
												value={event.state}
												style={styles.textField}
												onChange={(e)=>{this.handleChange(e)}}
												margin="normal"
												variant="outlined"
												error={validateEvent['state']}
												helperText={validateEvent['state'] && 'this field is required'}
											/>
										</div>
										<div className="col-md-6">
											<TextField
												required={web_presential === "Presential"? true : false}
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
											required={web_presential === "Presential"? true : false}
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
								{/* </>} */}
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
											// select
											name="business_unit"
											label={<FormattedMessage id="User.Registration.Form.Business_Unit"/>}
											style={styles.textField}
											value={event.business_unit}
											onChange={(e)=>{this.handleChange(e)}}
											// SelectProps={{
											// 	native: true,
											// 	MenuProps: {
											// 		className: styles.menu
											// 	}
											// }}
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
											// type= "number"
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
											{/* <option value={null}>
												Options: Virtual | Presecial
											</option> */}
											{virtual_presential.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-6">
									
										{event_product.map((product, i)=>{
										return <div className="row" key={i}>
											<div className="col-md-12" style={{display:"flex"}}>
												<div className="col-md-6">
													<TextField
														required
														name="product"
														label={<FormattedMessage id="Event.List.Column.Product"/>}
														style={styles.textField}
														value={product.product}
														onChange={(e)=>{this.handleChangeProduct(e,i)}}
														margin="normal"
														variant="outlined"
														// error={validateEventProducts['product']}
														// helperText={validateEventProducts['product'] && 'this field is required'}
													/>
													</div>
												<div className="col-md-6" style={{display:"flex"}}>
												<TextField
													required
													name="percent"
													label={<FormattedMessage id="Event.List.Column.Percent"/>}
													style={styles.textField}
													value={product.percent}
													type= "number"
													onChange={(e)=>{this.handleChangeProduct(e,i)}}
													margin="normal"
													variant="outlined"
													// error={validateEventProducts['percent']}
													// helperText={validateEventProducts['percent'] && 'this field is required'}
												/> {event_product.length -1 == i ? <Icon className="percent-icon" style={styles.rightIcon, styles.cursorchange } onClick={this.handleAddFields}>add</Icon> : <Icon className="percent-icon" style={styles.rightIcon, styles.cursorchange } onClick={()=>this.handleRemoveField(i)}>-</Icon>}
												</div>
											
											</div>
										</div>
										})}
									</div>
                                    <Modal show={this.state.show}>
										<Modal.Header closeButton>
										<Modal.Title>Update Event Speaker</Modal.Title>
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
													onChange={(e)=>{this.handleEditSpeaker(e)}}
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
														<option selected={spk_to_edit.spk.id === option.value} key={option.value} value={option.value}>
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
													onChange={(e)=>{this.handleEditSpeaker(e)}}
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
														<option selected={spk_to_edit.spk.specialty == option.value} key={option.value} value={option.value}>
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
													value={spk_to_edit?.data?.duration}
													onChange={(e)=>{this.handleEditSpeaker(e)}}
													margin="normal"
													variant="outlined"
													error={validateEventSpeaker['duration']}
													helperText={validateEventSpeaker['duration'] && 'this field is required'}
												/>
											</div>
											<div className="col-md-12 pt-4 ml-4">
										<h5>{<FormattedMessage id="Event.Create.Displacement"/>}</h5>
										<div className="col-md-12 pt-4 ml-4">
											<FormControl component="fieldset" error={validateEventSpeaker['displacement'] && 'this field is required'} style={styles.formControl}>
												<RadioGroup
													aria-label="Gender"
													name="displacement"
													style={styles.group}
													value={spk_to_edit?.data?.displacement}
													onChange={(e)=>{this.handleEditSpeaker(e)}}
												>
													<FormControlLabel value="local" control={<Radio />} label={<FormattedMessage id="Event.Create.displacement_Loc"/>} />
													<FormControlLabel value="regional" control={<Radio />} label={<FormattedMessage id="Event.Create.displacement_Reg"/>} />
													<FormControlLabel value="international" control={<Radio />} label={<FormattedMessage id="Event.Create.displacement_Int"/>} />
												</RadioGroup>
												<FormHelperText>{validateEventSpeaker['displacement'] && <h6>this field is required</h6>}</FormHelperText>
											</FormControl>
										</div>
									</div>

										
										</div>
									</div>
										</Modal.Body>
										<Modal.Footer>
										<Button variant="secondary" onClick={this.modalClose}>
											Close
										</Button>
										<Button variant="primary" onClick={this.handleSubmitSpeaker}>
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
										<h5>{<FormattedMessage id="Event.Create.Displacement"/>}</h5>
										<div className="col-md-12 pt-4 ml-4">
											<FormControl component="fieldset" error={validateEventSpeaker['displacement'] && 'this field is required'} style={styles.formControl}>
												<RadioGroup
													aria-label="Gender"
													name="displacement"
													style={styles.group}
													value={current_speaker.displacement}
													onChange={(e)=>{this.handleChangeSpeaker(e)}}
												>
													<FormControlLabel value="local" control={<Radio />} label={<FormattedMessage id="Event.Create.displacement_Loc"/>} />
													<FormControlLabel value="regional" control={<Radio />} label={<FormattedMessage id="Event.Create.displacement_Reg"/>} />
													<FormControlLabel value="international" control={<Radio />} label={<FormattedMessage id="Event.Create.displacement_Int"/>} />
												</RadioGroup>
												<FormHelperText>{validateEventSpeaker['displacement'] && <h6>this field is required</h6>}</FormHelperText>
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

									{ event.speaker.length > 0 && <div className="col-md-12 m-4">
										<h5><FormattedMessage id="speaker.add_person.addperson_SelectedPerson"/></h5>
										<Table striped bordered hover className="ml-4 mr-4">
											<thead>
												<tr>
													<th>{<FormattedMessage id="Event.add_Speaker_Name"/>}   </th>
													<th>{<FormattedMessage id="Event.add_Speaker_Specialty"/>} </th>
													<th>Tier</th>
													<th>Role</th>
													<th><FormattedMessage id="Event.List.Column.Hour_Cost"/></th>
													<th><FormattedMessage id="Event.List.Column.Total_Hours"/></th>
													<th><FormattedMessage id="Event.List.Column.Total_Cost"/></th>
													<th style={{textAlign:'center'}}>Action</th>
												</tr>
											</thead>
											<tbody>
												{
													// event.speaker array full from handle add speaker
													// event['speaker'].push(current_speaker.speaker);
													event.speaker.map((speaker)=>{
														let spk = speakers.find(data => data.id == speaker)
														let data = event_speaker.find(data =>  data.speaker == speaker)
														return spk && <tr>
															<td>{spk.name}</td>
															<td>{spk.specialty && specialty.find(specialty => spk.specialty == specialty.id).name}</td>
															<td>{spk.tier}</td>
															<td>{data?.role}</td>
															<td>{parseInt(data?.price)/parseInt(data?.duration)}</td>
															<td>{data?.duration}</td>
															<td>{data && data.price}</td>
															<td style={{textAlign:'center'}}>
															{/* <Edit style={{cursor:'pointer'}} onClick={()=>this.modalOpen(spk, data)}/> */}
															<Delete style={{cursor:'pointer'}} onClick={()=>{
																event.speaker = event.speaker.filter(e => e !== speaker)
																this.setState({event})
																}}
															/></td>
														</tr>
													})
												}

											</tbody>
										</Table>
									</div>}


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
														{event_speaker.map(item=><div key>{item.displacement? item.displacement : '---'}</div>)}
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Product</div>
														{event_product.map(item=><div key>{item.product? item.product : '---'}</div>)}
													</div>
													<div className="col-md-6 col-12">
														<div className="kt_detail__item_title">Percent %</div>
														{event_product.map(item=><div key>{item.percent? item.percent : '---'}</div>)}
													</div>
												</div>
												<div className="row mb-4">
													<div className="col-md-6 col-12">
													<div className="kt_detail__item_title">Speakers</div>
														<Table striped bordered hover className="ml-4 mr-4">
															<thead>
																<tr>
																	<th className="p-2">{<FormattedMessage id="Event.add_Speaker_Name"/>}   </th>
																	<th className="p-1">{<FormattedMessage id="Event.add_Speaker_Specialty"/>} </th>
																	<th className="p-1">Tier</th>
																	<th className="p-1">Role</th>
																	<th className="p-1"><FormattedMessage id="Event.List.Column.Hour_Cost"/></th>
																	<th className="p-1"><FormattedMessage id="Event.List.Column.Total_Hours"/></th>
																	<th className="p-1"><FormattedMessage id="Event.List.Column.Total_Cost"/></th>
																</tr>
															</thead>
															<tbody>
																{
																	event.speaker.map((speaker)=>{
																		let spk = speakers.find(data => data.id == speaker)
																		let data = event_speaker.find(data =>  data.speaker == speaker)
																		return spk && <tr>
																			<td className="p-2">{spk.name}</td>
																			<td className="p-1">{spk.specialty && specialty.find(specialty => spk.specialty == specialty.id).name}</td>
																			<td className="p-1">{spk.tier}</td>
																			<td className="p-1">{data?.role}</td>
																			<td className="p-1">{parseInt(data?.price)/parseInt(data?.duration)}</td>
																			<td className="p-1">{data?.duration}</td>
																			<td className="p-1">{data && data.price}</td>
																		</tr>
																	})
																}
															</tbody>
														</Table>
														<hr />
													<span><h3>Event Total</h3> Speaker Quantity = {event?.speaker?.length} <br /> 
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
		value: "Virtual",
		label: "Virtual"
	},
	{
		value: "Presecial",
		label: "Presecial"
	},
	// {
	// 	value: "Test 3",
	// 	label: "Test 3"
	// },
	// {
	// 	value: "Test 4",
	// 	label: "Test 4"
	// }
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
	cursorchange: {
		cursor: "pointer",
	},
	
	button: {
		margin: "0.25rem"
	},
	root: {
		flexGrow: 1,
	},
};

