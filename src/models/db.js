const mysql = require('mysql')

let pollPool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password:'123456',
    database: 'nodemysql',
    debug: false
})

global.db = pollPool
pollDB = {}

pollDB.getPolls = ()=>{
    return   pollPool.query('SELECT * FROM polls', (err, polls)=>{
        if(err) throw(err)
        console.log(polls)
        return polls;
    })
    
}

module.exports = pollPool;