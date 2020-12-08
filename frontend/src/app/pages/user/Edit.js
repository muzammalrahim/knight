import React from "react";
import { TextField, Button, Icon, Snackbar } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import list, {put} from '../helper/api';
import { toInteger } from "lodash";
import { Alert, AlertTitle } from '@material-ui/lab';

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap"
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1)
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
});

class Create extends React.Component {
    constructor(props){
        super(props);
        
        this.user={
            id:this.props.match.params.id,
            first_name:'',
            last_name:'',
            business_unit:'',
            username: '',
            email: '',
            groups:[]
        }
        this.userValidate={
            first_name:false,
            last_name:false,
            business_unit:false,
            username: false,
            email: false,
            groups:false
        }
        this.alert={
            open: false, 
            severity: '',
            message:'',
            title:''
        }
        this.state={
            user: this.user,
            groups:[],
            selected_group:null,
            userValidate: this.userValidate,
            alert: this.alert
        }
        this.getData();
    }
    getData(){
        var {groups, user, selected_group} = this.state
        list(`users/${this.state.user.id}`).then((response)=>{
            this.setState({user:response.data})
        })
        list(`groups`).then((response)=>{
            response.data.map(({id, name})=>{
                groups.push({label:name, value:id})
                if(user.groups[0]===id){
                    selected_group= {label:name, value:id}
                }
            })
            this.setState({groups, selected_group})
        })
    }
    changeHandler(e){
        let [key, value, {user, userValidate}] = [e.target.id, e.target.value, this.state];
        if(key === "groups"){
            user[key][0] = toInteger(value);
        }else{
            user[key] = value;
        }
        if(userValidate[key]){
            if(key==='email'){
                userValidate[key] = user[key] && this.validateEmail(user[key]) ? false : true;
            }else if(key==='groups'){
                userValidate[key] = user[key] ? false : true;
            }else {
                userValidate[key] = user[key] && user[key].length > 3 ? false : true;
            }
        }
        this.setState({user, userValidate});
    }
    submitHandler(){
        let {user, userValidate} = this.state;
        let isSubmit = null;
        Object.keys(userValidate).map((key)=>{
            isSubmit = user[key] && isSubmit !== false ? true : false;
            if(key==='email'){
                userValidate[key] = user[key] && this.validateEmail(user[key]) ? false : true;
            }else if(key === 'groups'){
                userValidate[key] = user[key] ? false : true;
            }else {
                userValidate[key] = user[key] && user[key].length > 3 ? false : true;
            }
        })
        this.setState({userValidate});
        isSubmit && put(`users/${user.id}/`, user).then((response)=>{
            this.setState({alert:{open:true, severity:"success", title:"success", message:'User has been updated Sucessfully'}})
            setTimeout(()=>{this.props.history.push('/users')}, 1000)
            }).catch((error)=>{
                Object.keys(error.response.data).map((key)=>{
                    this.setState({alert:{open:true, severity:"error", title:"Error", message:`${key+": "+error.response.data[key][0]}`}})
                })
            })
    }
    handleClose(){
        this.setState({alert:{open:false, severity: '', message:'' }})
    }  
    validateEmail(email){
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(email)) {
                return false
            }
            return true
    }
	render(){
        const { classes } = this.props;
        let {user, groups, selected_group, userValidate, alert:{severity, message, title, open}} = this.state;
        return (
            <div className="row">
                <Snackbar open={open} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'right' }} onClose={()=>{this.handleClose()}}>
                    <Alert onClose={()=>{this.handleClose()}} severity={severity}>
                        <AlertTitle>{title}</AlertTitle>
                        <strong>{message}</strong>
                    </Alert>
                </Snackbar>
                <div className={classes.root}>
                    <div className="col-md-12">
                        <h3 className="card-label pt-4 pb-2">
                            <FormattedMessage id="User.Edit.Title"/>
                        </h3>
                        <form className={classes.container} noValidate autoComplete="off">
                            <div className="col-md-6">
                                <TextField
                                    id="first_name"
                                    label={<FormattedMessage id="User.Edit.Form.F_Name"/>}
                                    className={classes.textField}
                                    value={user.first_name}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                    error={userValidate['first_name']}
                                    helperText={userValidate['first_name'] && 'this field is required'}
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    id="last_name"
                                    label={<FormattedMessage id="User.Edit.Form.L_Name"/>}
                                    className={classes.textField}
                                    value={user.last_name}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                    error={userValidate['last_name']}
                                    helperText={userValidate['last_name'] && 'this field is required'}
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    required
                                    id="email"
                                    label={<FormattedMessage id="User.Edit.Form.Email"/>}
                                    className={classes.textField}
                                    value={user.email}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                    error={userValidate['email']}
                                    helperText={userValidate['email'] && 'this field is required'}
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    required
                                    id="username"
                                    label={<FormattedMessage id="User.Edit.Form.U_Name"/>}
                                    className={classes.textField}
                                    value={user.username}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                    error={userValidate['username']}
                                    helperText={userValidate['username'] && 'this field is required'}
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    id="business_unit"
                                    label={<FormattedMessage id="User.Edit.Form.Business_Unit"/>}
                                    value={user.business_unit}
                                    className={classes.textField}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                    error={userValidate['business_unit']}
                                    helperText={userValidate['business_unit'] && 'this field is required'}
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    id="groups"
                                    select
                                    label={<FormattedMessage id="User.Edit.Form.Group"/>}
                                    style={styles.textField}
                                    value={selected_group}
                                    onChange={(event)=>{this.changeHandler(event)}}
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
                                    {groups.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
								</TextField>
                            </div>
                            <div className="col-md-12 text-right pt-4">
                                <Button variant="contained" color="primary" className={classes.button} onClick={()=>{this.submitHandler()}}>
                                    Submit
                                    {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                                    <Icon className={classes.rightIcon}>send</Icon>
                                </Button>
                            </div>
                        </form>
                    </div>
                <div className="separator separator-dashed my-7"></div>
            </div>
        </div>
        );
    }
}

export default connect(null, null)(withStyles(styles)(Create))

