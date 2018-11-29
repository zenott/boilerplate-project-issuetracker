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

  
    
  app.route('/valami')
      .get(function (req, res){
        res.send('valami');  
      });
      
  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      res.json('get');
    })

    .post(function (req, res){
      var project = req.params.project;
      var currTime = new Date;
    
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
              if (req.body.open) objForUpdate.open = req.body.open;
              if (Object.keys(objForUpdate).length===0) {
                res.json('no updated field sent');
                return;
              }
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