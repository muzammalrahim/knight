/* eslint-disable no-restricted-imports */
import React from "react";
import { TextField, Button, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";


// Example 2
const useStyles = makeStyles(theme => ({
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
}));



export default function TextFieldsExamplesPage() {
	const [values, setValues] = React.useState({
		name: "Cat in the Hat",
		age: "",
		multiline: "Controlled",
		currency: "EUR"
	});
  
    const classes = useStyles();
    const [values2, setValues2] = React.useState({
        name: "",
        age: "",
        multiline: "Controlled",
        currency: "EUR"
    });

	const handleChange2 = name => event => {
		setValues2({ ...values2, [name]: event.target.value });
	};
	return (
        <div className="row">
            <div className={classes.root}>
                <div className="col-md-12">
                    <h3 className="card-label text-center pt-4 pb-2">
                        <FormattedMessage id="User.Registration.Title"/>
                    </h3>
                    <form className={classes.container} noValidate autoComplete="off">
                        <div className="col-md-6">
                            <TextField
                                id="outlined-name"
                                label="email"
                                className={classes.textField}
                                value={values2.name}
                                onChange={handleChange2("name")}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                id="outlined-name"
                                label="Full Name"
                                className={classes.textField}
                                value={values2.name}
                                onChange={handleChange2("name")}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                id="outlined-uncontrolled"
                                label="Business Unit"
                                defaultValue=""
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                required
                                id="outlined-required"
                                label="Password"
                                defaultValue="Hello World"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className="col-md-12 text-right pt-4">
                            <Button variant="contained" color="primary" className={classes.button}>
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

