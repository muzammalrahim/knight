import React from "react";
import { TextField, Button, Icon, AppBar, Tabs, Tab } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {ChevronLeft} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {
	getCurrentDate
  } from "../../../_metronic/_helpers";
  import list, {post} from '../helper/api';

class EventEditForm extends React.Component {
	constructor(props){
		super(props);
		this.event={
			id:this.props.match.params.id,	name:"", _type:"", date:"", duration:"", web_presential:"", 
			country:"",	state:"", city:"", address:"", solicitant:"", business_unit:"", despartment:"", 
			cost_center:"",	speaker_name:"", virtual_presential:"", _duration:"", displacement:''
		}
		this.state={
			event: this.event,
			currentTab: 0,
			speaker_list:[],
			countries:[]
		}
	}

	handleChange(e){
		let key = e.target.name;
		let value = e.target.value;
		let {event} = this.state;
		event[key]=value;
		this.setState({event})
	}

	handleTabChange(value) {
		this.setState({currentTab:value});
	}
	submitHandler(){
        let {event} = this.state;
        if(event.name && event._type && event.date && event.country && event.city){
            post('api/events', event).then((response)=>{
                this.props.history.push('/events')
            })
        }
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
	getEvent (){
		let {event} = this.state;
		list(`api/event/${event.id}`).then((response)=>{
		  this.setState({event:response.data})
		})
	}
	componentDidMount(){
		this.getSpeakers();
		this.getEvent();
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
		let {event:{web_presential}, event, currentTab, speaker_list, countries} = this.state;
		console.log('ye kya baat hoi event',this.state.event)
		return (
			<div className="row">
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
											label="Event Name"
											style={styles.textField}
											value={event.name}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="_type"
											label="Type"
											style={styles.textField}
											value={event._type}
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
											>
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
											label="Date"
											type="date"
											value={event.date ? event.date : getCurrentDate()}
											onChange={(e) =>{this.handleChange(e)}}
											style={styles.textField}
											InputLabelProps={{
												shrink: true
											}}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="duration"
											label="Duration"
											type="number"
											style={styles.textField}
											value={event.duration}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="web_presential"
											label="Web/Presential"
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
											>
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
												label="Country"
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
												>
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
												label="State / Province"
												style={styles.textField}
												value={event.state}
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
												required
												name="city"
												label="City"
												value={event.city}
												style={styles.textField}
												onChange={(e)=>{this.handleChange(e)}}
												margin="normal"
												variant="outlined"
											/>
										</div>
										<div className="col-md-6">
										<TextField
											required
											name="address"
											label="Address"
											value={event.address}
											style={styles.textField}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
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
											label="Solicitant Name"
											style={styles.textField}
											value={event.solicitant}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="business_unit"
											label="Business Unit"
											style={styles.textField}
											value={event.business_unit}
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
										>
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
											select
											name="despartment"
											label="Department"
											style={styles.textField}
											value={event.despartment}
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
										>
											{department.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</TextField>
									</div>
									<div className="col-md-6">
										<TextField
											required
											name="cost_center"
											label="Cost Center"
											style={styles.textField}
											value={event.cost_center}
											onChange={(e)=>{this.handleChange(e)}}
											margin="normal"
											variant="outlined"
										/>
									</div>
									<div className="col-md-6">
										<TextField
											required
											select
											name="speaker_name"
											label="Speaker Name"
											style={styles.textField}
											value={event.speaker_name}
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
										>
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
											label="Virtual / Presential"
											style={styles.textField}
											value={event.virtual_presential}
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
										>
											{virtual_presential.map(option => (
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

export default EventEditForm;

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

