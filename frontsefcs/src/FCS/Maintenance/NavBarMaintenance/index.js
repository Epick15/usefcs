import React, {Component} from 'react';
import {Col, Card, Tab, Collapse} from 'react-bootstrap';
import {Link} from "react-router-dom";


class NavBarMaintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            match: props.match,
            activateCollapse: 0,
            selectItem: "",
            masterModules: [
                {
                    id: 1,
                    name: "Academico",
                    module: "academic",
                    subModule: [
                        {
                            id: 1,
                            name: "Grados Academicos",
                            module: "academic-degree"
                        },
                        {
                            id: 2,
                            name: "Niveles de estudio",
                            module: "study-level"
                        },
                        {
                            id: 3,
                            name: "Tipos de actividades",
                            module: "activity-type"
                        },
                        {
                            id: 4,
                            name: "Actividades",
                            module: "activity"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Persona",
                    module: "person",
                    subModule: [
                        {
                            id: 1,
                            name: "Tipos de contratos",
                            module: "contract-type"
                        },
                        {
                            id: 2,
                            name: "Cargos",
                            module: "charge"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Contabilidad",
                    module: "accounting",
                    subModule: [
                        {
                            id: 1,
                            name: "Conceptos",
                            module: "concept"
                        },
                        {
                            id: 2,
                            name: "Catergoria concepto",
                            module: "category-concept"
                        },

                    ]
                },
                {
                    id: 4,
                    name: "General",
                    module: "general",
                    subModule: [
                        {
                            id: 1,
                            name: "Bancos",
                            module: "bank"
                        },
                        {
                            id: 2,
                            name: "Redes sociales",
                            module: "social-network"
                        },
                        {
                            id: 3,
                            name: "Tipos de documentos",
                            module: "document-type"
                        },
                        {
                            id: 4,
                            name: "Estado civil",
                            module: "civil-status"
                        },
                        {
                            id: 5,
                            name: "Materiales y Servicios",
                            module: "material"
                        },

                        {
                            id: 6,
                            name: "Unidades de medida",
                            module: "unit-measure"
                        },
                        {
                            id: 7,
                            name: "Tipos de unidades organicas",
                            module: "type-organic-unit"
                        },
                        {
                            id: 8,
                            name: "Tipos de edificaciones",
                            module: "type-building"
                        },
                        {
                            id: 9,
                            name: "Requisitos de inscripcón",
                            module: "requeriment-inscription"
                        },
                    ]
                }
            ]
        };
    }

    componentDidMount() {

        // let url = this.props.url.split('/')[2];
        console.log(this.props.url)

        // console.log(url)
        if (this.props.url !== undefined) {
            let url = this.props.url.replace('/master/', '');
            let id = 0;
            this.state.masterModules.map((r) => {
                r.subModule.map((m) => {
                    if (m.module === url) {
                        id = r.id

                    }
                })
            });
            this.setState({activateCollapse: id});

            document.getElementsByClassName(url)[0].style.background = 'none';
            document.getElementsByClassName(url)[0].style.color = '#6c757d';

            document.getElementsByClassName(url)[0].style.background = '#122f3e';
            document.getElementsByClassName(url)[0].style.color = 'white';
        }


    }

    collapseHandler = (activeKey) => {
        console.log(activeKey)
        if (this.state.activateCollapse === activeKey) {
            this.setState({activateCollapse: 0});
        } else {
            this.setState({activateCollapse: activeKey});
        }

    };
    selectedItem = (r) => {

        if (this.state.selectItem !== "") {
            document.getElementsByClassName("academic-degree")[0].style.background = 'none';
            document.getElementsByClassName("academic-degree")[0].style.color = '#6c757d';

            document.getElementsByClassName("academic-degree")[0].style.background = '#122f3e';
            document.getElementsByClassName("academic-degree")[0].style.color = 'white';

        } else {
            document.getElementsByClassName("academic-degree")[0].style.background = '#122f3e';
            document.getElementsByClassName("academic-degree")[0].style.color = 'white';

        }
        this.setState({selectItem: r})


    };

    render() {
        const {activateCollapse, masterModules} = this.state;


        return (


            <Col xs={12} sm={12} md={2} lg={2} xl={2}>

                <Tab.Container id="left-tabs-example" defaultActiveKey="all">
                    <div className='btn-page'>
                        {/*<Col xs={2} sm={2} md={2} lg={2} xl={2}>*/}
                        <Card className='task-board-left'>
                            <Card.Header>
                                <Card.Title as='h5'>OPERACIONES</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div className="task-right">
                                    {masterModules.map((r, i) => {
                                        return (
                                            <div key={i}>
                                                <div className="task-right-header-revision"
                                                     onClick={() => this.collapseHandler(i + 1)}
                                                     aria-controls="revision">
                                                    <span className="f-w-400" data-toggle="collapse">{r.name}</span>
                                                    <i className="fa fa-caret-down float-right m-t-5"/>
                                                </div>
                                                <Collapse in={activateCollapse === i + 1}>
                                                    <div className="taskboard-right-revision user-box" id='revision'>
                                                        {r.subModule.map((k, j) => {
                                                            // return (
                                                            //     <Nav.Link eventKey="all" key={j}
                                                            //               onClick={() => this.selectedItem(k.module)}
                                                            //               className={'button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary ' + k.module}>{k.name}</Nav.Link>
                                                            // )
                                                            return (
                                                                <Link to={"/master/" + k.module}
                                                                      key={j}

                                                                      className={'button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary ' + k.module}
                                                                >{k.name}</Link>
                                                            )
                                                        })}


                                                    </div>
                                                </Collapse>
                                            </div>
                                        )
                                    })}

                                </div>
                            </Card.Body>
                        </Card>
                        {/*</Col>*/}
                    </div>
                </Tab.Container>

            </Col>


        );
    }
}

export default NavBarMaintenance;
