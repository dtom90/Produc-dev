describe('create tasks', () => {
  const firstTagName = 'my first tag'
  const secondTagName = 'my second tag'

  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(firstTagName + '{enter}')
  })

  it('adds a tag to the first task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    // (No specific action needed for this test)

    // Assert
    cy.get('div.tag.btn-group').contains(firstTagName)
  })

  it('selects previous tag to the second task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('#tagDropdownMenu > button').contains(firstTagName).click()

    // Assert
    cy.get('div.tag.btn-group').contains(firstTagName)
  })

  it('adds a second tag to the first task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')

    // Assert
    cy.get('div.tag.btn-group').contains(firstTagName)
    cy.get('div.tag.btn-group').contains(secondTagName)
  })

  it('clicks the Tags button to show the Tags Modal', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')

    // Act
    cy.get('nav.navbar').get('a.nav-link').contains('Tags').click()

    // Assert
    cy.get('div.modal-dialog').contains('Tags')
    cy.get('div.modal-dialog').within(() => {
      cy.get('div.tag.btn-toolbar').eq(0).contains(firstTagName)
      cy.get('div.tag.btn-toolbar').eq(1).contains(secondTagName)
    })
  })

  it('drags one task above the other in the Tags Modal', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(secondTagName + '{enter}')
    cy.get('nav.navbar').get('a.nav-link').contains('Tags').click()

    // Act
    cy.get('div.modal-dialog').within(() => {
      cy.get('div.tag.btn-toolbar').contains(secondTagName)
        .closest('.btn-toolbar').drag('button.move-btn')
    })

    // Assert
    cy.get('div.tag.btn-toolbar').eq(0).contains(secondTagName)
    cy.get('div.tag.btn-toolbar').eq(1).contains(firstTagName)
  })

  it('creates a second task then filters on tag', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Act
    cy.get('button > svg.fa-filter').click()
    cy.get('.dropdown-menu').contains(firstTagName).click()

    // Assert
    cy.get('#incomplete-task-list').contains('My First Task')
    cy.get('#incomplete-task-list').should('not.contain', 'My Second Task')
  })
})
