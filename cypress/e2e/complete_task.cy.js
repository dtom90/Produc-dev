describe('complete task', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })
  
  it('should stop timer when task completed', () => {
    // Arrange
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.1{enter}')
    cy.get('button > svg.fa-cog').click()
    cy.get('.form-check').contains('Continue Timer when Interval Complete').click()
    cy.get('button').contains('Activity Log').click()
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:06')
    cy.get('#countdown-container').contains('0:05')
    cy.get('#countdown-container').contains('0:04')
    cy.get('#countdown-container').contains('0:03')

    // Act
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').click()

    // Assert
    cy.get('tr').last().within(() => {
      cy.get('td').contains('Stopped')
    })
  })
  
})
