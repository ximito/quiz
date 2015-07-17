

/*

1ª version

// GET /quizes/question
exports.question = function (req,res){
  res.render('quizes/question',{title: 'Quiz', pregunta: 'Capital de Italia'});
};

// GET /quizes/answer
exports.answer = function (req,res){
  if(req.query.respuesta === 'Roma'){
    res.render('quizes/answer',{title: 'Quiz', respuesta: 'Correcto'});
  }else{
    res.render('quizes/answer',{title: 'Quiz', respuesta: 'Incorrecto'});
  }

};

*/

var models = require('../models/models.js');

// GET /quizes/question
exports.question = function (req,res){
  models.Quiz.findAll().success(function (quiz)){
    res.render('quizes/question',{title: 'Quiz', pregunta: quiz[0].pregunta});
  })
};


// GET /quizes/answer
exports.answer = function (req,res){
  models.Quiz.findAll().success(function (quiz)){
    if(req.query.respuesta === quiz[0].respuesta){
      res.render('quizes/answer',{title: 'Quiz', respuesta: 'Correcto'});
    }else{
      res.render('quizes/answer',{title: 'Quiz', respuesta: 'Incorrecto'});
    }
  })
};

exports.author = function (req,res){
  res.render('quizes/author',{author: 'Joaquin Pozo Torres'});
};
