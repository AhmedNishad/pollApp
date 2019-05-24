const mysql = require('mysql')

let pollPool = mysql.createPool({
    connectionLimit: 100,
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12293079',
    password:'czXF5H5cY5',
    database: 'sql12293079',
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