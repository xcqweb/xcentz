let auto = require('autocannon')

let token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXNlLnh1IiwicGFzc3dvcmQiOiIxMjM0NTYiLCJub3ciOjE1NTk1Mjk3NzcyMjUsImlhdCI6MTU1OTUyOTc3NywiZXhwIjoxNTU5NTMzMzc3fQ.31-ROzV7O1Dczzhj6l2DIEZ4pO85Gyqp1D2Gl9P8cPg'

async function autoFun(){
    let re = await auto({
        url:`https://localhost/api/xcentz/v1/users/menu?roleId=1&token=${token}`,
        connections:20
    })
    console.log(re)
}

autoFun()