var models = require('../models/models.js');


//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function (req,res,next,quizId){
  models.Quiz.find(quizId).then(
      function(quiz){
        if(quiz){
          req.quiz = quiz;
          next();
        }else{
          next(new Error('No existe quizId=' + quizId));
        }
      }
  ).catch (function (error) {next(error);});
};

// GET /quizes
exports.index = function (req,res){

if (req.query.search) {
  var criterio = ('%' + req.query.search.trim() + '%').replace(/\s/g, '%');
  models.Quiz.findAll({where: ["pregunta like ?", criterio],order: 'pregunta ASC'}).then(
    function(quizes) {
      res.render('quizes/index', {quizes: quizes, search: req.query.search, errors: []});
    }
  ).catch(function(error) { next(error);});
}else {
  models.Quiz.findAll().then(
    function (quizes){
      res.render('quizes/index',{quizes: quizes, search: "", errors: []});
    }
  ).catch (function (error) {next(error);});
}

};


// GET /quizes/:id
exports.show = function (req,res){
  res.render('quizes/show',{quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function (req,res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/'+ req.quiz.id + '/answer',{quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/author
exports.author = function (req,res){
  res.render('quizes/author',{author: 'Joaquin Pozo Torres', errors: []});
};


//GET /quizes/new
exports.new = function(req,res){
  // crea el objeto quiz
  var quiz = models.Quiz.build(
    {pregunta:"Pregunta",respuesta: "Respuesta"}
  );
  res.render('quizes/new',{quiz:quiz , errors: []});
};

//POST /quizes/create
exports.create = function(req,res){
  // crea el objeto quiz
  var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate().then(
    function(err){
      if(err){
        res.render('/quizes/new', {quiz: quiz, errors: err.errors});
      }else{
        // guarda en BD los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta","respuesta"]}).then(
          function(){
            // redireccion HTTP a lista de preguntas con url relativa
            res.redirect('/quizes');
          });
      }
    }
  );
};

//GET /quizes/:id/edit
exports.edit = function(req,res){
  // autoload de instancia de quiz
  var quiz = req.quiz;
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req,res){

  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate().then(
    function(err){
      if(err){
        res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
      }else{
        // save: guarda campos pregunta y respuesta en BD
        req.quiz.save( {fields: ["pregunta","respuesta"]})
        // redireccion a lista de preguntas
        .then(function(){ res.redirect('/quizes');});
      }
    }
  );

};


//DELETE /quizes/:id/edit
exports.destroy = function(req,res){
  req.quiz.destroy().then(
    function(){
      res.redirect('/quizes');
    }
  ).catch(function(error){next(error)});
};
