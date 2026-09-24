import React, {Component} from 'react';


export default class DataTableRecords extends Component {


    render() {
        const {records} = this.props;

        return (
            records.length > 0 ?
                records.map((record, index) => {
                    return (
                        <>
                            <tr key={index}>
                                <td>{record.Type_organic_unit.denomination}</td>
                                <td>{record.denomination}</td>
                                <td className="text-right"><label
                                    onClick={() => this.handleNewChildrenOrganit(record)}
                                    className="badge badge-light-primary">Añadir</label>
                                </td>

                            </tr>
                            {
                                record.Organic_unit_chilldren.length > 0 ?
                                    records.map((record, index) => {
                                        return (
                                            <tr key={record.id}>
                                                <td>{record.Type_organic_unit.denomination}</td>
                                                <td>{record.denomination}</td>
                                                <td className="text-right"><label
                                                    onClick={() => this.handleNewChildrenOrganit(record)}
                                                    className="badge badge-light-primary">Añadir</label>
                                                </td>
                                            </tr>

                                        )
                                    }) : ''


                            }

                        </>
                    )
                })
                :
                <tr>
                    <td>no hay data</td>
                </tr>
        );
    }
}
