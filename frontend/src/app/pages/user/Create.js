import React from "react";
import { TextField, Button, Icon, Snackbar, withStyles } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import {connect} from 'react-redux';
import {post} from '../helper/api';
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
            business_unit:'',
            username: '',
            email: '',
            password:''
        }
        this.userValidate={
            business_unit:false,
            username: false,
            email: false,
            password:false
        }
        this.alert={
            open: false, 
            severity: '',
            message:'',
            title:''
        }
        this.state={
            user: this.user,
            userValidate: this.userValidate,
            alert: this.alert
        }
    }
    changeHandler(e){
        let [key, value, {user, userValidate}] = [e.target.id, e.target.value, this.state];
        
		// console.log("value :",value);
        user[key] = value;
        if(userValidate[key])
        {
            if(key==='email')
            {
                userValidate[key] = user[key] && this.validateEmail(user[key]) ? false : true;
            }else{
                userValidate[key] = user[key] && user[key].length > 3 ? false : true;
            }
        }
        this.setState({user, userValidate});
    }
    submitHandler(){
        let {user, userValidate} = this.state;
        let isSubmit = null;
        Object.keys(userValidate).map((key)=>{

            // console.log("bhoom",user[key]);
            isSubmit = user[key] && isSubmit !== false ? true : false;

            // console.log("issubmit",isSubmit)
            if(key==='email'){
                userValidate[key] = user[key] && this.validateEmail(user[key]) ? false : true;

                console.log(" userValidate[key ] email :" ,userValidate[key])
            }else{
                userValidate[key] = user[key] && user[key].length > 3 ? false : true;
                
                // console.log(" userValidate[key] :" ,userValidate[key])
            }
        })
        this.setState({userValidate});

        isSubmit && post('users/', user).then((response)=>{
            this.setState({alert:{open:true, severity:"success", title:"success", message:'User Created Sucessfully'}})
            setTimeout(()=>{this.props.history.push('/users')}, 1000)
        }).catch((error)=>{

            
            
            Object.keys(error.response.data).map((key)=>{
                console.log("key:",error.response.data);
                this.setState({alert:{open:true, severity:"error", title:"Error", message:`${key+": "+error.response.data[key][0]}`}})
                console.log("error:",error.response.data[key]);
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
        let {user, userValidate, alert:{open, severity, message, title}} = this.state;
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
                            <FormattedMessage id="User.Registration.Title"/>
                        </h3>
                        <form className={classes.container} noValidate autoComplete="off">
                            <div className="col-md-6">
                                <TextField
                                    id="email"
                                    label=  {<FormattedMessage id="User.Registration.Form.Email"/>}
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
                                    id="username"
                                    label= {<FormattedMessage id="User.Registration.Form.User_Name"/>}
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
                                    label= {<FormattedMessage id="User.Registration.Form.Business_Unit"/>}
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
                                    required
                                    id="password"
                                    label= {<FormattedMessage id="User.Registration.Form.Password"/>}
                                    value={user.password}
                                    type="password"
                                    className={classes.textField}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                    error={userValidate['password']}
                                    helperText={userValidate['password'] && 'this field is required'}
                                />
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

