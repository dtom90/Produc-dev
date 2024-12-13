describe('start task timer', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('starts a task timer and creates log', () => {
    // Arrange

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('button').contains('Activity Log').click()
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Started')
      cy.get('td').contains('Running')
    })
  })
})
