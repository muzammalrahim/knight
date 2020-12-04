import React from "react";
import { TextField, Button, Icon } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {post} from '../helper/api';


// Example 2
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
            Password:''
        }
        this.state={
            user: this.user,
        }
    }
    changeHandler(e){
        let [key, value, {user}] = [e.target.id, e.target.value, this.state];
        user[key] = value;
        this.setState({user});
        console.log('user', this.state.user)
    }
    submitHandler(){
        let {user} = this.state;
        if(user.email && user.password){
            post('users/', user).then((response)=>{
                this.props.history.push('/users')
            })
        }
    }
	render(){
        const { classes } = this.props;
        let {user} = this.state;
        return (
            <div className="row">
                <div className={classes.root}>
                    <div className="col-md-12">
                        <h3 className="card-label pt-4 pb-2">
                            <FormattedMessage id="User.Registration.Title"/>
                        </h3>
                        <form className={classes.container} noValidate autoComplete="off">
                            <div className="col-md-6">
                                <TextField
                                    id="email"
                                    label="email"
                                    className={classes.textField}
                                    value={user.email}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    id="username"
                                    label="Username"
                                    className={classes.textField}
                                    value={user.username}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    id="business_unit"
                                    label="Business Unit"
                                    value={user.business_unit}
                                    className={classes.textField}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    required
                                    id="password"
                                    label="Password"
                                    value={user.password}
                                    type="password"
                                    className={classes.textField}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
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

