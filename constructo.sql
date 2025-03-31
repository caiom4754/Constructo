create database constructo;
use constructo;

create table projetos(
	id int auto_increment primary key,
    nome varchar(255) not null,
    data_criacao timestamp default current_timestamp,
    data_atualizacao timestamp default current_timestamp on update current_timestamp,
    dados JSON not null
);
 
