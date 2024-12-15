describe('interval updates', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })
  
  it('should manually add an interval', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()
    
    // Act
    cy.get('.activity-view button > svg.fa-plus').click()
    cy.get('.activity-view button').contains('Add Interval').click()
    
    // Assert
    cy.get('tr').last().within(() => {
      cy.get('td').contains('Time Spent: 25 minutes')
    })
  })
})
