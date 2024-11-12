describe('create tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('creates a task', () => {
    cy.get('#incomplete-task-list').contains('My First Task')
    cy.get('#main-section').contains('My First Task')
    cy.get('#main-section').contains('Tags:')
    cy.get('#main-section').contains('Notes:')
    cy.get('#main-section').contains('25:00')
  })

  it('completes the task by checking middle section', () => {
    cy.get('#selected-task-container input[type="checkbox"][title="Mark task complete"]').click()
    cy.get('#completed-task-list').contains('My First Task')
  })

  it('completes the task by checking incomplete list', () => {
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').click()
    cy.get('#completed-task-list').contains('My First Task')
  })
})
