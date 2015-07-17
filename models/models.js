var path = require('path');

// Postgres DATABASE_URL = postgres:/user:pass@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD sqlite
var sequelize = new Sequelize(DB_name,user,pwd,
  {
    dialect : protocol,
    protocol: protocol,
    port    : port,
    host    : host,
    storage : storage, // Solo SQLite (.env)
    omitNull: true          // solo Postgres
  }
);

// Importar la definicion de la tabla de Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// exportar la definicion de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e instancia tabla de preguntas en BBDD
sequelize.sync().success(function (){
  // success(..) ejecuta el manejador una vez creada la Tabla
  Quiz.count().success(function (count){
    // la tabla se inicializa si esta vacia
    if(count==0){
      Quiz.create({
          pregunta: 'Capital de Italia',
          respuesta: 'Roma'
        })
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
