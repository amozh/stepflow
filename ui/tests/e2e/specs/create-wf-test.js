// https://docs.cypress.io/api/introduction/api.html

describe('Create-Wf Test', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:8080/create')
  })
  it('Save workflow info', () => {
    //check the correct filling of the workflow fields
    cy.get('[data-cy=create-wf-name]')
      .clear()
      .type('Workflow name')
      .should('have.value','Workflow name')

    cy.get('[data-cy=create-wf-description]')
      .clear()
      .type('Workflow description')
      .should('have.value','Workflow description')
  
    cy.get('.jsoneditor-box textarea').should('be.enabled')

    cy.get('.jsoneditor-box')
      .type('json')
      .should('contain','{}json')

    //check the creation of workflow
    cy.get('[data-cy=save-wf-btn]').click()
    
    cy.get('[data-cy=create-wf-btn]').click()

    cy.get('[data-cy=nav-all-wf]').click()

    cy.get('[data-cy=wf-card]')
      .should('contain','Workflow name')
      .should('contain','Workflow description')
   
  })
  it('Create and save new wf-step', () => {
    //check the creation of a new step
    cy.get('[data-cy=plus-btn]').click()

    cy.get('[data-cy=horizontal-slider]')
      .find('[data-cy=open-step-btn]')
      .should('have.text','New step')

    cy.get('[data-cy=open-step-btn]:first-child').click()
    
    //check the correct filling of the wf-step fields
    cy.get('[data-cy=create-wf-step-name]')
    .clear()
    .type('Workflow step name')
    .should('have.value','Workflow step name')

    cy.get('[data-cy=create-wf-step-description]')
    .clear()
    .type('Workflow step description')
    .should('have.value','Workflow step description')

    cy.get('.jsoneditor-box textarea').should('be.enabled')

    //check the creation of a new step action
    cy.get('[data-cy=vertical-slider]')
      .find('[data-cy=plus-btn]')
      .click()

    //check the correct filling of the action fields
    cy.get('[data-cy=vertical-slider]')
      .find('[data-cy=open-action-btn]')
      .should('have.text','New action')
      .click()

    cy.get('[data-cy=action-name]')
      .clear()
      .type('Action name')
      .should('have.value','Action name')

    cy.get('[data-cy=action-description]')
      .clear()
      .type('Action description')
      .should('have.value','Action description')

    //cy.get('[data-cy=action-type]').select('ON_START')
    //cy.get('.mdi-menu-down').click().type('{downarrow}{downarrow}{enter}')
    //cy.get('[data-cy=action-type]').should('have.value', 'ON_START')

    cy.get('[data-cy=action-alias]')
    .clear()
    .type('Alias 2cff2a73-155f-4600')
    .should('have.value','Alias 2cff2a73-155f-4600')

    cy.get('[data-cy=action-js-editor]')
      .type('editor')
      .should('contain','editor')

    //check the deleting and saving of action
    cy.get('[data-cy=save-action-btn]').click()

    cy.get('[data-cy=vertical-slider]')
    .find('[data-cy=open-action-btn]')
    .should('have.text','Action name')

    cy.get('[data-cy=delete-action-btn]').click()
    
    cy.get('[data-cy=delete-action-btn]').should('not.exist');

    //check the deleting and saving of new step
    cy.get('[data-cy=save-step-btn]').click()
    
    cy.get('[data-cy=bread-crumbs]:first-child').click()
    
    cy.get('[data-cy=horizontal-slider]')
      .find('[data-cy=open-step-btn]')
      .should('have.text','Workflow step name')
      .click()

    cy.get('[data-cy=delete-step-btn]').click()
    
    cy.get('[data-cy=horizontal-slider]')
      .find('[data-cy=open-step-btn]')
      .should('not.exist')
  })

})