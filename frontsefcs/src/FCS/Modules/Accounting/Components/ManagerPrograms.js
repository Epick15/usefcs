import React, {Component} from 'react';
import axios from 'axios';
import Select from 'react-select';
import app from '../../../Constants';
import {Tooltip} from "@material-ui/core";
import {Card, Row, Col, Button,} from 'react-bootstrap';

export default class ManagerPrograms extends Component{
  state={
    program: this.props.selcetedProgram.denomination||'No def.',
    programID: this.props.selcetedProgram.id,
    mentions:[],
    mentionID:'',
    sizeSelectMention:12,
    semesters:[],

  };

  componentDidMount(){
    this.getMentions();
  };

  getMentions = () =>{
    const url = app.programs + '/' + app.mentionByProgram + '/' + this.state.programID;
    axios.get(url,app.headers).then(res=>{
      if(res.data){
        res.data.map((record,index)=>
        this.state.mentions.push({
          value: record.id,
          label: record.denomination,
        })
      );
      }
    }).catch(err=>{console.log(err)})
  }

  handleChange = field => event => {
      switch (field) {
          case 'mentionID':
              this.setState({mentionID:event.value, sizeSelectMention:6});
              this.getSemester(event.value);
              break;
          default:
              break;
      }
  };

  getSemester = id =>{
    const url= app.programs + '/' + app.semesterByMention + '/' + id;
    axios.get(url,app.headers).then(res=>{

    }).catch(err=>{
      console.log(err)
    }) 
  }




  render(){
    const {mentions, semesters} = this.state;
    const {program, sizeSelectMention} = this.state;
    return(
        <Card>
          <Card.Body>
          <Row>
            <Col lg={3} md={3} sm={12} xs={12}>
              <Tooltip title={"Volver"}>
                <Button className='btn-icon btn-rounded' variant='primary' onClick={this.props.gotoIndex}>
                  <i className="material-icons">keyboard_arrow_left</i>
                </Button>
              </Tooltip>
              &emsp;{program.toUpperCase()}
            </Col>
            <Col lg={6} md={6} sm={12} xs={12}></Col>
            <Col lg={3} md={3} sm={12} xs={12}>
              <Tooltip title={"Plan Curricular"}>
                <Button className='btn-icon btn-rounded' variant='warning' style={{marginLeft:'0.2em'}}>
                  <i className="material-icons">work</i>
                </Button>
              </Tooltip>
              <Tooltip title={"Asignar Semestre"}>
                <Button className='btn-icon btn-rounded' style={{backgroundColor:'blue', border:'none',marginLeft:'0.2em'}} >
                  <i className="material-icons">timer</i>
                </Button>
              </Tooltip>
              <Tooltip title={"Costos"}>
                <Button className='btn-icon btn-rounded' style={{backgroundColor:'green', border:'none',marginLeft:'0.2em'}} >
                  <i className="material-icons">monetization_on</i>
                </Button>
              </Tooltip>
              <Tooltip title={"Registrar Mención"}>
                <Button className='btn-icon btn-rounded' variant='primary' style={{marginLeft:'0.2em'}}>
                  <i className="material-icons">book</i>
                </Button>
              </Tooltip>
              <Tooltip title={"Cursos"}>
                <Button className='btn-icon btn-rounded' style={{backgroundColor:'purple', border:'none',marginLeft:'0.2em'}} >
                  <i className="material-icons">library_books</i>
                </Button>
              </Tooltip>
            </Col>
          </Row>
          <Row style={{marginTop:'25px'}}>
            <Col lg={sizeSelectMention} md={sizeSelectMention} sm={12} xs={12}>
              <Select
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={this.handleChange('mentionID')}
                  name="mention"
                  options={mentions}
                  placeholder="Seleccione una mención para continuar"
              />
            </Col>
            {sizeSelectMention === 6 &&
              <Col lg={6} md={6} sm={12} xs={12}>
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={this.handleChange('semesterID')}
                    name="semester"
                    options={semesters}
                    placeholder="Seleccione un semestre de la mención"
                />
              </Col>
            }
          </Row>
        </Card.Body>
      </Card>
    )
  }
}
