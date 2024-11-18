describe('add tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('has a notes section with an edit button', () => {
    cy.get('#main-section').get('#notes-section').contains('Notes:')
    cy.get('#notes-section').get('button[title="Edit notes"]').get('svg.fa-pencil-alt')
  })

  it('clicks the edit button and a text area appears', () => {
    cy.get('#notes-section').get('button[title="Edit notes"]').click()
    cy.get('#notes-section').get('textarea')
    cy.get('#notes-section').get('button[title="Save notes"]').get('svg.fa-save')
  })

  it('fills the notes area with text and clicks save', () => {
    cy.get('#notes-section').get('button[title="Edit notes"]').click()
    cy.get('#notes-section').get('textarea').type('My notes for this task{enter}These notes are great')
    cy.get('#notes-section').get('button[title="Save notes"]').click()
  })
})
