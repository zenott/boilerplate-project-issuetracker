/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; 

module.exports = function (app) {

      
  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) {
          console.log(err);
        } else {
          console.log('Connected to database');
          let objFind={};
          if (req.query.issue_title) objFind.issue_title = req.query.issue_title;
          if (req.query.issue_text) objFind.issue_text = req.query.issue_text;
          if (req.query.created_by) objFind.created_by = req.query.created_by;
          if (req.query.assigned_to) objFind.assigned_to = req.query.assigned_to;
          if (req.query.status_text) objFind.status_text = req.query.status_text;
          if (req.query.issue_title) objFind.issue_title = req.query.issue_title;
          if (req.query.created_on) objFind.created_on = req.query.created_on;
          if (req.query.updated_on) objFind.updated_on = req.query.updated_on;
          if (req.query.open==='true') objFind.open = true;
          if (req.query.open==='false') objFind.open = false;
          
          db.collection(project).find(objFind).toArray(function(err, docs) {
            if(err) {
              console.log(err);
            } else {
              res.json(docs);
            }
          })
        }
      });
    })

    .post(function (req, res){
      var project = req.params.project;
      var currTime = new Date;
    
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json('missing required field');
        return;
      }
    
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) {
          console.log(err);
        } else {
          console.log('Connected to database');

          db.collection(project).insertOne({
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to || '',
            status_text: req.body.status_text || '',
            created_on: currTime,
            updated_on: currTime,
            open: true,
          },(err,doc) => {
            if(err) {
              console.log(err);
            } else {        

              res.json({
                _id: doc.insertedId,
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                created_by: req.body.created_by,
                assigned_to: req.body.assigned_to || '',
                status_text: req.body.status_text || '',
                created_on: currTime,
                updated_on: currTime,
                open: true,
              });
            }
          });
        }
      })
    })

    .put(function (req, res){
      var project = req.params.project;
      var id=req.body._id;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) {
          console.log(err);
        } else {
          console.log('Connected to database');
          if(!MongoClient.ObjectID.isValid(id)){
            res.json('could not update '+id);
            return;
          }
          db.collection(project).findOne({_id: ObjectId(id)}, function(err, issue){
            if(err) {
              res.json('could not update '+id);
              return;
            } else{
              if(!issue){
                res.json('could not update '+id);
                return;
              }
              let objForUpdate={};
              if (req.body.issue_title) objForUpdate.issue_title = req.body.issue_title;
              if (req.body.issue_text) objForUpdate.issue_text = req.body.issue_text;
              if (req.body.created_by) objForUpdate.created_by = req.body.created_by;
              if (req.body.assigned_to) objForUpdate.assigned_to = req.body.assigned_to;
              if (req.body.status_text) objForUpdate.status_text = req.body.status_text;
              if (req.body.issue_title) objForUpdate.issue_title = req.body.issue_title;
              if (req.body.open===false || req.body.open==='false') objForUpdate.open = false;
              if (Object.keys(objForUpdate).length===0) {
                res.json('no updated field sent');
                return;
              }
              if (req.body.open===true || req.body.open==='true') objForUpdate.open = true;
              objForUpdate.updated_on = new Date;
              
              db.collection(project).updateOne({_id: ObjectId(id)},{ $set: objForUpdate }, function(err, doc){
                if (err) {
                  console.log(err);
                } else{
                  res.json('successfully updated '+id);
                }
              });
            }
          })
        }
      });
    })

    .delete(function (req, res){
      var project = req.params.project;
      var id=req.body._id;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
          if(err) {
            console.log(err);
          } else {
            console.log('Connected to database');
            if(!MongoClient.ObjectID.isValid(id)){
              res.json('could not delete '+id);
              return;
            }
            db.collection(project).deleteOne({_id: ObjectId(id)}, function(err, doc){
              if(err) {
                console.log(err);
                res.json('could not delete '+id);
              } else{
                if(doc.deletedCount===0){
                  res.json('could not delete '+id);
                } else {
                  res.json('deleted '+id);
                }
              }
            });
          }
      });
    });
    
  
}