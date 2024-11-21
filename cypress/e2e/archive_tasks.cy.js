describe('create tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Incomplete Task{enter}')
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
  })

  it('archives a single task', () => {
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()
    cy.get('#completed-task-list').contains('My Second Task').should('not.exist')
    cy.get('#main-section').contains('Archived')
  })

  it('archives a single task', () => {
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()
    cy.get('button').contains('Unarchive').click()
    cy.get('#completed-task-list').contains('My Second Task').should('exist')
    cy.get('#main-section').contains('Archived').should('not.exist')
  })

  it('archives the completed tasks, hiding them from the list', () => {
    cy.get('button > svg.fa-caret-down').click()
    cy.get('button').contains('Archive All').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure that you want to archive all 2 completed tasks?')
      return true
    })
    cy.get('#completed-task-list').contains('My First Task').should('not.exist')
    cy.get('#completed-task-list').contains('My Second Task').should('not.exist')
  })

  it('hides an incomplete archived task from the list', () => {
    cy.get('#incomplete-task-list').contains('My Incomplete Task').click()
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()
    cy.get('#incomplete-task-list').contains('My Incomplete Task').should('not.exist')
    cy.get('#main-section').contains('Archived')
  })

  it('shows archived tasks on checking filter', () => {
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()
    cy.get('button > svg.fa-caret-down').click()
    cy.get('button').contains('Archive All').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure that you want to archive all 2 completed tasks?')
      return true
    })

    cy.contains('label', 'Show archived').click()
    cy.get('#incomplete-task-list').contains('My Incomplete Task').should('exist')
    cy.get('#completed-task-list').contains('My First Task').should('exist')
    cy.get('#completed-task-list').contains('My Second Task').should('exist')
  })
})
