import React from "react";
import { TextField, Button, Icon } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import list, {put} from '../helper/api';
import { toInteger } from "lodash";


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
            id:this.props.match.params.id,
            first_name:'',
            last_name:'',
            business_unit:'',
            username: '',
            email: '',
            groups:[]
        }
        this.state={
            user: this.user,
            groups:[],
            selected_group:null
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
        let [key, value, {user}] = [e.target.id, e.target.value, this.state];
        if(key === "groups"){
            user[key][0] = toInteger(value);
        }else{
            user[key] = value;
        }
        this.setState({user});
    }
    submitHandler(){
        let {user} = this.state;
        if(user.email && user.username){
            put(`users/${user.id}/`, user).then((response)=>{
                this.props.history.push('/users')
            })
        }
    }
	render(){
        const { classes } = this.props;
        let {user, groups, selected_group} = this.state;
        return (
            <div className="row">
                <div className={classes.root}>
                    <div className="col-md-12">
                        <h3 className="card-label pt-4 pb-2">
                            <FormattedMessage id="User.Edit.Title"/>
                        </h3>
                        <form className={classes.container} noValidate autoComplete="off">
                            <div className="col-md-6">
                                <TextField
                                    id="first_name"
                                    label="First Name"
                                    className={classes.textField}
                                    value={user.first_name}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    id="last_name"
                                    label="Last Name"
                                    className={classes.textField}
                                    value={user.last_name}
                                    onChange={(e)=>{this.changeHandler(e)}}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    required
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
                                    required
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
                                    id="groups"
                                    select
                                    label="Group"
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

