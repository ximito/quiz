

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

2ª version

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

3ª version

// GET /quizes
exports.index = function (req,res){
  models.Quiz.findAll().success(function (quizes)){
    res.render('quizes/index.ejs',{quizes: quizes});
  })
};


// GET /quizes/:id
exports.show = function (req,res){
  models.Quiz.find.(req.param.quizId).then(function(quiz){
      res.render('quizes/show'),{quiz: quiz};
  })
};

// GET /quizes/:id/answer
exports.answer = function (req,res){
  models.Quiz.find.(req.param.quizId).then(function(quiz){
    if(req.query.respuesta === quiz.respuesta){
      res.render('quizes/answer',{quiz: quiz, respuesta: 'Correcto'});
    }else{
      res.render('quizes/answer',{quiz: quiz, respuesta: 'Incorrecto'});
    }
  })
};


*/

var models = require('../models/models.js');


//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function (req,res,next,quizId){
  models.Quiz.find(req.params.quizId).then(
      function(quiz){
        if(quiz){
          req.quiz = quiz;
          next();
        }else{
          next(new Error('No existe quizId=' + quizId));
        }
      }
  ).catch (function (error) {next(error);});
}

// GET /quizes
exports.index = function (req,res){
  models.Quiz.findAll().then(
    function (quizes){
      var i;
      for(i=0; i < quizes.length;i++){
        alert(quizes[i].pregunta);
      }
      res.render('quizes/index',{quizes: quizes});
    }
  ).catch (function (error) {next(error);});
};


// GET /quizes/:id
exports.show = function (req,res){
  res.render('quizes/show',{quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function (req,res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado});
};


exports.author = function (req,res){
  res.render('quizes/author',{author: 'Joaquin Pozo Torres'});
};
