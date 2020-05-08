// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
    beforeEach(()=>{
        cy.visit('http://localhost:8080/test')
    })
    it('Contain first', () => {
        cy.contains('h1', 'First test')
    })
    it('Contain second', () => {
        cy.contains('p', 'Second test')
    })
    it('Contain thirth', () => {
        cy.contains('button', 'Thirth test')
    })
})

//все в одному файл чи в різних
//як правильно запускати
//що перевіряти/тестити

//створити на ui простий інпут з кнопкою сабміт, спробувати коли нажимаєш на кнопку щоб тест вертав дані