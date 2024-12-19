describe('edit tags', () => {
  const firstTagName = 'my first tag'

  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(firstTagName + '{enter}')
  })

  it('should show tag in Tags menu', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Assert
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName)
    })
    cy.get('.btn-group > button.tag-name').contains(firstTagName)
  })

  it('should show tag in Tags menu even if removed from task', () => {
    // Arrange
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()

    // Act
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Assert
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName)
    })
  })

  it('should show tag in Tags menu even if removed from task after refresh', () => {
    // Arrange
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()

    // Act
    cy.reload()

    // Assert
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName)
    })
  })

  it('should edit the tag name', () => {
    // Arrange
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Act
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName).click()
      cy.get('#tag-menu input[title="Rename tag"]').type(' updated' + '{enter}')
    })

    // Assert
    cy.get('.btn-group > button.tag-name').contains(firstTagName + ' updated')
  })
})
