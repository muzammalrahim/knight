import React from "react";
import { Button, Switch, FormControlLabel, Typography, Snackbar, Grid } from "@material-ui/core";
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {ChevronLeft} from '@material-ui/icons';
import { FormattedMessage } from "react-intl";
  import list, {put} from '../helper/api';
  import { Alert, AlertTitle } from '@material-ui/lab';

class EventEditForm extends React.Component {
	constructor(props){
        super(props);
        
		this.event={
			id:this.props.match.params.id,	name:"", _type:"", date:"", duration:"", web_presential:"", 
			country:"",	state:"", city:"", address:"", solicitant:"", business_unit:"", despartment:"", 
			cost_center:"",	speaker:[], virtual_presential:"", displacement:''
        }
        
		this.alert={
            open: false, 
            severity: '',
            message:'',
            title:''
        }

		this.state={
			event: this.event,
			alert: this.alert,
		}
	}

	handleChangeStatus (id, value){
        let {event, alert} = this.state;
        let data = event;
        data['status'] = value;
        event['status'] = value;
        data['speaker'] = event.speaker.id;
        data['event'] = event.event.id;
        put(`api/event_speaker/${id}/`,data).then((response)=>{
          alert.severity = 'success';
          alert.title = "Success";
          alert.message = "Record has been successfully Updated";
          alert.open = true;
          this.setState({alert, event});
      }).catch((error)=>{
          alert.severity = 'error';
          alert.title = "Error";
          alert.message = "Something went wrong";
          alert.open = true;
          this.setState({alert})
      })
    };
	
	getEvent (){
		let {event} = this.state;
		list(`api/event_speaker/${event.id}`).then((response)=>{
		  	this.setState({event:response.data})
		})
    }
    
	handleClose(){
        this.setState({alert:{open:false, severity: '', message:'' }})
    }   

	componentDidMount(){
		this.getEvent();
    }
    
	render(){
		let {event, alert:{open, severity, message, title}, specialty} = this.state;
		return (
			<div className="row">
				<Snackbar open={open} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'right' }} onClose={()=>{this.handleClose()}}>
                    <Alert onClose={()=>{this.handleClose()}} severity={severity}>
                        <AlertTitle>{title}</AlertTitle>
                        <strong>{message}</strong>
                    </Alert>
                </Snackbar>
				{event.id && <div style={styles.root}>
					<div className="col-md-12">
						<h2 className="card-label pt-4 pb-4">
							<FormattedMessage id="Approvals.Detail.Title"/>
						</h2>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <div>
                                    <div className="row mb-4">
                                        <div className="col-md-12 col-12">
                                            <h3>Event Detail</h3>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Name</div>
                                            <div>{event.event ? event.event.name : '---'}</div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Duration</div>
                                            <div>{event.event ? event.event.duration : '---'}</div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Country</div>
                                            <div>{event.event ? event.event.country : '---'}</div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Date</div>
                                            <div>{event.event ? event.event.date : '---'}</div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Web / PPresential</div>
                                            <div>{event.event ? event.event.web_presential : '---'}</div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Type</div>
                                            <div>{event.event ? event.event._type : '---'}</div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="row mb-4">
                                        <div className="col-md-12 col-12">
                                            <h3>Speaker Detail</h3>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Name</div>
                                            <div>{event.speaker ? event.speaker.name : '---'}</div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Date of Birth</div>
                                            <div>{event.speaker ? event.speaker.dob : '---'}</div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Country</div>
                                            <div>{event.speaker ? event.speaker.country : '---'}</div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">City</div>
                                            <div>{event.speaker ? event.speaker.city : '---'}</div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Mobile</div>
                                            <div>{event.speaker ? event.speaker.mobile : '---'}</div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="kt_detail__item_title">Price</div>
                                            <div>{event ? event.price : '---'}</div>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>

                        <div className="col-md-12 text-right pt-4">
                            <Button variant="contained" color="default" style={styles.button} style={{float:'left'}} onClick={()=>{this.props.history.push('/approvals')}}>
                                <ChevronLeft/>
                                Back
                            </Button>
                            <FormControlLabel
                            control={
                                <Switch
                                    checked={!event.status?false:true}
                                    onChange={()=>{
                                        this.handleChangeStatus(event.id, !event.status)
                                    }}
                                    color="primary"
                                />
                            }
                            label={event.status ? "Approved" : "Approve"}
                            />
                        </div>
					</div>
					<div className="separator separator-dashed my-7"></div>
				</div>}
			</div>
		)
	};
}

export default withRouter(EventEditForm);


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

