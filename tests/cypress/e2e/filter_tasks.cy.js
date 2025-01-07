describe('filter tasks', () => {
  const firstTagName = 'tag a'
  const secondTagName = 'tag b'
  
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(firstTagName + '{enter}')
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')
  })

  it('should filter on first tag', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('button > svg.fa-filter').click()
    cy.contains('.dropdown-menu', 'Filter on:').within(() => {
      cy.contains('button', firstTagName).click()
    })

    // Assert
    cy.contains('#incomplete-task-list .task', 'My First Task').should('have.length', 1)
    cy.contains('#incomplete-task-list .task', 'My Second Task').should('have.length', 0)
  })

  it('should filter on second tag', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('button > svg.fa-filter').click()
    cy.contains('.dropdown-menu', 'Filter on:').within(() => {
      cy.contains('button', secondTagName).click()
    })

    // Assert
    cy.contains('#incomplete-task-list .task', 'My First Task').should('have.length', 0)
    cy.contains('#incomplete-task-list .task', 'My Second Task').should('have.length', 1)
  })
  
  it('should remove filter to show all again', () => {
    // Arrange
    cy.get('button > svg.fa-filter').click()
    cy.contains('.dropdown-menu', 'Filter on:').within(() => {
      cy.contains('button', firstTagName).click()
    })
    
    // Act
    cy.contains('.dropdown-menu', 'Filtering on tasks with:').within(() => {
      cy.get('button > svg.fa-times').click()
    })
    
    // Assert
    cy.contains('#incomplete-task-list .task', 'My First Task').should('have.length', 1)
    cy.contains('#incomplete-task-list .task', 'My Second Task').should('have.length', 1)
  })
})
