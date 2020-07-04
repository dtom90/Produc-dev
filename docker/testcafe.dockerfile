FROM testcafe/testcafe:1.6.0
USER root
ENV NODE_PATH=/opt:/opt/testcafe/node_modules
RUN  cd /opt/testcafe && npm install moment
USER user
COPY tests/e2e /tests