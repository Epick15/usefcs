import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./style.css";

function StudyCertificate(props) {
    let data = props.dataCert;

    let student = data.studentData.Person.name;
    // let photo = data.studentData.Person.photo;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let totalCredit = data.totalCredit;
    let averageScore = data.averageScore;
    // let observation = data.observation;
    let correlative = data.correlative;
    let date = data.date;
    let principalOrganicUnit = data.principalOrganicUnit.description;
    // let certyAbbreviation = data.principalOrganicUnit.abbreviation;
    // let authorityTypeAname = data.authorityTypeA.person;
    // let authorityTypeAcharge = data.authorityTypeA.charge;
    // let authorityTypeGname = data.authorityTypeG.person;
    // let authorityTypeGcharge = data.authorityTypeG.charge;

    let record = data.dataRegistration.map((e) => {
        let d = [];
        if (e[2] !== "") {
            const [markNumber, markLetter] = e[2].split(" ");
            d = [e[0], e[1], markNumber, markLetter, e[3]];
        } else {
            d = [e[0], "", "", "", ""];
        }
        return d;
    });

    useEffect(() => {
        window.print();
    }, [data]);

    return (
        <>
            {createPortal(
                <div className="print-page">
                    <div className="row">
                        <div className="col correlative">N° {correlative}-FCS-SE</div>
                    </div>
                    <div className="row">
                        <div className="col mb-3 cert-name">
                            CERTIFICADO DE ESTUDIOS
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className="cert-text">
                                La Dirección de Asuntos Académicos de la
                                Universidad Nacional de San Martín,{" "}
                                <span className="font-weight-bold">
                                    CERTIFICA
                                </span>{" "}
                                que{" "}
                                <span className="font-weight-bold">
                                    {student}
                                </span>{" "}
                                con código de matrícula{" "}
                                <span className="font-weight-bold">{dni}</span>,
                                ha realizado estudios en la Facultad de Ciencias
                                de la Salud en el{" "}
                                <span className="font-weight-bold">
                                    Programa de {program}
                                </span>
                                , habiendo aprobado los siguientes cursos:
                            </p>
                        </div>
                    </div>
                    <div className="row" style={{ flexGrow: 1 }}>
                        <div className="col h-100">
                            <div className="table-container h-100">
                                <table className="table table-borderless table-sm table-asign">
                                    <thead>
                                        <tr className="tr1">
                                            <th rowSpan={2}>ASIGNATURA</th>
                                            <th rowSpan={2}>CRÉDITOS</th>
                                            <th colSpan={2}>CALIFICACIONES</th>
                                            <th rowSpan={2}>AÑO</th>
                                        </tr>
                                        <tr className="tr2">
                                            <th>NÚMERO</th>
                                            <th>LETRA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {record.map((e, k) => {
                                            return (
                                                <tr key={k}>
                                                    <td>
                                                        {e[1] === "" ? (
                                                            <span className="font-weight-bold">
                                                                {e[0]}
                                                            </span>
                                                        ) : (
                                                            <span>{e[0]}</span>
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                            borderLeft:
                                                                "2.5px solid black",
                                                        }}
                                                    >
                                                        {e[1]}
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                            borderLeft:
                                                                "2.5px solid black",
                                                        }}
                                                    >
                                                        {e[2]}
                                                    </td>
                                                    <td
                                                        style={{
                                                            borderLeft:
                                                                "2.5px solid black",
                                                        }}
                                                    >
                                                        {e[3]}
                                                    </td>
                                                    <td
                                                        style={{
                                                            borderLeft:
                                                                "2.5px solid black",
                                                        }}
                                                    >
                                                        {e[4]}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="tr-info">
                                            <td colSpan={5}>
                                                <div className="d-flex justify-content-between">
                                                    <span>
                                                        <span className="text-title">
                                                            CRÉDITOS
                                                            OBLIGATORIOS:
                                                        </span>{" "}
                                                        {totalCredit}
                                                    </span>
                                                    <span>
                                                        <span className="text-title">
                                                            CRÉDITOS ELECTIVOS:
                                                        </span>{" "}
                                                        0
                                                    </span>
                                                    <span>
                                                        <span className="text-title">
                                                            PROMEDIO CRÉDITOS
                                                            APROBADOS:
                                                        </span>{" "}
                                                        {averageScore}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="tr-obs">
                                            <td colSpan={5}>
                                                <span className="text-title">
                                                    OBSERVACIONES:
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="tr-firms">
                                            <td
                                                colSpan={5}
                                                style={{ fontSize: "10pt" }}
                                            >
                                                <div>
                                                    Así como consta en los
                                                    libros y actas de notas, de
                                                    la {principalOrganicUnit} a
                                                    las que me remito en caso
                                                    necesario.
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span
                                                        style={{
                                                            fontSize: "12pt",
                                                        }}
                                                    >
                                                        ESCALA DE CALIFICATIVOS:
                                                        0-13 Desaprobado, 14-20
                                                        Aprobado.
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "12pt",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Tarapoto {date}
                                                    </span>
                                                </div>
                                                <div
                                                    className="row"
                                                    style={{
                                                        marginBottom: "10mm",
                                                    }}
                                                >
                                                    <div className="col-auto">
                                                        <div className="photo"></div>
                                                    </div>
                                                    <div className="col-auto autority-container">
                                                        <div className="autority-name px-3">
                                                            {/* {authorityTypeAname} */}
                                                            ING. M. SC. JORGE
                                                            DAMIÁN VALVERDE
                                                            IPARRAGUIRRE
                                                        </div>
                                                        <div className="autority-title">
                                                            DIRECTOR
                                                        </div>
                                                        <div className="autority-of">
                                                            Dirección de Asuntos
                                                            Académicos
                                                        </div>
                                                    </div>
                                                    <div className="col autority-container d-flex justify-content-center">
                                                        <div>
                                                            <div className="autority-name px-3">
                                                                {/* {authorityTypeGname} */}
                                                                OBSTA. DRA.
                                                                EVANGELINA
                                                                AMPUERO
                                                                FERNÁNDEZ
                                                            </div>
                                                            <div className="autority-title">
                                                                DECANA
                                                            </div>
                                                            <div className="autority-of">
                                                                {/* {
                                                                authorityTypeGcharge
                                                            } */}
                                                                Facultad de
                                                                Ciencias de la
                                                                Salud
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default StudyCertificate;
