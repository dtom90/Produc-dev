describe('start task timer', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('skips timer goes to break', () => {
    // Arrange
    cy.get('#timer-display').contains('25:00')

    // Act
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()

    // Assert
    cy.get('#timer-display').contains('5:00')
  })

  it('skips timer twice, goes to back to active timer', () => {
    // Arrange
    cy.get('#timer-display').contains('25:00')

    // Act
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()

    // Assert
    cy.get('#timer-display').contains('25:00')
  })
  
  it('skips timer during interval, should stop log', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.1{enter}')
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:05')
    cy.get('#countdown-container').contains('0:04')
    cy.get('#countdown-container').contains('0:03')
    
    // Act
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()
    
    // Assert
    cy.get('#timer-display').contains('5:00')
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Stopped')
    })
  })
})
