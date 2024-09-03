import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { IUserResponse } from '../../../src/interfaces/IUserResponse';
import { UserRepository } from '../../../src/endpoints/users/userRepository';

// Cria uma instância da aplicação para executar os testes
const app = new App().server.listen(8081);

describe('UserController', () => {
  afterAll((done) => {
    // Fechar o servidor após os testes
    app.close(done);
  });
  describe('TESTES DE LIST', () => {
  
    
  // LIST
  it('Deve retornar a lista de usuários corretamente', async () => {
    const mockUsers: IUser[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
      },
      {
        id: 2,
        name: 'Sasuke',
        age: 18,
      },
      {
        id: 3,
        name: 'Kakashi',
        age: 50,
      },
    ];

    const expectedUsers: IUserResponse[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
        isOfAge: false,
      },
      {
        id: 2,
        name: 'Sasuke',
        age: 18,
        isOfAge: true,
      },
      {
        id: 3,
        name: 'Kakashi',
        age: 50,
        isOfAge: true,
      },
    ];

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  });

  it('Deve retornar a corretamente a lista de usuarios quando nao houver itens', async () => {
    const mockUsers: IUser[] = [];

    const expectedUsers: IUserResponse[] = [];

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  });
  it('Deve retornar a corretamente a lista de usuarios quando so houver um item', async () => {
    const mockUsers: IUser[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
      },
    ];

    const expectedUsers: IUserResponse[] = [
      {
        id: 1,
        name: 'Naruto',
        age: 10,
        isOfAge: false,
      },
    ];

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(mockUsers);

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUsers);
  });
});
describe('TESTES DE GETONE', () => {
  
  // GET ONE
  it('Deve retornar a corretamente UM USUARIO', async () => {
    const mockUser: IUser = 
      {
        id: 1,
        name: 'Naruto',
        age: 10
      };

    const expectedUser: IUserResponse = 
      {
        id: 1,
        name: 'Naruto',
        age: 10,
        isOfAge: false,
      };

    jest.spyOn(UserRepository.prototype, 'findOne').mockReturnValueOnce(mockUser);

    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(expectedUser);
  });
  it('Deve retornar 404 quando o usuário não for encontrado', async () => {
    // Mock da função findOne para retornar undefined (usuário não encontrado)
    jest.spyOn(UserRepository.prototype, 'findOne').mockReturnValueOnce(undefined);

    const response = await request(app).get('/users/999'); // Um ID que não existe
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Usuário não encontrado');

    jest.restoreAllMocks(); 
    // solução para o erro: Jest did not exit one second after the test run has completed.
    // 'This usually means that there are asynchronous operations that weren't 
    // stopped in your tests. Consider running Jest with `--detectOpenHandles` 
    // to troubleshoot this issue.
  });
});
describe('TESTES DE CREATE', () => {
  
// TESTA CREATE
it('Deve criar um usuário com sucesso', async () => {
  const newUser = { id: 1, name: 'Naruto', age: 10 };
  
  // Mock do método save para retornar um resultado verdadeiro
  jest.spyOn(UserRepository.prototype, 'save').mockReturnValueOnce(true);

  const response = await request(app).post('/users').send(newUser);

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBe('Usuário criado com sucesso');

  jest.restoreAllMocks(); // Restaura todos os mocks após o teste
});

it('Deve retornar 500 quando falhar ao criar o usuário', async () => {
  const newUser = { id: 1, name: 'Naruto', age: 10 };

  // Mock do método save para retornar um resultado falso
  jest.spyOn(UserRepository.prototype, 'save').mockReturnValueOnce(false);

  const response = await request(app).post('/users').send(newUser);

  expect(response.status).toBe(500);
  expect(response.body.success).toBe(false);
  expect(response.body.data).toBe('Falha ao criar o usuário');

  jest.restoreAllMocks(); // Restaura todos os mocks após o teste
});
});
describe('TESTES DE DELETE', () => {
  
// TESTA DELETE
it('Deve excluir um usuário com sucesso', async () => {
  // Mock do método delete para retornar um resultado verdadeiro
  jest.spyOn(UserRepository.prototype, 'delete').mockReturnValueOnce(true);

  const response = await request(app).delete('/users/1'); // ID do usuário a ser excluído

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBe('Usuário excluído com sucesso');

  jest.restoreAllMocks(); // Restaura todos os mocks após o teste
});

it('Deve retornar 500 quando falhar ao excluir o usuário', async () => {
  // Mock do método delete para retornar um resultado falso
  jest.spyOn(UserRepository.prototype, 'delete').mockReturnValueOnce(false);

  const response = await request(app).delete('/users/1'); // ID do usuário a ser excluído

  expect(response.status).toBe(500);
  expect(response.body.success).toBe(false);
  expect(response.body.data).toBe('Falha ao remover o usuário');

  jest.restoreAllMocks(); // Restaura todos os mocks após o teste
});
});
});