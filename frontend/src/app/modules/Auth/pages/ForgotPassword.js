import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { requestPassword } from "../_redux/authCrud";
import { TextField, Button, Icon, Snackbar, withStyles } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';

const initialValues = {
  email: "",
  checkk : false,
};

function ForgotPassword(props) {
  const { intl } = props;
  const [isRequested, setIsRequested] = useState(false);
   const [alertsnack,setalertsnack] = useState({
                                                    open: false,
                                                    severity: '',
                                                     message:'',
                                                     title:''
                                                    });
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

 const handleClose=()=>{
    setalertsnack({...alertsnack,open:false, severity: '', message:'' })
  }

  const formik = useFormik({
    initialValues,
     validationSchema: ForgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      requestPassword(values.email)
        .then((res) => {
          setIsRequested(true)
          setalertsnack({
            ...alertsnack,
            open: true,
            severity: 'success',
            title:'success',
            message:'Email send and verified Sucessfully',

          });
          setTimeout(()=>{props.history.push('/auth/login')}, 6000)
        })
        .catch(() => {
          setIsRequested(false);
          setSubmitting(false);

          setalertsnack({
            ...alertsnack,
               open: true,
               severity: 'error',
               title:'Error',
                message:'Email not Send ',

          });
          setStatus(
            intl.formatMessage(
              { id: "AUTH.VALIDATION.NOT_FOUND" },
              { name: values.email }
            )
          );
        });
    },
  });

  return (
    <>
    <Snackbar open={alertsnack.open} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'right' }} onClose={()=>{handleClose()}}>
    <Alert onClose={()=>{handleClose()}} severity={alertsnack.severity}>
        <AlertTitle>{alertsnack.title}</AlertTitle>
        <strong>{alertsnack.message}</strong>
    </Alert>
  </Snackbar>

      {!isRequested && (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">Forgotten Password ?</h3>
            <div className="text-muted font-weight-bold">
              Enter your email to reset your password
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit }
            className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
          >
            {formik.status && (
              <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                <div className="alert-text font-weight-bold">
                  {formik.status}
                </div>
              </div>
            )}
            <div className="form-group fv-plugins-icon-container">
              <input
                type="email"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "email"
                )}`}
                name="email"
                // onChange={hello}
                {...formik.getFieldProps("email")}

              />

              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </div>
            <div className="form-group d-flex flex-wrap flex-center">
              <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                // disabled={(formik.isSubmitting) || (formik.touched.email)?true:false}
                disabled={ formik.isSubmitting || !formik.isValid}
              >
                Submit
              </button>
              <Link to="/auth">
                <button
                  type="button"
                  id="kt_login_forgot_cancel"
                  className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
