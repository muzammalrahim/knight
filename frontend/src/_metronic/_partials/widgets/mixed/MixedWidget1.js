/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo, useEffect, useState} from "react";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import {toAbsoluteUrl} from "../../../_helpers";
import {useHtmlClassService} from "../../../layout";
import { useHistory } from "react-router";
import { FormattedMessage } from "react-intl";
import Typography from '@material-ui/core/Typography';
import {
  createMuiTheme,
  responsiveFontSizes,
  MuiThemeProvider,
} from "@material-ui/core";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme)

export function MixedWidget1({ className }) {
  const uiService = useHtmlClassService();
  const history = useHistory();
  const [user, setUser] = useState({});

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseDanger: objectPath.get(
        uiService.config,
        "js.colors.theme.base.danger"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily")
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_mixed_widget_1_chart");
    if (!element) {
      return;
    }

    const options = getChartOptions(layoutProps);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps]);
  useEffect(() => {
    let ls = JSON.parse(localStorage.getItem('persist:v705-demo1-auth'));
    if(ls.user) {
      ls = JSON.parse(localStorage.getItem('persist:v705-demo1-auth')).user;
      setUser(JSON.parse(ls));
    }
    // let user = localStorage.getItem('persist:v705-demo1-auth') && JSON.parse(localStorage.getItem('persist:v705-demo1-auth')).user;
    // setUser(() => JSON.parse(user));
    // console.log('user', user);
    // User = JSON.parse(User)
    // User && User.groups.length > 0 && setUser(User.groups[0])
  },[]);
  function handleClick(url){
    history.push(`/${url}`);
  }
  return (
    <div className={`card card-custom bg-gray-100 ${className}`}>
      {/* Header */}
      <div className="card-header border-0 bg-warning py-5">
        <h3 className="card-title font-weight-bolder text-white">
          {/* <FormattedMessage id="Dashboard.Welcome" /> */}
        </h3>
      </div>
      {/* Body */}
      <div className="card-body p-0 position-relative overflow-hidden">
        {/* Chart */}
        <div
          // id="kt_mixed_widget_1_chart"
          className="card-rounded-bottom bg-warning"
          style={{ height: "200px" }}
        >
    
          {/* <Box fontSize="h1.fontSize" m={1} align="center">
          Fair Market Value
        </Box> */}

        {/* <Typography   variant="h1" component="h2" align="center">
        Fair Market Value
</Typography> */}


      <MuiThemeProvider theme={theme}>
      <Typography style={{fontWeight:"bold"}}  variant="h1" component="h2" align="center">
        Fair Market Value
</Typography>
      
      </MuiThemeProvider>

        </div>

        {/* Stat */}
        <div className="card-spacer mt-n25">
          <div className="row m-0">
            <div className="col px-6 py-8 rounded-xl mr-7 mb-7" style={{cursor:'pointer',backgroundColor:"#1d2d51"}} onClick={()=>{handleClick('speaker/create')}}>
              <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-success font-weight-bold font-size-h6"
              >
                <FormattedMessage id="Dashboard.New.Speaker" />
              </a>
            </div>
            <div className="col px-6 py-8 rounded-xl mb-7" style={{cursor:'pointer',backgroundColor:"#d2dfef"}} onClick={()=>{handleClick('event/create')}}>
              <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-primary font-weight-bold font-size-h6 mt-2"
              >
                <FormattedMessage id="Dashboard.New.Event" />
              </a>
            </div>
          </div>
          {user.is_superuser === true && <div className="row m-0">
            <div className="col  px-6 py-8 rounded-xl mr-7" style={{cursor:'pointer',backgroundColor:"#ffc000"}} onClick={()=>{handleClick('user/create')}}>
              <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Communication/Add-user.svg")}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-primary font-weight-bold font-size-h6 mt-2"
              >
                <FormattedMessage id="Dashboard.New.User" />
              </a>
            </div>
            <div className="col px-6 py-8 rounded-xl" style={{cursor:'pointer',backgroundColor:"#fcecd2"}} onClick={()=>{handleClick('approvals')}}>
              <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Chat-check.svg"
                  )}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-success font-weight-bold font-size-h6 mt-2"
              >
                <FormattedMessage id="Dashboard.Approvals" />
              </a>
            </div>
          </div>}
        </div>

        {/* Resize */}
        <div className="resize-triggers">
          <div className="expand-trigger">
            <div style={{ width: "411px", height: "461px" }} />
          </div>
          <div className="contract-trigger" />
        </div>
      </div>
    </div>
  );
}

function getChartOptions(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 40, 40]
      }
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "solid",
      opacity: 0
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor]
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3
        }
      }
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily
      },
      y: {
        formatter: function(val) {
          return "$" + val + " thousands";
        }
      },
      marker: {
        show: false
      }
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3
    }
  };
  return options;
}
