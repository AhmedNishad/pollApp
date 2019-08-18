const mysql = require('mysql')

let pollPool = mysql.createPool({
    connectionLimit: 100,
    host: 'remotemysql.com',
    user: 'rRNW0EltG5',
    password:'xRDvYGveLu',
    database: 'rRNW0EltG5'
})

pollPool.on('connection', (connection)=>{
})

global.db = pollPool
pollDB = {}

pollDB.getPolls = ()=>{
    return   pollPool.query('SELECT * FROM polls', (err, polls)=>{
        if(err) throw(err)
        return polls;
    })
    
}

module.exports = pollPool;