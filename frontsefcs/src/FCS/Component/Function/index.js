import React, {Component} from "react";
import app from "../../Constants";
import axios from "axios";


const searchTA = async (params) => {
    try {
        if (params !== '') {
            const url = app.person + '/search-person-ta' + params;
            const res = await axios.get(url, app.headers);
            return res;
        } else {
            return null
        }
    } catch (err) {
        console.log('We have the error', err);
        return err;
    }
};
const Componet = {
    searchTA,
};
export default Componet;





