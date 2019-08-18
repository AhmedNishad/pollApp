const express = require('express');
const db = require('../models/db')
const router = express.Router()
const {sanitizeBody} = require('express-validator/filter')
const {body} = require('express-validator/check')

router.get('/', (req,res)=>{
    if(!req.query.offset){
        req.query.offset = 0;
    }
    if(!req.session.voted){
        req.session.voted = []
    }
    if(!req.session.errors){
        req.session.errors = ''
    }
    
    db.query('SELECT * FROM polls ORDER BY data_created ASC', (err,polls)=>{
        let endBool = false;
        let defaultOffset = parseInt(req.query.offset,10); 
        if(!polls){
            console.log('No polls exist')
            res.render('index', {polls: [],errors:'There are no polls as of yet', offset:1});
        }else{
            let offsettedPolls = []
            if(defaultOffset == 0){
                offsettedPolls =  polls.slice(0,5)
            }else{
                offsettedPolls =  polls.slice(parseInt(req.query.offset,10)*5,parseInt(req.query.offset,10)*5 + 5)
            }
            //let defaultOffset = parseInt(req.query.offset,10) + 1
            
            if(parseInt(req.query.offset,10)*5 + 5 > polls.length){
                req.session.errors='End of Polls!'
                defaultOffset = parseInt(req.query.offset,10)
                endBool = true
                console.log(defaultOffset)
            }
            /* if(defaultOffset<0){
                defaultOffset = 1
            } */
                res.render('index', {polls: offsettedPolls,offset: defaultOffset, errors:req.session.errors, end:endBool});
            
            req.session.errors = ''
            req.session.save(err=>{
                if(err) throw(err)
            })
        }
    })
})



router.post('/', [
    sanitizeBody('*').trim().escape(),
    (req,res,next)=>{
        console.log(req.body)
        let query = `INSERT INTO polls (poll_name ,poll_1 ,poll_2, poll_description, data_created) 
        VALUES('${req.body.poll_name}','${req.body.poll_1}','${req.body.poll_2}','${req.body.poll_description}',curdate())`
        db.query(query, (err, success)=>{
            if(err) throw(err)
             res.redirect('/polls');
        })
    }
])

router.get('/:id', (req,res)=>{
    let query = `SELECT * FROM polls WHERE id=${req.params.id}`;
    db.query(query, (err, polls)=>{
        console.log(polls[0])
        return res.render('poll', {poll: polls[0], errors:req.session.errors})
    })
})

const hasntVoted = (req,res, next)=>{
    if(req.session.voted != []){
        let votes = req.session.voted
        votes.forEach(vote => {
            if(req.params.id == vote.id){
                if(req.query.vote == vote.item){
                    req.session.errors = 'Already Voted'
                }else{
                    req.session.errors = 'Voted on Other'
                }
            }
        });
    }
    return next()
}

router.get('/:id/vote', hasntVoted,(req,res)=>{
    const {vote_count, vote} = req.query
    let query = `UPDATE polls SET poll_${req.query.vote}_votes=${parseInt(req.query.vote_count,10) + 1} WHERE id=${req.params.id}`
    const {errors} = req.session;
    if(errors!='Already Voted'){
        if(errors=='Voted on Other'){
            let alreadyVote = 1;
            if(vote == 1){
                alreadyVote = 2
            }else{
                alreadyVote = 1
            }
            db.query(`SELECT poll_${alreadyVote}_votes FROM polls WHERE id=${req.params.id}`, (err,votes)=>{
                if(err) throw(err)
                
                let voteCount = 0
                if(votes[0]['poll_1_votes']){
                    voteCount = votes[0].poll_1_votes
                }else{
                    voteCount = votes[0].poll_2_votes
                }
                let updateQuery = `UPDATE polls SET poll_${req.query.vote}_votes=${parseInt(req.query.vote_count,10) + 1},
                                            poll_${alreadyVote}_votes=${voteCount-1} WHERE id=${req.params.id}`
                db.query(updateQuery, (err,success)=>{
                    if(err) throw(err)
                    req.session.errors = ''
                    let voted = req.session.voted
                    for(let i =0; i<voted.length; i++){
                        
                        if(voted[i].item == alreadyVote){
                            req.session.voted.splice(i,1)
                        }
                    } 
                    req.session.voted.push({id: req.params.id, item: req.query.vote })
                    req.session.save((err)=>{
                    if(err) throw(err)
                    })
                
                     /* res.redirect('/polls'); */
                })
            })
            
            
        }else{
        db.query(query, (err, success)=>{
            req.session.voted.push({id: req.params.id, item: req.query.vote })
            req.session.save((err)=>{
                if(err) throw(err)
            })
        }) 
        }
    }
    res.redirect(`/polls/${req.params.id}`);
})

router.get('/:id/update')


module.exports = router