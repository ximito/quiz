var models = require('../models/models.js');

//Autoload :id de comentarios
exports.load = function (req,res,next, commentId){
  models.Comment.find({
      where: {
        id: Number(commentId)
      }
    }).then(function(comment){
      if(comment){
        req.comment = comment;
        next();
      }else{
        next(new Error('No existe commentId=' + commentId))
      }
    }
  ).catch (function (error) {next(error)});
};


//GET /quizes/:quizId(\\d+)/comments/new
exports.new = function(req,res){
  res.render('comments/new.ejs',{quizId: req.params.quizId , errors: []});
};

//POST /quizes/:quizId(\\d+)/comments
exports.create = function(req,res){
  // crea el objeto comment
  var comment = models.Comment.build({texto: req.body.comment.texto, QuizId: req.params.quizId});

  comment.validate().then(
    function(err){
      if(err){
        res.render('comments/new.ejs', {comment: comment, quizId: req.params.quizId, errors: err.errors});
      }else{
        // guarda en BD
        comment.save().then(
          function(){
            // redireccion HTTP a lista de preguntas con url relativa
            res.redirect('/quizes/' + req.params.quizId);
          });
      }
    }
  ).catch (function (error) {next(error);});
};


exports.publish = function(req, res){
  req.comment.publicado = true;

  req.comment.save({fields: ["publicado"]})
    .then (function() { res.redirect('/quizes/' + req.params.quizId);})
    .catch(function(error){next(error)});
};
