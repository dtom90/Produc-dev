FROM cypress/included:13.15.2
COPY cypress.config.js /opt/app/
COPY cypress /opt/app/cypress
WORKDIR /opt/app