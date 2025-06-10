create database constructo;
use constructo;

create table projetos(
	id int auto_increment primary key,
    nome varchar(255) not null,
    data_criacao timestamp default current_timestamp,
    data_atualizacao timestamp default current_timestamp on update current_timestamp,
    dados JSON not null
);


INSERT INTO projetos (
  nome,
  data_criacao,
  data_atualizacao,
  dados
) VALUES
('casa1', '2025-04-25 17:11:17', '2025-06-06 16:54:03', '{"alturaParede":"3","tipoBloco":"concreto34x19x14","stack":[{"startX":160,"startY":80,"endX":160,"endY":440},{"startX":160,"startY":440,"endX":840,"endY":440},{"startX":840,"startY":440,"endX":840,"endY":80},{"startX":840,"startY":80,"endX":160,"endY":80},{"startX":160,"startY":240,"endX":300,"endY":240},{"startX":300,"startY":240,"endX":300,"endY":440},{"startX":300,"startY":320,"endX":420,"endY":320},{"startX":420,"startY":320,"endX":420,"endY":440},{"startX":420,"startY":320,"endX":420,"endY":80},{"startX":420,"startY":160,"endX":620,"endY":160},{"startX":420,"startY":280,"endX":640,"endY":280},{"startX":640,"startY":280,"endX":640,"endY":440},{"startX":640,"startY":280,"endX":760,"endY":280},{"startX":440,"startY":360,"endX":420,"endY":360},{"startX":440,"startY":360,"endX":560,"endY":360},{"startX":560,"startY":360,"endX":560,"endY":440},{"startX":720,"startY":80,"endX":720,"endY":200},{"startX":720,"startY":200,"endX":840,"endY":200}],"portasJanelas":[{"largura":"1","altura":"2","quantidade":"3"},{"largura":"1","altura":"2","quantidade":"4"},{"largura":"2","altura":"2","quantidade":"4"}]}'),
('casa2', '2025-04-25 17:12:30', '2025-04-25 17:12:30', '{"alturaParede":"3","tipoBloco":"concreto34x19x14","stack":[{"startX":160,"startY":160,"endX":160,"endY":420},{"startX":160,"startY":420,"endX":480,"endY":420},{"startX":480,"startY":420,"endX":480,"endY":280},{"startX":480,"startY":280,"endX":720,"endY":280},{"startX":720,"startY":280,"endX":720,"endY":160},{"startX":720,"startY":160,"endX":160,"endY":160},{"startX":480,"startY":160,"endX":480,"endY":280},{"startX":600,"startY":160,"endX":600,"endY":220},{"startX":600,"startY":220,"endX":720,"endY":220},{"startX":180,"startY":280,"endX":320,"endY":280},{"startX":320,"startY":280,"endX":320,"endY":420},{"startX":160,"startY":280,"endX":180,"endY":280},{"startX":320,"startY":320,"endX":480,"endY":320}],"portasJanelas":[{"largura":"2","altura":"2","quantidade":"4"}]}'),
('casa3', '2025-06-10 14:49:31', '2025-06-10 14:49:31', '{"alturaParede":"3","tipoBloco":"concreto34x19x14","stack":[{"startX":160,"startY":160,"endX":520,"endY":160},{"startX":520,"startY":160,"endX":520,"endY":400},{"startX":520,"startY":400,"endX":160,"endY":400},{"startX":160,"startY":400,"endX":160,"endY":160},{"startX":160,"startY":240,"endX":200,"endY":240},{"startX":240,"startY":240,"endX":360,"endY":240},{"startX":360,"startY":240,"endX":360,"endY":160},{"startX":240,"startY":160,"endX":240,"endY":240},{"startX":360,"startY":240,"endX":440,"endY":240},{"startX":440,"startY":240,"endX":440,"endY":160},{"startX":400,"startY":160,"endX":400,"endY":240},{"startX":440,"startY":240,"endX":440,"endY":280},{"startX":440,"startY":280,"endX":520,"endY":280},{"startX":360,"startY":280,"endX":440,"endY":280},{"startX":360,"startY":280,"endX":360,"endY":400},{"startX":320,"startY":280,"endX":360,"endY":280}],"portasJanelas":[{"largura":"1","altura":"2","quantidade":"6"},{"largura":"1","altura":"1","quantidade":"12"}]}');