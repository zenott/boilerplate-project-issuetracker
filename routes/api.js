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
      res.json('put');
    })

    .delete(function (req, res){
      var project = req.params.project;
      res.json('del');
    });
    
  
}