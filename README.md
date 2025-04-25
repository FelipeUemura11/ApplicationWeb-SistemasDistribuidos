Projeto de Sistemas Distribuídos - Sistema Colaborativo Multifuncional
1. Introdução
Este projeto tem como objetivo o desenvolvimento de uma aplicação web colaborativa que 
integra três funcionalidades principais: Lista de Tarefas Compartilhadas, Chat em Tempo 
Real e Agenda Colaborativa. A proposta será implementada com base nos princípios 
fundamentais dos sistemas distribuídos, como escalabilidade, transparência, concorrência, 
flexibilidade e confiabilidade.

2. Objetivo
Desenvolver uma aplicação funcional e acessível via navegador, permitindo que múltiplos 
usuários interajam simultaneamente em um ambiente colaborativo, realizando atividades 
como:
- Criação e edição de tarefas em uma lista compartilhada;
- Comunicação via chat em tempo real;
- Marcação de eventos em uma agenda colaborativa.

3. Tecnologias Utilizadas
Para garantir uma implementação prática dos conceitos de sistemas distribuídos, serão 
utilizadas as seguintes tecnologias:
- Frontend: React.js ou HTML/CSS/JavaScript simples (para foco didático);
- Backend: Node.js com Express (API REST e WebSocket);
- Banco de dados: Firebase Realtime Database (para dados sincronizados em tempo real);
- Nuvem pública: Firebase Hosting e/ou Render para deploy do backend;
- Comunicação em tempo real: Firebase ou Socket.IO para o chat;
- Autenticação: Firebase Authentication ou login simplificado com sessão.

4. Arquitetura Proposta
O sistema será dividido em três módulos conectados a um backend centralizado, com banco 
de dados na nuvem. O frontend acessa os dados e funcionalidades via API REST e eventos 
WebSocket, garantindo atualização em tempo real. Todos os dados são armazenados e 
sincronizados em tempo real por meio do Firebase.

5. Equipe de Desenvolvimento
A equipe responsável pelo desenvolvimento do projeto é composta por:
- Rafael Seidi Yamashiro Sato
- Felipe Yukiya Soares Uemura
- Eduardo Farias Camargo
- Ícaro Gabriel Andrade Santos

6. Conclusão
O sistema colaborativo multifuncional proposto representa uma aplicação prática e 
acessível dos conceitos de sistemas distribuídos. Sua estrutura modular e distribuída 
garante maior resiliência, escalabilidade e experiência do usuário em ambientes 
colaborativos remotos
