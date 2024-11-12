describe('create tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
  })

  it('archives the completed tasks, hiding them from the list', () => {
    cy.get('button > svg.fa-caret-down').click()
    cy.get('button').contains('Archive All').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure that you want to archive all 2 completed tasks?')
      return true
    })
    cy.get('#completed-task-list').contains('My First Task').should('not.exist')
    cy.get('#completed-task-list').contains('My Second Task').should('not.exist')
  })
})
