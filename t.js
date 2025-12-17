// const s = {
//     id: 1,
//     key: 'shf'
// }

import axios from "axios";

// console.log(s)

// Object.assign(s, {key: "http://localhost:3453/"})

// console.log(s)


const response = await axios.get("http://localhost:5000/api/organizations/40")

console.log(response)