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
    cy.get('div.tag.btn-group').contains(firstTagName)
  })

  it('selects previous tag to the second task', () => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('#tagDropdownMenu > button').contains(firstTagName).click()
    cy.get('div.tag.btn-group').contains(firstTagName)
  })

  it('adds a second tag to the first task', () => {
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')
    cy.get('div.tag.btn-group').contains(firstTagName)
    cy.get('div.tag.btn-group').contains(secondTagName)
  })

  it('clicks the Tags button to show the Tags Modal', () => {
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')
    cy.get('nav.navbar').get('a.nav-link').contains('Tags').click()
    cy.get('div.modal-dialog').contains('Tags')
    cy.get('div.modal-dialog').within(() => {
      cy.get('div.tag.btn-toolbar').eq(0).contains(firstTagName)
      cy.get('div.tag.btn-toolbar').eq(1).contains(secondTagName)
    })
  })
  
  it('drags one task above the other in the Tags Modal', () => {
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(secondTagName + '{enter}')
    cy.get('nav.navbar').get('a.nav-link').contains('Tags').click()
    cy.get('div.modal-dialog').within(() => {
      cy.get('div.tag.btn-toolbar').contains(secondTagName)
        .closest('.btn-toolbar').drag('button.move-btn')
      cy.get('div.tag.btn-toolbar').eq(0).contains(secondTagName)
      cy.get('div.tag.btn-toolbar').eq(1).contains(firstTagName)
    })
  })
})
