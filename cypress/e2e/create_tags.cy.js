describe('create tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type('my tag{enter}')
  })

  it('adds a tag to the first task', () => {
    cy.get('div.tag.btn-group').contains('my tag')
  })

  it('selects previous tag to the second task', () => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('#tagDropdownMenu > button').contains('my tag').click()
    cy.get('div.tag.btn-group').contains('my tag')
  })
})
