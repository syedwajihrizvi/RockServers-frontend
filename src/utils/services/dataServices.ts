import axios from "axios"

const url = "http://localhost:5191/api"

const client = axios.create({
    baseURL: url,
})

export default client