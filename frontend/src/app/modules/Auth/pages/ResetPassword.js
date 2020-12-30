import React, { useState ,useEffect} from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect ,useParams} from "react-router-dom";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { newPassword } from "../_redux/authCrud";

const initialValues = {
  newpassword: "",
  confirmpassword: "",
};

function ResetPassword(props) {

  const {id} = useParams()
  alert(id);
  const { intl } = props;
  const [isRequested, setIsRequested] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    newpassword: Yup.string() 
      .min(6, "Minimum 6 symbols")
      .max(12, "Maximum 12 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),

      confirmpassword: Yup.string()  
      .min(6, "Minimum 6 symbols")
      .max(12, "Maximum 12 symbols")
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

const checkpass= (first, sec)=>
{
  if ( first != sec) {
   return false
}
  else{ return true }
}

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema , 
    onSubmit: (values, { setStatus, setSubmitting }) => {
         newPassword(values.newpassword)
        .then( () => setIsRequested(true))
        .catch(() => {
          setIsRequested(false);
          setSubmitting(false);
        
         if(checkpass(values.newpassword,values.confirmpassword)){
           setStatus(
            intl.formatMessage(
                    { id: "AUTH.VALIDATION.NOT_FOUND" },
                    { name: values.newpassword }
                    )
                  );
                }
         else{
          setStatus(
            intl.formatMessage(
              { id: "AUTH.VALIDATION.PASSWORD_MATCH_FIELD" },
              { name: values.newpassword }
             )
            );
             }
        });

      
    },
  });



  return (
    <>
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">Now Ready to change you password !</h3>
            <div className="text-muted font-weight-bold">
              Enter your New Password & Confirm password
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
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
                type="password"
                placeholder="Enter new password"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "password"
                )}`}
                name="newpassword"
                onChange={formik.handleChange}
                {...formik.getFieldProps("newpassword")}
              />
              {formik.touched.newpassword && formik.errors.newpassword ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.newpassword}</div>
                </div>
              ) : null}
            </div>

            <div className="form-group fv-plugins-icon-container">
              <input
                type="password"
                placeholder="Enter again to confirm"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "password"
                )}`}
                // onChange = {(e)=>{console.log(e.target.value)}}
                name="confirmpassword"
                 {...formik.getFieldProps("confirmpassword")}
                
              />
              
              {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.confirmpassword}</div>
                </div>
              ) : null}

            </div>
            <div className="form-group d-flex flex-wrap flex-center">
              <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                disabled={formik.isSubmitting}
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

export default injectIntl(connect(null, auth.actions)(ResetPassword));
