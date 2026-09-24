import React, {Component} from 'react';

import {Card} from "react-bootstrap";
import app from "../../../../Constants";
import axios from "axios";
import DTDocuments from './DTDocuments';




export default class Curriculum extends Component {

    state = {
      personID: this.props.personID,
      record:'',
      cvLabel:'',
      cvFile:'',

    };

    componentDidMount() {
      this.getCurriculum();
    };

    getCurriculum = () =>{
      const url = app.general + '/' + app.documentCurriculum + '/' + this.props.personID;
      axios.get(url, app.headers).then(res=>{
        if(res.data){
          this.setState({
            record: res.data,
            cvLabel:res.data.code,
            cvFile:res.data.archive,
          })
        }
      })
    }

    handleDTDocumentsNew = () =>{
      this.DTDocuments.handleModalDocument();
      this.DTDocuments.getDocumentsByPerson(this.state.personID);
      this.DTDocuments.getDocumentType();
      this.DTDocuments.handleAddDocument();
    };

    handleDTDocumentsEdit = () =>{
      this.DTDocuments.handleModalDocument();
      this.DTDocuments.getDocumentsByPerson(this.state.personID);
      this.DTDocuments.getDocumentType();
      this.DTDocuments.handleClickRetrieveDocument(this.state.record);
    };

    handleClickSelectDocument = (record) =>{
      this.setState({
        record: record,
        cvFile: record.archive,
        cvLabel: record.code,
      });
    };


    render() {
      const {cvLabel, cvFile} = this.state;
        return (
            <Card>
                <Card.Body
                    className='d-flex align-items-center justify-content-between'>
                    <h5 className="mb-0">Curriculum Vitae: {cvLabel}</h5>
                    { cvLabel ?
                      <div className='float-right'>
                        { cvFile &&
                          <a target='_blank' rel='noreferrer noopener'
                             href={app.server + app.docs + '/'+ cvFile}
                             className="btn btn-primary btn-sm rounded m-1">
                              <i className="feather icon-download-cloud"/>
                          </a>
                        }
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-1"
                                onClick={this.handleDTDocumentsEdit}>
                            <i className='feather icon-edit'/>
                        </button>
                      </div>:
                      <button type="button"
                              className="btn btn-primary btn-sm rounded m-0 float-right"
                              onClick={this.handleDTDocumentsNew}>
                          <i className='feather icon-plus'/>
                      </button>
                    }

                </Card.Body>

                <DTDocuments
                    personDNI={this.props.personDNI}
                    isCurriculum={true}
                    handleClickSelectDocument = {this.handleClickSelectDocument}
                    ref={(ref) => this.DTDocuments = ref}/>


            </Card>
        )
    }
}
