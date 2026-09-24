import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {HelpOutline} from "@material-ui/icons";

export default class TitleModule extends Component {
    render() {
        return (
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <div className="page-header-title">
                                <Link to="/">.</Link>

                                <h5 className="text-white" style={{
                                    paddingTop: "8px",
                                    fontWeight: "bold",
                                    fontSize: "20px"
                                }}>{this.props.actualTitle.toUpperCase()}</h5>

                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/"><i className="feather icon-home"/></Link>
                                </li>
                                {this.props.fatherModuleTitle !== "" ?
                                    <>
                                        <li className="breadcrumb-item">
                                            <Link to={this.props.fatherModuleUrl}>{this.props.fatherModuleTitle}</Link>
                                        </li>

                                        {this.props.fatherModule2Url !== "" &&
                                        <li className="breadcrumb-item">
                                            <Link
                                                to={this.props.fatherModule2Url}>{this.props.fatherModule2Title}</Link>
                                        </li>
                                        }

                                        <li className="breadcrumb-item">
                                            <Link to={"#"}>{this.props.actualModule}</Link>
                                        </li>
                                    </>
                                    :
                                    <li className="breadcrumb-item">
                                        <Link to={"#"}>{this.props.actualModule}</Link>
                                    </li>


                                }
                                {/*<li className="breadcrumb-item"><OverlayTrigger*/}
                                {/*    overlay={<Tooltip>Las convalidaciones, se realizan cuado el estudiante, se atrazo en*/}
                                {/*        su*/}
                                {/*        plan de estudios.</Tooltip>}>*/}
                                {/*    <HelpOutline className={'text-white'}/>*/}
                                {/*</OverlayTrigger>*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
